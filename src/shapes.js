import {isInBounds, limitNumberWithinRange} from './util'

class Shape {
  p5
  staticShapes = []
  size = 10
  angle = 0
  position = null
  movingShape = {
    move () {},
    draw () {}
  }

  setConfig (config = {}) {
    for (const [key, value] of Object.entries(config)) {
      if (this[key] !== undefined) {
        this[key] = value
      } else {
        this[key] = value
        // throw new Error(`Shape ${this.constructor.name} does not have property ${key}`)
      }
    }
  }

  constructor (p5, config) {
    this.p5 = p5
    this.setConfig(config)
  }

  setProperties (properties = {}) {
    for (const [key, value] of Object.entries(properties)) {
      if (value instanceof Function) {
        this[key] = value.bind(this)
      } else {
        this[key] = value
      }
    }
  }

  updateShapes () {}

  drawShapes (shapes) {
    for (const drawShape of shapes) {
      this.p5.push()
      drawShape()
      this.p5.pop()
    }
  }

  draw () {
    this.updateShapes()
    this.drawShapes(this.staticShapes)

    this.movingShape.move()
    this.movingShape.draw()
  }
}

export class Point extends Shape {
  add () {
    this.staticShapes.push(
      () => {
        const {p5, position} = this

        if (position) {
          p5.strokeWeight(10)
          p5.point(position.x || 100, position.y || 100)
        }
      }
    )

    return this.staticShapes.length - 1
  }

  constructor (p5, config) {
    super(p5, config)
    this.add()
  }
}

export class Grid extends Shape {
  * getPerSize (getShape, amount) {
    let i = 0

    while (i <= this.size) {
      yield getShape(i)
      i += this.size / amount
    }
  }

  getLine (startX, startY, endX, endY) {
    return () => {
      this.p5.stroke('lightblue')
      this.p5.line(startX, startY, endX, endY)
    }
  }

  getLineX = x => {
    return this.getLine(0, x, this.size, x)
  }

  getHorizontals () {
    return this.getPerSize(this.getLineX, 10)
  }

  getLineY = y => {
    return this.getLine(y, 0, y, this.size)
  }

  getVerticals () {
    return this.getPerSize(this.getLineY, 10)
  }

  add () {
    for (const line of this.getHorizontals()) {
      this.staticShapes.push(line)
    }

    for (const line of this.getVerticals()) {
      this.staticShapes.push(line)
    }
  }

  constructor (p5, config) {
    super(p5, config)
    this.add()
  }
}

class Triangle extends Shape {
  drawShape = () => {
    const {position, angle, size, p5} = this

    p5.translate(position)
    p5.rotate(angle + (Math.PI / 2))
    p5.stroke(3)
    p5.fill('blue')
    p5.triangle(
      0, 0,
      -size / 2, size,
      size / 2, size
    )
  }

  add () {
    this.staticShapes[0] = this.drawShape
  }

  constructor (p5, config) {
    super(p5, config)
    this.add()
  }
}

const wandering = {
  worldSize            : 100,
  speed                : 0,
  maxSpeed             : 3,
  acceleration         : 0.2,
  maxSteeringSpeed     : 2,
  steeringSpeed        : 0,
  lastSteeringAccel    : 0,
  startingPosition     : null,
  maxPixelsPerSecond   : null,
  accelerationPerSecond: null,

  // in pixels per frame
  updateSpeed () {
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
  },

  updateAngle () {
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
  },

  move () {
    this.updateSpeed()
    this.updateAngle()

    const movement = this.p5.createVector(1, 1)
      .setHeading(this.angle)
      .setMag(this.speed)

    this.position.add(movement)
  },

  add () {
    this.movingShape = {
      move: this.move,
      draw: this.drawShape
    }
  }
}

const leavingTraces = {
  lastDropped: 0,

  getTrace (position) {
    return () => {
      this.p5.strokeWeight(5)
      this.p5.stroke('red')
      this.p5.point(position)
    }
  },

  dropTrace () {
    this.staticShapes.push(this.getTrace(this.position.copy()))
  },

  updateShapes () {
    const millis = this.p5.millis()

    if (millis - this.lastDropped > 500) {
      this.dropTrace()
      this.lastDropped = millis
    }
  }
}

export class WanderingTriangle extends Triangle {
  constructor (p5, config) {
    super(p5)
    this.setProperties(wandering)
    this.setProperties(leavingTraces)
    this.setConfig(config)
    this.position = config?.startingPosition?.copy() || p5.createVector(0, 0)

    this.add()
  }
}
