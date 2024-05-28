const http = require('http')
const next = require('next')
const { Server } = require('socket.io')
const { decode, encode, getToken } = require('next-auth/jwt')
const { getSession } = require('next-auth/react')
const { getServerSession } = require('next-auth/next')
const authOptions = './app/api/authOptions'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3001

const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

app.prepare().then(() => {
    const httpServer = http.createServer(handler)
    const socketIO = new Server(httpServer, {
        cookie: true,
        cors: {
            origin: '*',
            methods: ['POST', 'GET'],
        },
    })

    socketIO.engine.use(async (req, res, next) => {
        console.log(req.headers.cookie)
        const secret = process.env.NEXTAUTH_SECRET
        const authToken = await getToken({
            req,
            secret,
        })
        console.log(authToken)
        // next()
    })

    socketIO.on('connection', async (req, res, next) => {
        console.log('Client connected')
        const { userId, token } = socket.handshake.auth
        console.log(userId, token, 'szmeges')
        const secret = process.env.NEXTAUTH_SECRET
        const authToken = await getToken({
            req: request.headers,
            secret,
            cookieName:
                process.env.NODE_ENV === 'production'
                    ? '__Secure-next-auth.session-token'
                    : 'next-auth.session-token',
        })
        console.log(JSON.stringify(authToken, null, 2), '????', authToken)

        // socket.join(userId)

        // socket.to(userId).emit('helo')
    })
    socketIO.on('webhook-received', (data) => {
        socketIO.emit('send-data', data)
    })

    socketIO.on('disconnect', () => {
        console.log('Client disconnected')
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
