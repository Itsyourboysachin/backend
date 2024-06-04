const mongoose = require("mongoose");

const user = mongoose.model(
  "user",
  new mongoose.Schema(
    {
      name: {
        type: String,
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
      role: {
        type: String,
        required: true,
        enum: ["customer", "user", "admin", "superAdmin"],
      },
      status: {
        type: Boolean,
        default: true,
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
