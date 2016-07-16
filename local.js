"use strict";
let alexa = require('alexa-app');
let app = new alexa.app();
let redis = require('redis');
let promise = require('bluebird');
let requestify = require('requestify');
// promise.config({
//     longStackTraces: false,
//     warnings: false
// });
let config = require('config').get('Amazon');

promise.promisifyAll(redis.RedisClient.prototype);
promise.promisifyAll(redis.Multi.prototype);

let client = redis.createClient({ url : 'redis://x:RCUNSNGAXRBALSAT@aws-us-east-1-portal.21.dblayer.com:10106'});

client.on("error", function (err) {
    console.log("Redis Client error " + err);
});

client.setAsync(['ttl key', 'ttl val']).then(function(){
    console.log('key set');
});