import P5 from 'p5'
import {MessageLogger} from './util'
import {Grid, Point, WanderingTriangle} from './shapes'

let p5
// eslint-disable-next-line no-unused-vars
const drawing = new P5(sketch => {p5 = sketch})

const worldSize = 800
const framesPerSecond = 60

p5.setup = () => {
  p5.createCanvas(worldSize, worldSize)
  p5.frameRate(framesPerSecond)
}

function drawBackground () {
  p5.push()
  p5.background(220)
  p5.pop()
}

const log = new MessageLogger(p5)

function drawLogs () {
  const elapsedTimeInSeconds = p5.millis() / 1000

  log.number('elapsedTimeInSeconds', elapsedTimeInSeconds.toFixed(1))
  log.number('triangle pixelsPerFrame', triangle.speed.toFixed(2))
  // log.graphNumber(triangle.speed)
}

const center = p5.createVector(worldSize / 2, worldSize / 2)
const target = p5.createVector(Math.random() * (worldSize - 1), Math.random() * (worldSize - 1))

const startPoint = new Point(p5, {position:center.copy()})
const targetPoint = new Point(p5, {position:target.copy()})
const grid = new Grid(p5, {size:worldSize})

const triangle = new WanderingTriangle(
  p5, {
    worldSize,
    startingPosition     : center.copy(),
    maxPixelsPerSecond   : 50,
    accelerationPerSecond: 2,
    maxSteeringSpeed     : 1.5,
    angle                : target.copy().sub(center).heading()
})

function drawFrame () {
  drawBackground()
  drawLogs()
  grid.draw()
  startPoint.draw()
  targetPoint.draw()

  triangle.draw()
}

p5.draw = () => {drawFrame()}
