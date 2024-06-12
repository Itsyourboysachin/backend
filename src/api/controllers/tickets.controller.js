const ticket = require("../models/ticket.model");
const user = require("../models/users.model");
// Create a new ticket
const createTicket = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      status,
      priority,
      customerId,
      assignedTo,
      comments,
      parentId,
    } = req.body;
    const attachments = req.files.map((file) => ({
      filename: file.originalname,
      data: file.buffer,
      contentType: file.mimetype,
    }));

    const newTicket = new ticket({
      title,
      description,
      category,
      attachments,
      status,
      priority,
      customerId,
      assignedTo,
      comments,
      parentId,
    });

    await newTicket.save();
    res.status(201).send(newTicket);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

// Get all tickets
const getAllTickets = async (req, res) => {
  try {
    const tickets = await ticket.find().exec();
    res.send(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error fetching tickets" });
  }
};

// Get a single ticket
const getSingleTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const ticket = await ticket.findById(ticketId).exec();
    if (!ticket) {
      res.status(404).send({ message: "Ticket not found" });
    } else {
      res.send(ticket);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error fetching ticket" });
  }
};

// Update a ticket
const updateTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const {
      title,
      description,
      category,
      status,
      priority,
      customerId,
      assignedTo,
      comments,
      parentId,
    } = req.body;
    const attachments = req.files.map((file) => ({
      filename: file.originalname,
      data: file.buffer,
      contentType: file.mimetype,
    }));

    const ticket = await ticket
      .findByIdAndUpdate(
        ticketId,
        {
          title,
          description,
          category,
          attachments,
          status,
          priority,
          customerId,
          assignedTo,
          comments,
          parentId,
        },
        { new: true }
      )
      .exec();

    if (!ticket) {
      res.status(404).send({ message: "Ticket not found" });
    } else {
      res.send(ticket);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error updating ticket" });
  }
};

// Delete a ticket
const deleteTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    await ticket.findByIdAndRemove(ticketId).exec();
    res.send({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error deleting ticket" });
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getSingleTicket,
  updateTicket,
  deleteTicket,
};
