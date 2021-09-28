import {isInBounds, limitNumberWithinRange} from '../util'

export const wandering = {
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

export const leavingTraces = {
  strokeWeight: 5,
  lastDropped : 0,
  dropInterval: 50,
  fadeTime    : 15 * 1000,

  getTrace (position, strokeWeight = this.strokeWeight) {
    return () => {
      this.p5.strokeWeight(strokeWeight)
      this.p5.stroke('red')
      this.p5.point(position)
    }
  },

  dropTrace () {
    this.staticShapes.push({
      draw    : this.getTrace(this.position.copy()),
      position: this.position.copy()
    })
  },

  fadeTraces () {
    const amount = this.staticShapes.length
    const maxAmount = this.fadeTime / this.dropInterval
    const strokeStep = this.strokeWeight / maxAmount
    let currentStrokeWeight = this.strokeWeight

    if (amount > maxAmount) {
      this.staticShapes = this.staticShapes.slice(Math.max(amount - maxAmount, 0))
    }

    for (let i = this.staticShapes.length; i--;) {
      const shape = this.staticShapes[i]

      shape.draw = this.getTrace(shape.position, currentStrokeWeight)
      currentStrokeWeight -= strokeStep
    }
  },

  updateShapes () {
    const millis = this.p5.millis()

    if (millis - this.lastDropped > this.dropInterval) {
      this.fadeTraces()
      this.dropTrace()
      this.lastDropped = millis
    }
  }
}
