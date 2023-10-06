import express from 'express'
import * as Path from 'node:path'

const server = express()

import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {})
interface playerData {
  id: string
  nickname: string
  opponent: string
}
const players = [] as playerData[]
const playingArray = [] as any[]

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
  // console.log(socket.id) // Display user's socket ID when they connect
  console.log(`${socket.id} connected`) // Display a message when a user connects

  socket.on('newPlayer', (data) => {
    // players.push(e)
    // console.log(players)
    if (data != null) {
      players.push(data)
      console.log(players)
      if (players.length >= 2) {
        const p1obj = {
          p1name: players[0].nickname,
          opponent: players[1].nickname,
        }
        const p2obj = {
          p2name: players[1].nickname,
          opponent: players[0].nickname,
        }

        const obj = {
          p1: p1obj,
          p2: p2obj,
          sum: 1,
        }
        playingArray.push(obj)

        players.splice(0, 2)

        socket.emit('find', { allPlayers: playingArray })
      }
    }
  })
  // socket.on('findOpponent', (data) => {
  //   players.forEach((value, index) => {
  //     if (value.nickname == data.opponent) {
  //       players[index].opponent = data.nickname
  //     }
  //   })
  //   //console.log(players)
  //   socket.emit('players', players)
  // })

  // socket.on('findOpponent', (e) => {
  //   if (e.name != null) {
  //     players.push(e.name)

  //     if (players.length >= 2) {
  //       const p1obj = {
  //         p1name: players[0],
  //         p2name: players[1],
  //       }
  //       const p2obj = {
  //         p2name: players[1],
  //         p1name: players[0],
  //       }

  //       const obj = {
  //         p1: p1obj,
  //         p2: p2obj,
  //         sum: 1,
  //       }
  //       playingArray.push(obj)

  //       players.splice(0, 2)

  //       io.emit('find', { allPlayers: playingArray })
  //     }
  //   }
  // })

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`) // Display a message when a user disconnects
  })
})

export default server
