const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Get token from Authorization header

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Unauthorized: Invalid token" });
      req.user = decoded; // Attach user to request object
      console.log("Decoded user:", req.user); // Debugging log
    next();
  } );
};

module.exports = verifyToken;
