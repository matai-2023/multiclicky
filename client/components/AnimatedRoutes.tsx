import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './Home'
import Category from './Category'
import BounceGame from './BounceGame'
import Game from './Game'
import Explode from './Explode'
import ScoreRanking from './ScoreRanking'
import { AnimatePresence } from 'framer-motion'
import ShrinkyGame from './ShrinkyGame'
import AddNickname from './AddNickname'
import MoveyGame from './MoveyGame'
import PainGame from './PainGame'
import { Socket } from 'socket.io-client'

interface Props {
  socket: Socket
}
function AnimatedRoutes(props: Props) {
  const socket = props.socket
  const location = useLocation()
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/category" element={<Category />} />
        <Route path="/clicky" element={<Game socket={socket} />} />
        <Route path="/bounce" element={<BounceGame />} />
        <Route path="/shrinky" element={<ShrinkyGame />} />
        <Route path="/movey" element={<MoveyGame />} />
        <Route path="/pain" element={<PainGame />} />
        <Route path="/explode" element={<Explode />} />
        <Route path="/ranking" element={<ScoreRanking />} />
        <Route path="/addnickname" element={<AddNickname />} />
      </Routes>
    </AnimatePresence>
  )
}

export default AnimatedRoutes
