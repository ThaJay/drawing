import P5 from 'p5'
// import {MessageLogger} from './util/helpers'
import {Point} from './shapes/point'
import {WanderingTriangle} from './shapes/wandering-triangle'

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

function getRandomPosition () {
  return p5.createVector(Math.random() * (worldSize - 1), Math.random() * (worldSize - 1))
}

const center = p5.createVector(worldSize / 2, worldSize / 2)
const startPoint = new Point(p5, {position:center.copy()})

const entities = []
let entitiesAmount = 1

while (entitiesAmount > 0) {
  entitiesAmount -= 1

  entities.push(
    new WanderingTriangle(
      p5, {
        worldSize,
        startingPosition: center.copy(),
        angle           : getRandomPosition().sub(center).heading()
      }
    )
  )
}

function drawFrame () {
  drawBackground()
  startPoint.draw()

  for (const entity of entities) entity.draw()
}

p5.draw = () => {drawFrame()}
