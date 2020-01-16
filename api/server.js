const express = require('express');
const server = express();
const postsRouter = require('../posts/posts-router')
server.use(express.json());

server.get('/', (req, res) => {
    res.send(`
    <h2> Lambda Posts API </h>
    <p> Welcome to the Lambda Posts API </p>`
    );
});
server.use('/api/posts', postsRouter)

module.exports = server;