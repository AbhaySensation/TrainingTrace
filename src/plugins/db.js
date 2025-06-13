const fp = require("fastify-plugin");
const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnector(fastify, options) {
  try {
    fastify.log.info("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);

    fastify.log.info("MongoDB connected");

    fastify.decorate("mongoose", mongoose);
  } catch (err) {
    fastify.log.error("MongoDB connection failed", err);
    throw err; 
  }
}

module.exports = fp(dbConnector);
