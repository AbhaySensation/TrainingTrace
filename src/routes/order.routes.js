const imageUploadRoutes = require('../utils/imageUpload');
const orderController = require('../controller/order.controller.js');

async function orderRoute(fastify, options) {
fastify.post('/orders' , orderController.createOrder);
fastify.get('/orders', orderController.getAllOrders);
fastify.get('/orders/user/:userId', orderController.getUserOrders);
fastify.delete('/orders/:orderId', orderController.deleteUserOrders);
}

module.exports = orderRoute;
