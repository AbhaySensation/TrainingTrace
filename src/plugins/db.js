const fp = require("fastify-plugin");
const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnector(fastify, options) {
  try {
    fastify.log.info("Connecting to MongoDB...");
    await mongoose.connect("mongodb+srv://TrainingTrace:2r8bIl867n0J6lOU@trainingtrace.w3mkfb0.mongodb.net/");

    fastify.log.info("MongoDB connected");

    fastify.decorate("mongoose", mongoose);
  } catch (err) {
    fastify.log.error("MongoDB connection failed", err);
    throw err; 
  }
}

module.exports = fp(dbConnector);
