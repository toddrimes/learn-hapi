'use strict'

const Hapi = require('hapi')
const Boom = require('boom')
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

function handler(request, reply) {
    reply('hello world')
        .code(418)
        .type('text/plain')
        .header('hello','world')
        .state('hello','world')
}

server.register({
    register: require('good'),
    options: goodOptions
}, err => {

    server.route({
        method: 'GET',
        path: '/users/{userId?}',
        handler: handler
    })

    server.start((err) =>  {
        if (err) {
            throw err
        }
        console.log(`Server running at: ${server.info.uri}`)
    })

})


