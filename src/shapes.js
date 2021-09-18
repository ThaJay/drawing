import {getDistance} from './util'

class Shape {
  p5

  constructor ( p5 ) {
    this.p5 = p5
  }
}

export class Triangle extends Shape {
  angle = 0
  speed = 0
  maxSpeed = 3
  size = 10
  acceleration = 0.2
  position = null
  target = null

  setConfig (config) {
    for (const [key, value] of Object.entries(config)) {
      if (this[key] !== undefined) {
        this[key] = value
      } else {
        throw new Error(`Shape does not have property ${key}`)
      }
    }
  }

  constructor (p5, config = {}) {
    super(p5)

    console.log('triangle config', config)

    this.setConfig(config)
  }

  getAngle = () => {
    return this.target.copy()
      .sub(this.position)
      .heading() + (Math.PI / 2)
  }

  draw = () => {
    const {position, getAngle, size, p5} = this

    // console.log('angle', angle)
    // console.log('target', this.target)

    p5.push()
    p5.translate(position)
    p5.rotate(getAngle())

    const grid = new Grid(p5, 800)
    grid.draw()

    p5.stroke(3)
    p5.fill('blue')

    p5.triangle(
      0, 0,
      0 - size, 0 + (2 * size),
      0 + size, 0 + (2 * size)
    )

    p5.pop()
  }

  // in pixels per frame
  updateSpeed = () => {
    const getDelta = () => {
      const drag = this.speed / this.maxSpeed
      return this.acceleration * (1 - drag)
    }

    if (this.speed < this.maxSpeed) {
      this.speed += getDelta()
    } else {
      this.speed = this.maxSpeed
    }
  }

  move = () => {
    this.updateSpeed()

    this.position.add(
      this.p5.createVector(1, 1)
        .setHeading(this.getAngle() - (Math.PI / 2))
        .setMag(this.speed)
        .limit(getDistance(this.target, this.position))
    )
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
