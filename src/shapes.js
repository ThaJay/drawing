import {isInBounds, limitNumberWithinRange} from './util'

class Shape {
  p5

  constructor ( p5 ) {
    this.p5 = p5
  }
}

export class WanderingTriangle extends Shape {
  worldSize = 100
  angle = 0
  speed = 0
  maxSpeed = 3
  size = 10
  acceleration = 0.2
  maxSteeringSpeed = 2
  steeringSpeed = 0
  lastSteeringAccel = 0
  startingPosition = null
  position = null
  target = null
  maxPixelsPerSecond = null
  accelerationPerSecond = null

  setConfig (config = {}) {
    for (const [key, value] of Object.entries(config)) {
      if (this[key] !== undefined) {
        this[key] = value
      } else {
        throw new Error(`Shape does not have property ${key}`)
      }
    }
  }

  constructor (p5, config) {
    super(p5)
    this.setConfig(config)
    this.position = config.startingPosition.copy()
    this.updateAngle()
  }

  updateAngle = () => {
    this.angle = this.target.copy()
      .sub(this.startingPosition)
      .heading()
  }

  drawNext = () => {
    this.draw()
    this.move()
  }

  draw = () => {
    const {position, angle, size, p5} = this
    p5.push()

    p5.translate(position)
    p5.rotate(angle + (Math.PI / 2))

    p5.stroke(3)
    p5.fill('blue')

    p5.triangle(
      0, 0,
      0 - size, 0 + (2 * size),
      0 + size, 0 + (2 * size)
    )

    p5.pop()
  }

  move = () => {
    this.updateAngle()
    this.updateSpeed()

    const movement = this.p5.createVector(1, 1)
      .setHeading(this.angle)
      .setMag(this.speed)

    this.position.add(movement)
  }

  updateAngle = () => {
    if (!isInBounds(this.position, this.worldSize)) {
      this.angle -= (Math.PI / 4)
    } else {
      const steeringAccel = (Math.random() - 0.5)
      const steeringDelta = (steeringAccel + this.lastSteeringAccel) / 2

      this.steeringSpeed += steeringDelta

      this.steeringSpeed = limitNumberWithinRange(
        this.steeringSpeed,
        this.maxSteeringSpeed,
        -this.maxSteeringSpeed
      )

      const angleChange = this.steeringSpeed / 50

      this.angle += angleChange

      this.lastSteeringAccel = steeringAccel
    }
  }

  // in pixels per frame
  updateSpeed = () => {
    const getDelta = () => {
      const drag = this.speed / this.maxSpeed
      return this.acceleration * (1 - drag)
    }

    this.maxSpeed = (
      this.maxPixelsPerSecond - ((this.steeringSpeed / this.maxSteeringSpeed) * 10)
    ) * this.p5.deltaTime / 1000

    this.acceleration = this.accelerationPerSecond * this.p5.deltaTime / 1000

    if (this.speed < this.maxSpeed) {
      this.speed += getDelta()
    } else {
      this.speed = this.maxSpeed
    }
  }
}

export class Grid extends Shape {
  size

  constructor (p5, size ) {
    super( p5 )
    this.size = size
  }

  drawHorizontalGrid = () => {
    let x = 0

    while (x <= this.size) {
      this.p5.line(0, x, this.size, x)
      x += this.size / 10
    }
  }

  drawVerticalGrid = () => {
    let y = 0

    while (y <= this.size) {
      this.p5.line(y, 0, y, this.size)
      y += this.size / 10
    }
  }

  draw = () => {
    this.p5.push()
    this.p5.stroke('lightblue')
    this.drawHorizontalGrid()
    this.drawVerticalGrid()
    this.p5.pop()
  }
}
