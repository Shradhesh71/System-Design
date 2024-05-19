const {Redis} = require('ioredis');

const client = new Redis({ url: '172.30.0.1:48846' })

module.exports = client;

