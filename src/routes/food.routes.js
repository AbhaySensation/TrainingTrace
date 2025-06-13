const controller = require("../controller/food.controller");

async function foodRoutes(fastify, options) {
  fastify.get("/categories/full", controller.getAllCategories);
  fastify.post("/categories", controller.createCategory);
  fastify.post("/subcategories", controller.createSubcategory);
  fastify.post("/products", controller.createProduct);
}

module.exports = foodRoutes;
