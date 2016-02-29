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
    reply(request.params)
}

server.register({
    register: require('good'),
    options: goodOptions
}, err => {

    server.route({
        method: 'GET',
        path: '/users/{userId?}',
        handler: function(request, reply) {
            reply(Boom.notFound())
        }
    })

    server.start((err) =>  {
        if (err) {
            throw err
        }
        console.log(`Server running at: ${server.info.uri}`)
    })

})


