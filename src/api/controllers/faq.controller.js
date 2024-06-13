const Faq = require("../models/faq.model");

// Create FAQ
const createFaq = async (req, res) => {
  try {
    const { question, answer, category, parentId } = req.body;
    const attachments = req.files.map((file) => ({
      filename: file.originalname,
      contentType: file.mimetype,
      data: file.buffer,
    }));
    const faq = new Faq({ question, answer, attachments, category, parentId });
    await faq.save();
    res.send(faq);
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: error.message });
  }
};

// Get all FAQs
const getAllFaq = async (req, res) => {
  try {
    const faqs = await Faq.find().exec();
    res.send(faqs);
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: "Error fetching FAQs" });
  }
};

// Get FAQ by ID
const getFaq = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id).exec();
    if (!faq) {
      res.status(404).send({ message: "FAQ not found" });
    } else {
      res.send(faq);
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: "Error fetching FAQ" });
  }
};

// Update FAQ
const updateFaq = async (req, res) => {
  try {
    const { question, answer, category, parentId } = req.body;
    const attachments = req.files.map((file) => ({
      filename: file.originalname,
      contentType: file.mimetype,
      data: file.buffer,
    }));
    const faq = await Faq.findByIdAndUpdate(
      req.params.id,
      {
        question,
        answer,
        attachments,
        category,
        parentId,
      },
      { new: true }
    ).exec();
    res.send(faq);
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: "Error updating FAQ" });
  }
};

// Delete FAQ
const deleteFaq = async (req, res) => {
  try {
    await Faq.findByIdAndRemove(req.params.id).exec();
    res.send({ message: "FAQ deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: "Error deleting FAQ" });
  }
};

// Search FAQ by Keywords
const searchFaq = async (req, res) => {
  try {
    const keyword = req.body.keyword;
    const faqs = await Faq.find({
      $or: [
        { question: { $regex: keyword, $options: "i" } },
        { answer: { $regex: keyword, $options: "i" } },
      ],
    }).exec();
    res.send(faqs);
  } catch (error) {
    res.status(400).send({ message: "Error searching FAQs" });
  }
};

module.exports = {
  createFaq,
  getAllFaq,
  getFaq,
  updateFaq,
  deleteFaq,
  searchFaq,
};
