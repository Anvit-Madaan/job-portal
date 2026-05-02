const Contact = require("../models/Contact");

const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      res.status(400);
      throw new Error("Name, email, and message are required");
    }

    const contact = await Contact.create({ name, email, message });
    res.status(201).json({ message: "Contact message received", contact });
  } catch (error) {
    next(error);
  }
};

const getContactMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ messages });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitContactMessage, getContactMessages };
