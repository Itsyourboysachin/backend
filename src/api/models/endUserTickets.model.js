const mongoose = require("mongoose");

const CustomerSupportTicket = mongoose.model(
  "EndUserTicket",
  new mongoose.Schema(
    {
      customerType: {
        type: String,
        required: true,
      },
      topic: {
        type: String,
        required: true,
      },
      subTopic: {
        type: String,
        required: true,
      },
      fullName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      mobileNo: {
        type: Number,
        required: true,
      },
      alternativeEmail: {
        type: String,
      },
      alternativeMobileNo: {
        type: String,
      },
      imeiNo1: {
        type: String,
      },
      imeiNo2: {
        type: String,
      },
      chooseProduct: {
        type: String,
        required: true,
      },
      ticketTitle: {
        type: String,
        required: true,
      },
      ticketDescription: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      attachments: [
        {
          filename: {
            type: String,
            required: true,
          },
          data: {
            type: Buffer,
          },
          contentType: {
            type: String,
            required: true,
          },
        },
      ],
      comments: {
        type: String,
      },
      status: {
        type: String,
      },
      parentId: mongoose.Types.ObjectId,
    },
    { timestamps: true }
  )
);

module.exports = CustomerSupportTicket;
