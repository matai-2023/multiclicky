import express from 'express'
import * as Path from 'node:path'

const server = express()

import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {})

httpServer.listen(3000)

server.use(express.json())

server.use(express.static(Path.resolve('public')))

if (process.env.NODE_ENV === 'production') {
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

io.on('connection', (socket) => {
  console.log(socket.id) // x8WIv7-mJelg7on_ALbx
})

io.on('connection', (socket) => {
  console.log('a user connected')
})

export default server
