const Feedback = require("../models/feedback.model");

const feedback = async (req, res) => {
  const feedback = new Feedback({
    ticketId: req.body.ticketId,
    rating: req.body.rating,
    comment: req.body.comment,
    customerId: req.body.customerId,
    assignedTo: req.body.assignedTo,
  });

  try {
    const savedFeedback = await feedback.save();
    res.status(201).json(savedFeedback);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = feedback;
