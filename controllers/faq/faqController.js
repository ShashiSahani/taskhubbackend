const FAQ = require("../../models/faqs/faqModels");

exports.createFAQs = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res
        .status(400)
        .json({ message: "Question and Answer are required" });
    }
    const newFAQs = new FAQ({ question, answer });
    await newFAQs.save();
    res.status(201).json({ message: "FAQ  Created !", newFAQs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFAQs = async (req, res) => {
  try {
    const faq = await FAQ.find({});
    res.status(200).json(faq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateFAQs = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const updatedFAQ = await FAQ.findByIdAndUpdate(
      req.params.id,
      { question, answer },
      { new: true }
    );
    if (!updatedFAQ) {
      return res.status(404).json({ message: "FAQ not Found" });
    }
    res.status(200).json({ message: "updated", updatedFAQ });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.deleteFAQs = async (req, res) => {
    try {
      const deleteFAQ = await FAQ.findByIdAndDelete(
        req.params.id
        
      );
      if (!deleteFAQ) {
        return res.status(404).json({ message: "FAQ not Found" });
      }
      res.status(200).json({ message: "FAQ deleted successfully", deleteFAQ });
    } catch (error) {
      res.status(500).json({ message: "Error deleting FAQ" });
    }
  };
  
