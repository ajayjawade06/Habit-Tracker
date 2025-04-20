import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  console.log("Cookies Received: ", req.cookies); // Debugging

  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debugging
    req.user = { id: decoded.id }; // Ensure user ID is stored
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session Expired: Please Log In Again" });
    }
    res.status(400).json({ message: "Invalid Token" });
  }
};

export default authMiddleware;