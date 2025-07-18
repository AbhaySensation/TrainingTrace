const userController = require("../controller/user.controller");

async function userRoutes(fastify, options) {
  fastify.get("/users", userController.getAllUsers);
  fastify.post("/users/register", userController.registerUser);
  fastify.post("/users/login", userController.loginUser);
  fastify.post("/users/cart", {preHandler: userController.verifyToken}, userController.addtocart);
}

module.exports = userRoutes;
