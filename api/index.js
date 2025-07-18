const fastifyApp = require("../src/server.js");

module.exports = async (req, res) => {
  await fastifyApp.ready(); // ensure Fastify is bootstrapped
  fastifyApp.server.emit('request', req, res);
};