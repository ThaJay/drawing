import P5 from 'p5'
import {MessageLogger} from './util'
import {Grid, Point, WanderingTriangle} from './shapes/index'

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
  p5.background('#e0be8d')
  p5.pop()
}

const log = new MessageLogger(p5)

function drawLogs () {
  const elapsedTimeInSeconds = p5.millis() / 1000

  log.number('elapsedTimeInSeconds', elapsedTimeInSeconds.toFixed(1))
  // log.number('triangle pixelsPerFrame', triangle.speed.toFixed(2))
  // log.graphNumber(triangle.speed)
}

function getRandomPosition () {
  return p5.createVector(Math.random() * (worldSize - 1), Math.random() * (worldSize - 1))
}

const center = p5.createVector(worldSize / 2, worldSize / 2)
const startPoint = new Point(p5, {position:center.copy()})
// const target = getRandomPosition()
// const targetPoint = new Point(p5, {position:target.copy()})

const grid = new Grid(p5, {size:worldSize})

const entities = []
let entitiesAmount = 50

while (entitiesAmount > 0) {
  entitiesAmount -= 1

  entities.push(
    new WanderingTriangle(
      p5, {
        worldSize,
        startingPosition     : center.copy(),
        maxPixelsPerSecond   : 50,
        accelerationPerSecond: 2,
        maxSteeringSpeed     : 1.5,
        angle                : getRandomPosition().sub(center).heading()
      }
    )
  )
}

function drawFrame () {
  drawBackground()
  drawLogs()
  // grid.draw()
  // targetPoint.draw()
  startPoint.draw()

  for (const entity of entities) {
    entity.draw()
  }
}

p5.draw = () => {drawFrame()}
