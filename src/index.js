import P5 from 'p5'
import {getDistance, isInBounds, MessageLogger} from './util'
import {Grid, Triangle} from './shapes'

let p5
// eslint-disable-next-line no-unused-vars
const drawing = new P5(sketch => {p5 = sketch})

const framesPerSecond = 60
const size = 800

// speed
const maxPixelsPerSecond = 200
const accelerationPerSecond = 10

const center = p5.createVector(size / 2, size / 2)
// const max = p5.createVector(size, size)
const startingPosition = center.copy()
const target = p5.createVector( Math.random() * size - 1, Math.random() * size - 1 )
// const startingDistance = getDistance(target, startingPosition)

const triangle = new Triangle(p5, {position:startingPosition, target})
const log = new MessageLogger(p5)
// const grid = new Grid(p5, size)

function drawFrame () {
  p5.push()
  p5.background(220)
  p5.strokeWeight(10)
  p5.point(target)
  p5.point(center)
  p5.pop()


  // grid.draw()


  const elapsedTimeInSeconds = p5.millis() / 1000
  const secondsPerFrame = p5.deltaTime / 1000
  const maxPixelsPerFrame = maxPixelsPerSecond * secondsPerFrame
  const accelerationPerFrame = accelerationPerSecond * secondsPerFrame

  triangle.setConfig({
    maxSpeed    : maxPixelsPerFrame,
    acceleration: accelerationPerFrame
  })

  triangle.draw()
  triangle.move()

  log.number('triangle distance to target', getDistance(triangle.target, triangle.position).toFixed(2))
  log.number('triangle pixelsPerFrame', triangle.speed.toFixed(2))
  log.number('elapsedTimeInSeconds', elapsedTimeInSeconds.toFixed(2))
  log.graphNumber(triangle.speed)
}

p5.setup = () => {
  p5.createCanvas(size, size)
  p5.frameRate(framesPerSecond)
}

p5.draw = () => {
  drawFrame()

  if (!isInBounds(triangle.position, size) || getDistance(triangle.target, triangle.position) <= 1) {
    console.log('done')
    p5.noLoop()
  }
}
