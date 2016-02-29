'use strict'

const Hapi = require('hapi')
const server = new Hapi.Server()
const Path = require('path');
var fs = require('fs')
var http = require("http")
var url = require("url")
var xsd = require('libxml-xsd')
var xpath = require('xpath')
var dom = require('xmldom').DOMParser

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

                    var xml = buf.toString()
                    var doc = new dom().parseFromString(xml)
                    var nodes = xpath.select("//link/text()", doc)
                    // console.log(nodes[0].localName + ": " + nodes[0].firstChild.data)
                    console.log(nodes[0].nodeValue )
                    console.log("node: " + nodes[0].toString())

                    xsd.parseFile("atvschema.xsd", function(err, schema){
                        schema.validate(xml, function(err, validationErrors){
                            // err contains any technical error
                            // validationError is an array, null if the validation is ok
                            if(null!=validationErrors) {
                                console.log(`XML NOT VALID`)
                            } else {
                                console.log(`GOOD WORK! XML IS VALID`)
                            }
                        });
                    });

                });
            });


        }
    })

    server.start((err) =>  {
        if (err) {
            throw err
        }
        console.log(`Server running at: ${server.info.uri}`)
    })

})


