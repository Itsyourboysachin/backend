const mongoose = require("mongoose");
const user = require("./users.model");
const ticket = mongoose.model(
  "ticket",
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      category: {
        type: String,
      },
      attachments: [
        {
          filename: {
            type: String,
            required: true,
          },
          data: {
            type: Buffer,
            required: true,
          },
          contentType: {
            type: String,
            required: true,
          },
        },
      ],
      status: {
        type: String,
        required: true,
      },
      priority: {
        type: String,
        required: true,
      },
      customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user._id",
        // required: true,
      },
      assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user._id",
        // required: true,
      },
      comments: {
        type: String,
      },
      parentId: mongoose.Types.ObjectId,
    },
    { timestamps: true }
  )
);

module.exports = ticket;
