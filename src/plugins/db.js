const fp = require("fastify-plugin");
const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnector(fastify, options) {
  try {
    fastify.log.info("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    fastify.log.info("MongoDB connected");

    // Decorate fastify instance with mongoose so it's accessible elsewhere
    fastify.decorate("mongoose", mongoose);
  } catch (err) {
    fastify.log.error("MongoDB connection failed", err);
    throw err; // This is important: let Fastify handle the failure
  }
}

module.exports = fp(dbConnector);
