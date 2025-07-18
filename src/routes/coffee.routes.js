const controller = require('../controller/coffee.controller')


async function coffeeRoutes(fastify,options)
{
    fastify.get('/getCoffee', controller.getAllCoffee)
    fastify.post('/addCoffee', controller.addCoffee)
    fastify.post('/deleteCoffee', controller.deleteCoffee)
}

module.exports = coffeeRoutes;