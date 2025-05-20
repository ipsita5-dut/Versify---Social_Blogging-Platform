const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String }, // supports image URL
  tags: [{ type: String }], // comma-separated converted to array
  author: { type: String, required: true }, // Store username or userId
  createdAt: { type: Date, default: Date.now },
  comments: [commentSchema],  // <-- Add this

});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
