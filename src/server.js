
const fastify = require("fastify")({ logger: true });
require("dotenv").config();
const imageUploadRoutes = require("./utils/imageUpload");

// Register Plugins
fastify.register(require("./plugins/db"));
fastify.register(require('@fastify/multipart'),{
    limits: {
    fileSize: 100 * 1024 * 1024 // 100 MB, adjust as needed
  }
});
fastify.register(require('@fastify/formbody'));


// Register Routes
fastify.register(require("./routes/user.routes"));
fastify.register(require('./routes/food.routes'));
fastify.register(require('./routes/order.routes'));
fastify.register(require('./routes/bean.routes'))
fastify.register(require('./routes/coffee.routes'))
fastify.register(imageUploadRoutes);


// Start Server
// const start = async () => {
//   try {
//    const res = await fastify.listen({ port:  3000, host: '0.0.0.0' });
//     console.log("successfully conneted to port  ", res);
//   } catch (err) {
//     console.log("Failed to register");
//     fastify.log.error(err);
//     process.exit(1);
//   }
// };

// start();

module.exports = fastify;