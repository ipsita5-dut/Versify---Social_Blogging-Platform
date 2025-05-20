// const express = require("express");
// const router = express.Router();
// const Blog = require("../models/Blog");
// const verifyToken = require("../middlewares/authMiddleware"); // Ensure you have this middleware for protected routes
// const upload = require("../middlewares/upload");
// const path = require("path");

// // Create a new blog post
// router.post("/",verifyToken,upload.single("image"),async (req, res) => {
//   try {
//     const { title, content, author,tags  } = req.body;
//     let imageUrl = "";
    
//     if (req.file) {
//       imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
//     }
//     const tagArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];

//     // Validate request body
//     if (!title || !content) {
//       return res.status(400).json({ message: "Title and content are required." });
//     }
//     const newBlog = new Blog({
//       title,
//       content,
//       author: req.user.username, 
//       tags: tagArray,
//       image: imageUrl,// Use the user ID from the token
//     });
    
//     await newBlog.save();
//     res.status(201).json(newBlog);
//   } catch (err) {
//     console.error("Error creating blog post:", err); // Log the error for debugging

//     res.status(500).json({ message: "Error creating blog post" });
//   }
// });

// // Get all blog posts
// router.get("/", async (req, res) => {
//   console.log("GET /api/blogs called"); // Debugging log

//   try {
//     const blogs = await Blog.find().sort({ createdAt: -1 });
//     res.json(blogs);
//   } catch (err) {
//     console.error("Error fetching blogs:", err); // Log the error for debugging

//     res.status(500).json({ message: "Error fetching blogs" });
//   }
// });
// // Get blogs by logged-in user
// router.get("/myblogs", verifyToken, async (req, res) => {
//   try {
//     const blogs = await Blog.find({ author: req.user.username }).sort({ createdAt: -1 });
//     res.json(blogs);
//   } catch (err) {
//     console.error("Error fetching user's blogs:", err);
//     res.status(500).json({ message: "Error fetching your blogs" });
//   }
// });
// // Update a blog post
// router.put("/:id", verifyToken, upload.single("image"), async (req, res) => {
//   try {
//         const blogId = req.params.id;

//     const { title, content, tags } = req.body;
//     let imageUrl = "";

//     // If a new image is uploaded
//     if (req.file) {
//       imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
//     }else if (req.body.image) {
//       imageUrl = req.body.image; // Existing image URL passed from frontend
//     }

//     const tagArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];

//     if (!title && !content) {
//       return res.status(400).json({ message: "At least one of title or content is required." });
//     }

//      const blog = await Blog.findById(blogId);
//     if (!blog) return res.status(404).json({ message: "Blog not found" });

//     if (blog.author !== req.user.username) {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     blog.title = title || blog.title;
//     blog.content = content || blog.content;
//     blog.tags = tagArray;
//     blog.image = imageUrl;

//     await blog.save();
//     res.json(blog);
//   } catch (err) {
//     console.error("Error updating blog post:", err);
//     res.status(500).json({ message: "Error updating blog post" });
//   }
// });

// // Delete a blog post
// router.delete("/:id", verifyToken, async (req, res) => {
//   try {
//     const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
//     if (!deletedBlog) {
//       return res.status(404).json({ message: "Blog post not found" });
//     }
//     res.json({ message: "Blog deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting blog post:", err); // Log the error for debugging
//     res.status(500).json({ message: "Error deleting blog post" });
//   }
// });


// module.exports = router;

const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const verifyToken = require("../middlewares/authMiddleware"); // Ensure you have this middleware for protected routes
const upload = require("../middlewares/upload");
const path = require("path");

// Create a new blog post
router.post("/",verifyToken,upload.single("image"),async (req, res) => {
  try {
    const { title, content, author,tags  } = req.body;
    let imageUrl = "";
    
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }
    const tagArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];

    // Validate request body
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }
    const newBlog = new Blog({
      title,
      content,
      author: req.user.username, 
      tags: tagArray,
      image: imageUrl,// Use the user ID from the token
    });
    
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    console.error("Error creating blog post:", err); // Log the error for debugging

    res.status(500).json({ message: "Error creating blog post" });
  }
});

// Get all blog posts
router.get("/", async (req, res) => {
  console.log("GET /api/blogs called"); // Debugging log

  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error("Error fetching blogs:", err); // Log the error for debugging

    res.status(500).json({ message: "Error fetching blogs" });
  }
});

// Get blogs by logged-in user
router.get("/myblogs", verifyToken, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.username }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error("Error fetching user's blogs:", err);
    res.status(500).json({ message: "Error fetching your blogs" });
  }
});

// Update a blog post
router.put("/:id", upload.single("image"),async (req, res) => {
  try {
    const { title, content,tags  } = req.body;
    let imageUrl = req.body.image;

    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const tagArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];

    // Validate request body
    if (!title && !content) {
      return res.status(400).json({ message: "At least one of title or content is required." });
    }
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content ,
        tags: tagArray,
        image: imageUrl,
      },
      { new: true, runValidators: true } // runValidators ensures that the update adheres to the schema
    );
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.json(updatedBlog);
  } catch (err) {
    console.error("Error updating blog post:", err); // Log the error for debugging

    res.status(500).json({ message: "Error updating blog post" });
  }
});

// Delete a blog post
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Error deleting blog post:", err); // Log the error for debugging
    res.status(500).json({ message: "Error deleting blog post" });
  }
});



// Get a single blog post by ID
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (err) {
    console.error("Error fetching blog by ID:", err);
    res.status(500).json({ message: "Error fetching blog" });
  }
});

// Add a comment to a blog post
router.post("/:id/comments", verifyToken, async (req, res) => {
  const blogId = req.params.id;
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Comment text cannot be empty" });
  }

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    const newComment = {
      author: req.user.username,  // Assuming username is in the token
      text: text.trim(),
      date: new Date(),
    };

    blog.comments.push(newComment);
    await blog.save();

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment" });
  }
});

// Optional: Get comments for a blog post (usually included when you get blog details)
// But if you want a separate route:
router.get("/:id/comments", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).select("comments");
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.json(blog.comments || []);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments" });
  }
});

module.exports = router;
