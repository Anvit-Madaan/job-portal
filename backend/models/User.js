const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

console.log("[DEBUG] loading User model from", __filename);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);

const genSalt = (rounds) =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(rounds, (err, salt) => {
      if (err) return reject(err);
      resolve(salt);
    });
  });

const hashPassword = (password, salt) =>
  new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) return reject(err);
      resolve(hash);
    });
  });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await genSalt(10);
  this.password = await hashPassword(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
