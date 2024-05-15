const http = require('http')
const next = require('next')
const { Server } = require('socket.io')

const production = process.env.NODE_ENV === 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ production, hostname, port })
const handler = app.getRequestHandler()

app.prepare().then(() => {
    const httpServer = http.createServer(handler)
    const socketIO = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['POST', 'GET'],
        },
    })

    socketIO.on('connection', (socket) => {
        console.log('Client connected')

        socket.on('webhook-received', (data) => {
            socketIO.emit('send-data', data)
        })

        socket.on('disconnect', () => {
            console.log('Client disconnected')
        })
    })

    httpServer
        .once('error', (err) => {
            console.error(err)
            process.exit(1)
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`)
        })
})
