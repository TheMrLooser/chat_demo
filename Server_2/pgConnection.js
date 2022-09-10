const {Client} = require('pg');

const client = new Client ({
    host:'localhost',
    user:'postgres',
    port:5432,
    password:'ankush son',
    database:'postgres'
});
console.log('pg is connected')
module.exports = client
