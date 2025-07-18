const User = require("../models/user.model");
const jwt = require('jsonwebtoken')
const ProductModel = require("../models/product.model")
const BeanModel = require('../models/beans.model')
const CoffeeModel = require('../models/coffeeData.model');
const userModel = require("../models/user.model");
// tokenGen Function Start ---------

function tokengen(email) {
  const key = "thisistehsecretKey"
  const payload = { email };
  const option = { expiresIn: "7d" };
  const token = jwt.sign(payload, process.env.JWT_KEY || key, option)

  return token;
}

// tokenGen Function end -----------







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

    const token = tokengen(email);

    reply.code(201).send({
      message: "User registered successfully",
      token,
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



// !!=----------Login User ---------------=!!


const loginUser = async (req, reply) => {
  try {
    const { email, password } = req.body;

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
    const token = tokengen(email);


    reply.send({
      message: "Login successful",
      token,
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


// !! to check if the user is Authentic !! // 


const verifyToken = async (req, reply, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return reply.code(401).send({ type: false, msg: 'No token provided' });
  }

  const key = "thisistehsecretKey"
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY || key);
    console.log(decoded);

    
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return reply.code(401).send({ type: false, msg: 'User no longer exists' });
    }
    req.user = user;
    next();
  } catch (err) {
    return reply.code(403).send({ type: false, msg: 'Invalid or expired token' });
  }
};

const addtocart = async (req, reply) => {
  const user = req.user;
  
  const { itemId, itemType } = req.body;

  if (!itemId || !itemType) {
    return reply.code(400).send("itemId or itemType not provided");
  }

  let Model;
  if (itemType === 'Product') {
    Model = ProductModel;
  }

  else if (itemType === 'Bean') {
    Model = BeanModel;
  }
  else if (itemType === 'Coffee') {

    Model = CoffeeModel;
  }
  else {
    return reply.code(400).send("Invalid itemType");
  }

  try {
    const item = await Model.findById(itemId);
    if (!item) {
      return reply.code(404).send("Item not found");
    }
    
     const updatedUser = await userModel.findOneAndUpdate(
      {
        _id: user._id,
        "cart.itemId": itemId,
        "cart.itemType": itemType,
      },
      {
        $inc: { "cart.$.quantity": 1 },
      },
      { new: true }
    );

    // If no such item, push it to cart
    if (!updatedUser) {
      await userModel.findByIdAndUpdate(userId, {
        $push: { cart: { itemId, itemType, quantity: 1 } },
      });
    }

    return reply.code(200).send({ type: true, msg: "Item added to cart" });

  } 
  
  catch(err) {
    return reply.code(500).send("Server Errorrrrr"+err);
  }
};





module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  verifyToken,
  addtocart,
};
