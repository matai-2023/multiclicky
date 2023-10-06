import AnimatedRoutes from './AnimatedRoutes'

import { io } from 'socket.io-client'
export const socket = io('http://localhost:3000', { transports: ['websocket'] })

socket.on('connect', () => {})

socket.on('disconnect', () => {})

function App() {
  return (
    <>
      <AnimatedRoutes socket={socket} />
    </>
  )
}

export default App
