const controller = require('../controller/bean.controller')


async function beansRoutes(fastify,options)
{
    fastify.get('/getBeans', controller.getAllBeans)
    fastify.post('/addBeans', controller.addBean)
    fastify.post('/deleteBeans', controller.deleteBean)
}

module.exports = beansRoutes;