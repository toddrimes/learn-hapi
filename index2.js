'use strict'

const Hapi = require('hapi')

const server = new Hapi.Server()

server.connection({
    host:'localhost',
    port:8000
})

let goodOptions = {
    reporters: [{
        reporter: require('good-console'),
        events: { log: ['error'], response: '*' }
    }]
}

server.register({
    register: require('good'),
    options: goodOptions
}, err => {

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            server.log('error', 'Oh no!')
            server.log('info', 'replying')
            reply('Hello hapi!')
        }
    })

    server.route({
        method: 'GET',
        path: '/{name}',
        handler: function (request, reply) {
            reply(`Hello  ${request.params.name}!`)
        }
    })

    server.start((err) =>  {
        if (err) {
            throw err
        }
        console.log(`Server running at: ${server.info.uri}`)
    })

})


