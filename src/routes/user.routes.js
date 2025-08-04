const userController = require("../controller/user.controller");
const multerSingleMiddleware = require('../utils/imageUpload')
async function userRoutes(fastify, options) {
  fastify.get("/users", userController.getAllUsers);
  fastify.post("/users/register", {preHandler: multerSingleMiddleware},userController.registerUser);
  fastify.post("/users/login", userController.loginUser);
  fastify.post("/users/cart", {preHandler: userController.verifyToken}, userController.addtocart);
  fastify.get('/users/:id', userController.getUser)
}

module.exports = userRoutes;
