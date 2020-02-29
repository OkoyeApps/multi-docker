const keys = require('./keys');
//Express App Setup
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
console.log("afdadfa", keys.pgPassword)

//Postgres client server
const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on('error', () => console.Console("Lost PG connection"));


pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch(err => console.log(err));


// Redis Client Setup

const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();


//Express route handlers

app.get('/', (req, res) => {
    res.send('Hi');
});

app.get('/values/all', (req, res) => {
    console.log("in the api");
    pgClient.query('SELECT * FROM values').then(result => {
        console.log("data fetched", result.rows)
        res.send(result.rows);
    }).catch(error => console.log(error));
});

app.get('/values/current', (req, res) => {
    redisClient.HGETALL('values', (err, values) => {
        res.send(values);
    });
});

app.post('/values', (req, res) => {
    var index = req.body.index;
    if (parseInt(index) > 40) {
        return res.status(422).send('Index too high');
    }

    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values (number) Values($1)', [index]).then(result => {
        res.send({ working: true });
    });
});

app.listen(5000, (error) => {
    console.log("Listening")
});