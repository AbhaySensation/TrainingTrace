const fp = require("fastify-plugin");
const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnector(fastify, options) {
  try {
    fastify.log.info("Connecting to MongoDB...");
    await mongoose.connect("mongodb+srv://TrainingTrace:2r8bIl867n0J6lOU@trainingtrace.w3mkfb0.mongodb.net/Trainingtrace", {
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
