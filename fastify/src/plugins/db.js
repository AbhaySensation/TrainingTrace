const fp = require("fastify-plugin");
const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnector(fastify, options) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    fastify.log.info("MongoDB connected");
  } catch (err) {
    fastify.log.error(err);
    console.log("Failed to connect with server");
    process.exit(1);
  }
}

module.exports = fp(dbConnector);
