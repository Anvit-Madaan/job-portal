const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    isShared: { type: Boolean, default: false },
    shareCode: { type: String },
    sharedAt: { type: Date },
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);
module.exports = File;
