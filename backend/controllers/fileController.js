const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
const File = require("../models/File");

const uploadToCloudinary = (buffer, publicId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "file-sharing-app",
        resource_type: "raw",
        public_id: publicId,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(buffer);
  });
};

const uploadFile = async (req, res, next) => {
  try {
    console.log("UPLOAD API HIT");
    console.log("HEADERS:", req.headers);
    console.log("FILE:", req.file);
    if (!req.file) {
      res.status(400);
      throw new Error("No file uploaded");
    }

    const publicId = `${req.user._id}_${Date.now()}`;
    const uploadResult = await uploadToCloudinary(req.file.buffer, publicId);

    const fileRecord = await File.create({
      user: req.user._id,
      originalName: req.file.originalname,
      filename: uploadResult.public_id,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });

    res.status(201).json({
      message: "File uploaded successfully",
      file: fileRecord,
    });
  } catch (error) {
    next(error);
  }
};

const getUserFiles = async (req, res, next) => {
  try {
    const files = await File.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ files });
  } catch (error) {
    next(error);
  }
};

const getFileById = async (req, res, next) => {
  try {
    const file = await File.findOne({ _id: req.params.id, user: req.user._id });
    if (!file) {
      res.status(404);
      throw new Error("File not found");
    }
    res.json({ file });
  } catch (error) {
    next(error);
  }
};

const deleteFile = async (req, res, next) => {
  try {
    const file = await File.findOne({ _id: req.params.id, user: req.user._id });
    if (!file) {
      res.status(404);
      throw new Error("File not found");
    }

    await cloudinary.uploader.destroy(file.public_id, { resource_type: "raw" });
    await file.deleteOne();

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const generateShareCode = async () => {
  let code;
  let exists = true;

  while (exists) {
    code = String(crypto.randomInt(100000, 1000000));
    exists = await File.exists({ shareCode: code });
  }

  return code;
};

const shareFile = async (req, res, next) => {
  try {
    const file = await File.findOne({ _id: req.params.id, user: req.user._id });
    if (!file) {
      res.status(404);
      throw new Error("File not found");
    }

    if (!file.shareCode) {
      file.shareCode = await generateShareCode();
      file.isShared = true;
      file.sharedAt = new Date();
      await file.save();
    }

    res.json({
      message: "File is now shareable",
      shareCode: file.shareCode,
      file: {
        id: file._id,
        originalName: file.originalName,
        url: file.url,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getSharedFile = async (req, res, next) => {
  try {
    const file = await File.findOne({ shareCode: req.params.code, isShared: true });
    if (!file) {
      res.status(404);
      throw new Error("Shared file not found or code is invalid");
    }

    res.json({
      file: {
        id: file._id,
        originalName: file.originalName,
        mimeType: file.mimeType,
        size: file.size,
        url: file.url,
        sharedAt: file.sharedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadFile, getUserFiles, getFileById, deleteFile, shareFile, getSharedFile };
