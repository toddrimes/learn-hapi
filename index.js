'use strict'

const Hapi = require('hapi')
const server = new Hapi.Server()
const Path = require('path');
var fs = require('fs')
var http = require("http")
var url = require("url")
var xsd = require('libxml-xsd')

var schemaPath = ''

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
}

server.register({
    register: require('inert'),
    options: goodOptions
}, err => {

    server.route({
        method: 'GET',
        path: '/validate',
        handler: function (request, reply) {
            reply(`Hello  ${request.query.xmlURL}!`)
            var path =request.query.xmlURL

            var req = http.get(url.parse(path), function (res) {
                if (res.statusCode !== 200) {
                    console.log(res.statusCode);
                    // handle error
                    return;
                }
                var data = [], dataLen = 0;

                // don't set the encoding, it will break everything !
                // or, if you must, set it to null. In that case the chunk will be a string.

                res.on("data", function (chunk) {
                    data.push(chunk);
                    dataLen += chunk.length;
                });

                res.on("end", function () {
                    var buf = new Buffer(dataLen);
                    for (var i=0,len=data.length,pos=0; i<len; i++) {
                        data[i].copy(buf, pos);
                        pos += data[i].length;
                    }

                    // here we go !
                    console.log(buf.toString());
                });
            });

/*            xsd.parseFile(schemaPath, function(err, schema){
                schema.validate(documentString, function(err, validationErrors){
                    // err contains any technical error
                    // validationError is an array, null if the validation is ok
                    if(null!=validationError) {
                        console.log(`XML NOT VALID`)
                    }
                });
            });*/
        }
    })

    server.start((err) =>  {
        if (err) {
            throw err
        }
        console.log(`Server running at: ${server.info.uri}`)
    })

})


