import React, { useEffect, useState, useRef } from 'react'
import * as coord from '../functions/coordinatefunctions'
import { socket } from '../App'

function useGame() {
  const [screenSize, setScreenSize] = useState(coord.getCurrentDimension)
  const [squareXY, setSquareXY] = useState([0, 0])
  const [circleXY, setCircleXY] = useState([0, 0])
  const [triangleXY, setTriangleXY] = useState([0, 0])
  const [num, setNum] = useState(60)
  const [count, setCount] = useState(0)
  const [shapeScore, setShapeScore] = useState(100)
  const [start, setStart] = useState(false)
  const [isExploding, setIsExploding] = useState(false)
  const [explosionPosition, setExplosionPosition] = useState([0, 0])
  const [shapeSize, setShapeSize] = useState(20)
  const [move, setMove] = useState(false)
  const intervalRef = useRef()

  const decreaseScore = () => setShapeScore((prev) => prev - 1)

  const decreaseSize = () =>
    setShapeSize((prev) => (prev > 5 ? prev - 0.05 : prev))

  const coordEffect = useEffect(() => {
    const xy = coord.getRandom(screenSize)
    setSquareXY(xy[0])
    setCircleXY(xy[1])
    setTriangleXY(xy[2])
  }, [screenSize])

  const dimensionEffect = useEffect(() => {
    const updateDimension = () => {
      setScreenSize(coord.getCurrentDimension())
    }
    window.addEventListener('resize', updateDimension)
    return () => {
      window.removeEventListener('resize', updateDimension)
    }
  }, [])

  const timerEffect = useEffect(() => {
    if (start) {
      intervalRef.current = setInterval(decreaseNum, 1000)
      intervalRef.current = setInterval(decreaseScore, 100)
      intervalRef.current = setInterval(decreaseSize, 1)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [start])

  const decreaseNum = () => {
    setNum((prev) => {
      if (prev > 0) {
        return prev - 1
      } else {
        clearInterval(intervalRef.current)
        return 0
      }
    })
  }

  function explode(
    e:
      | React.MouseEvent<SVGRectElement>
      | React.MouseEvent<SVGCircleElement>
      | React.MouseEvent<SVGPolygonElement>
  ) {
    setExplosionPosition([e.pageX, e.pageY])
    setIsExploding(true)
    setShapeSize(20)
    setMove(!move)
    setTimeout(() => {
      setIsExploding(false)
    }, 250)
  }

  function handleStartClick(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const input = form.get('nickname')?.valueOf() as string
    const oppInput = form.get('opponent')?.valueOf() as string
    console.log(input)
    socket.emit('newPlayer', {
      id: socket.id,
      nickname: input,
      opponent: oppInput,
    })
    socket.emit('findOpponent', {
      id: socket.id,
      nickname: input,
      opponent: oppInput,
    })
    setStart(true)
  }

  function handleMissClick(e: React.MouseEvent<SVGElement>) {
    e.preventDefault()
    if (e.target === e.currentTarget) {
      setCount(count - 50)
      setShapeScore(100)
    }
  }

  function handleSquareClick(e: React.MouseEvent<SVGRectElement>) {
    setSquareXY(coord.getNewXY(circleXY, triangleXY, screenSize))
    setCount(count + shapeScore)
    setShapeScore(100)
    explode(e)
    handlePlay()
  }
  function handleCircleClick(e: React.MouseEvent<SVGCircleElement>) {
    setCircleXY(coord.getNewXY(squareXY, triangleXY, screenSize))
    console.log(circleXY)
    setCount(count + shapeScore)
    setShapeScore(100)
    explode(e)
    handlePlay()
  }

  function handleTriangleClick(e: React.MouseEvent<SVGPolygonElement>) {
    setTriangleXY(coord.getNewXY(squareXY, circleXY, screenSize))
    setCount(count + shapeScore)
    setShapeScore(100)
    explode(e)
    handlePlay()
  }

  const audioRef = useRef(null)
  const handlePlay = () => {
    audioRef.current.play()
  }

  const states = {
    screenSize: { state: screenSize, function: setScreenSize },
    squareXY: { state: squareXY, function: setSquareXY },
    circleXY: { state: circleXY, function: setCircleXY },
    triangleXY: { state: triangleXY, function: setTriangleXY },
    num: { state: num, function: setNum },
    count: { state: count, function: setCount },
    start: { state: start, function: setStart },
    shapeScore: { state: shapeScore, function: setShapeScore },
    isExploding: { state: isExploding, function: setIsExploding },
    explosionPosition: {
      state: explosionPosition,
      function: setExplosionPosition,
    },
    shapeSize: { state: shapeSize, function: setShapeSize },
    move: { state: move, function: setMove },
  }

  const effects = {
    coordEffect,
    dimensionEffect,
    timerEffect,
  }
  const clicks = {
    handleTriangleClick,
    handleCircleClick,
    handleSquareClick,
    handleMissClick,
    handleStartClick,
  }
  const audio = { audioRef }
  return { states, effects, clicks, audio }
}

export default useGame
