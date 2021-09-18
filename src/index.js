import P5 from 'p5'
import {MessageLogger} from './util'
import {Triangle} from './shapes'

let p5
// eslint-disable-next-line no-unused-vars
const drawing = new P5(sketch => {p5 = sketch})

const worldSize = 800
const framesPerSecond = 60

p5.setup = () => {
  p5.createCanvas(worldSize, worldSize)
  p5.frameRate(framesPerSecond)
}

const target = p5.createVector( Math.random() * worldSize - 1, Math.random() * worldSize - 1 )
const center = p5.createVector(worldSize / 2, worldSize / 2)

function drawBackground () {
  p5.push()
  p5.background(220)
  p5.strokeWeight(10)
  p5.point(target)
  p5.point(center)
  p5.pop()
}

const log = new MessageLogger(p5)

const startingPosition = center.copy()
const maxPixelsPerSecond = 200
const accelerationPerSecond = 5

const triangle = new Triangle(
  p5, {
    startingPosition,
    target,
    worldSize,
    maxPixelsPerSecond,
    accelerationPerSecond
})

function drawLogs () {
  const elapsedTimeInSeconds = p5.millis() / 1000

  log.number('elapsedTimeInSeconds', elapsedTimeInSeconds.toFixed(2))
  log.number('triangle pixelsPerFrame', triangle.speed.toFixed(2))
  log.graphNumber(triangle.speed)
}

function drawFrame () {
  drawBackground()

  triangle.drawNext()

  drawLogs()
}

p5.draw = () => {drawFrame()}
