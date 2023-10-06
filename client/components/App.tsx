import AnimatedRoutes from './AnimatedRoutes'

import { io } from 'socket.io-client'
const socket = io('http://localhost:3000', { transports: ['websocket'] })

socket.on('connect', () => {
  console.log(socket.id)
})

socket.on('disconnect', () => {
  console.log('Disconnected', socket.id)
})

function App() {
  return (
    <>
      <AnimatedRoutes socket={socket} />
    </>
  )
}

export default App
