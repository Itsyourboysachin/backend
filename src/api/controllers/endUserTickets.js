const CustomerSupportTicket = require("../models/endUserTickets.model");
const User = require("../models/users.model");

// Create a new ticket
const createTicket = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const ticket = new CustomerSupportTicket({
      customerType: req.body.customerType,
      topic: req.body.topic,
      subTopic: req.body.subTopic,
      fullName: user.name,
      email: user.email,
      mobileNo: user.phoneNumber,
      alternativeEmail: req.body.alternativeEmail,
      alternativeMobileNo: req.body.alternativeMobileNo,
      imeiNo1: req.body.imeiNo1,
      imeiNo2: req.body.imeiNo2,
      chooseProduct: req.body.chooseProduct,
      ticketTitle: req.body.ticketTitle,
      ticketDescription: req.body.ticketDescription,
      category: req.body.category,
      attachments: req.files.map((file) => ({
        filename: file.originalname,
        data: file.buffer,
        contentType: file.mimetype,
      })),
    });

    await ticket.save();
    res.json({ message: "Ticket created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: 500 });
  }
};

// Get all tickets
const getAllTickets = async (req, res) => {
  try {
    const tickets = await CustomerSupportTicket.find().populate(
      "fullName",
      "email mobileNo"
    );
    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching tickets" });
  }
};

// Get a single ticket by ID
const getSingleTicket = async (req, res) => {
  try {
    const ticket = await CustomerSupportTicket.findById(req.params.id).populate(
      "fullName",
      "email",
      "mobileNo"
    );
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching ticket" });
  }
};

// Update a ticket
const UpdateTicket = async (req, res) => {
  try {
    const ticket = await CustomerSupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    ticket.customerType = req.body.customerType;
    ticket.topic = req.body.topic;
    ticket.subTopic = req.body.subTopic;
    ticket.alternativeEmail = req.body.alternativeEmail;
    ticket.alternativeMobileNo = req.body.alternativeMobileNo;
    ticket.imeiNo1 = req.body.imeiNo1;
    ticket.imeiNo2 = req.body.imeiNo2;
    ticket.chooseProduct = req.body.chooseProduct;
    ticket.ticketTitle = req.body.ticketTitle;
    ticket.ticketDescription = req.body.ticketDescription;
    ticket.category = req.body.category;
    ticket.status = req.body.status;
    ticket.comments = req.body.comments;

    if (req.files) {
      ticket.attachments = req.files.map((file) => file.filename);
    }

    await ticket.save();
    res.json({ message: "Ticket updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating ticket" });
  }
};

// Delete a ticket
const deleteTicket = async (req, res) => {
  try {
    const ticket = await CustomerSupportTicket.findByIdAndRemove(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting ticket" });
  }
};
// Search tickets
const searchTickets = async (req, res) => {
  try {
    const { topic, category, fromDate, toDate, imeiNo } = req.query;

    // Build search query
    const searchQuery = {};

    if (topic) {
      searchQuery.topic = { $regex: topic, $options: "i" }; // Case-insensitive search
    }

    if (category) {
      searchQuery.category = category;
    }

    if (fromDate || toDate) {
      searchQuery.createdAt = {};
      if (fromDate) {
        searchQuery.createdAt.$gte = new Date(fromDate);
      }
      if (toDate) {
        searchQuery.createdAt.$lte = new Date(toDate);
      }
    }

    if (imeiNo) {
      searchQuery.$or = [{ imeiNo1: imeiNo }, { imeiNo2: imeiNo }];
    }

    const tickets = await CustomerSupportTicket.find(searchQuery).exec();
    res.send(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error searching tickets" });
  }
};
module.exports = {
  createTicket,
  getAllTickets,
  getSingleTicket,
  UpdateTicket,
  deleteTicket,
  searchTickets,
};
