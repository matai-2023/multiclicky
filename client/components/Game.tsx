/* eslint-disable jsx-a11y/media-has-caption */
import GameOver from './GameOver'
import { Link } from 'react-router-dom'
import Circle from './shapes/Circle'
import Square from './shapes/Square'
import Triangle from './shapes/Triangle'
import Explode from './Explode'
import useGame from './hooks/useGame'
import { motion } from 'framer-motion'
import AddScoreButton from './AddScoreButton'
import GameHeader from './GameHeader'
import { Socket } from 'socket.io-client'
import { useEffect, useState } from 'react'

interface Props {
  socket: Socket
}
function Game(props: Props) {
  const socket = props.socket
  const { states, effects, clicks, audio } = useGame()
  const [playerName, setPlayerName] = useState('')

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <GameHeader title={'Clicky!'} />
        <div>
          <audio ref={audio.audioRef}>
            <source src="../../src/click.wav" type="audio/mpeg" />
            <p>Your browser does not support the audio element.</p>
          </audio>
        </div>
        {!states.start.state ? (
          <form
            className="flex justify-center items-center h-screen"
            onSubmit={clicks.handleStartClick}
          >
            <input name="nickname" placeholder="Enter your nickname"></input>
            {/* <input name="opponent" placeholder="Enter your opponent"></input> */}
            <button className="border-4 rounded text-5xl font-bold text-primary border-primary px-48 py-24 hover:bg-pink2 hover:text-pink3 hover:animate-pulse">
              Start
            </button>
          </form>
        ) : states.opponent.state === '' ? (
          <>
            <img src="/images/loading.gif" alt="loading" />
          </>
        ) : (
          <>
            <div className="flex justify-center p-2 m-4 items-center text-3xl">
              <Link
                className="align-start border-4 border-primary px-4 rounded text-primary hover:bg-pink2 hover:text-pink3 hover:animate-pulse"
                to="/category"
              >
                Go Back
              </Link>
              <h2 className="ml-auto" data-testid="oppName">
                Opponent: {states.opponent.state}
              </h2>
              <h2 className="text-center flex-grow">
                Time: {states.num.state}
              </h2>
              <h2 className="ml-auto" data-testid="score">
                Score: {states.count.state}
              </h2>
            </div>
            {states.num.state !== 0 ? (
              <>
                <div className="flex justify-center items-center p-2">
                  <svg
                    viewBox={`0 0 300 ${states.screenSize.state.height}`}
                    className="border-4 border-primary m-8 cursor-crosshair"
                    onClick={clicks.handleMissClick}
                    data-testid="game-box"
                  >
                    <Square
                      x={states.squareXY.state[0]}
                      y={states.squareXY.state[1]}
                      size={20}
                      handleClick={clicks.handleSquareClick}
                      className={''}
                    />
                    <Circle
                      x={states.circleXY.state[0]}
                      y={states.circleXY.state[1]}
                      radius={10}
                      handleCircleClick={clicks.handleCircleClick}
                      className={''}
                    />
                    <Triangle
                      x={states.triangleXY.state[0]}
                      y={states.triangleXY.state[1]}
                      sideLength={20}
                      handleTriangleClick={clicks.handleTriangleClick}
                      className={''}
                    />
                  </svg>
                  {states.isExploding.state && (
                    <Explode
                      x={states.explosionPosition.state[0] - 100}
                      y={states.explosionPosition.state[1] - 100}
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-20 justify-center items-center border-4 border-primary p-36 m-36 text-center text-3xl">
                <GameOver score={states.count.state} />
                <button
                  className="border-4 rounded text-5xl font-bold text-primary border-primary px-24 py-18 hover:bg-pink2 hover:text-pink3 hover:animate-pulse"
                  onClick={() => window.location.reload()}
                >
                  Restart
                </button>
                <AddScoreButton score={states.count.state} gameId={1} />
              </div>
            )}
          </>
        )}
      </motion.div>
    </>
  )
}

export default Game
