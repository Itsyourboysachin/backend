const mongoose = require("mongoose");

const user = mongoose.model(
  "user",
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phoneNumber: String,
      password: {
        type: String,
        required: true,
      },
      address: {
        type: String,
      },
      role: {
        type: String,
        enum: ["customer", "user", "admin", "superAdmin"],
      },
      status: {
        type: Boolean,
        default: true,
      },
      profilePhoto: {
        data: Buffer,
        Type: String,
      },
      token: {
        type: String,
        default: "",
      },
      is_verified: {
        type: Number,
        default: 0,
      },
      parentId: mongoose.Types.ObjectId,
    },
    { timestamps: true }
  )
);

module.exports = user;
