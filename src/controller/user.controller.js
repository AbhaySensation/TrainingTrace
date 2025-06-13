const User = require("../models/user.model");

// Register a new user
const registerUser = async (req, reply) => {
  try {
    const { fullname, username, email, password, phoneNumber } = req.body;

    // Basic validation
    const errors = {};

    if (!fullname) errors.fullname = "Full name is required";
    if (!username) errors.username = "Username is required";
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";

    if (Object.keys(errors).length > 0) {
      return reply
        .code(400)
        .send({ error: "Validation failed", fields: errors });
    }

    // Check if user/email already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return reply
        .code(400)
        .send({ error: "User with given email or username already exists" });
    }

    const user = new User({ fullname, username, email, password, phoneNumber });
    await user.save();

    reply.code(201).send({
      message: "User registered successfully",
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    reply.code(500).send({ error: "Server error", details: err.message });
  }
};

// Login user
const loginUser = async (req, reply) => {
  try {
    const { email, password } = req.body; // identifier can be email or username

    if (!email || !password) {
      return reply
        .code(400)
        .send({ error: "Identifier and password are required" });
    }

    const user = await User.findOne({
      $or: [{ email: email }, { username: email }],
    });

    if (!user) {
      return reply.code(401).send({ error: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return reply.code(401).send({ error: "Invalid credentials" });
    }

    // Respond with user details (no token yet)
    reply.send({
      message: "Login successful",
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    reply.code(500).send({ error: "Server error", details: err.message });
  }
};

// Get all users
const getAllUsers = async (req, reply) => {
  try {
    const users = await User.find().select("-password");
    reply.send(users);
  } catch (err) {
    reply
      .code(500)
      .send({ error: "Failed to fetch users", details: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
};
