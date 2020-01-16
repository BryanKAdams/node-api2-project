const server = require('./api/server')
server.listen(4040, () => {
    console.log(`Server running on http://localhost:4040`)
})