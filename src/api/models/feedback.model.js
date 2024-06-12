const mongoose = require("mongoose");

const feedback = mongoose.model(
  "feedback",
  new mongoose.Schema(
    {
      ticketId: {
        type: mongoose.Schema.ObjectId,
        ref: "ticket._id",
      },
      rating: Number,
      comment: String,
      customerId: {
        type: mongoose.Schema.ObjectId,
        ref: "user._id",
      },
      assignedTo: {
        type: mongoose.Schema.ObjectId,
        ref: "user._id",
      },
      parentId: mongoose.Types.ObjectId,
    },
    { timestamps: true }
  )
);

module.exports = feedback;
