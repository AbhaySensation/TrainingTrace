const fastify = require("fastify")({ logger: true });
require("dotenv").config();

// Register Plugins
fastify.register(require("./plugins/db"));

// Register Routes
fastify.register(require("./routes/user.routes"));
fastify.register(require('./routes/food.routes'));


// Start Server
const start = async () => {
  try {
   const res= await fastify.listen({ port: process.env.PORT || 3000 });
    console.log("successfully conneted to port ", res);
  } catch (err) {
    console.log("Failed to register");
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
