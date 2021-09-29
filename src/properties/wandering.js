import {BaseP5} from '../util/base-p5'
import {limitNumberWithinRange} from '../util/helpers'

export class Wandering extends BaseP5 {
  maxSpeed = 3
  acceleration = 0.2
  maxPixelsPerSecond = 50
  steeringSpeed = 0
  maxSteeringSpeed = 2
  accelerationPerSecond = 2
  lastSteeringAccel = 0

  getDelta (speed) {
    const drag = speed / this.maxSpeed
    return this.acceleration * (1 - drag)
  }

  getNextSpeed (speed) {
    this.maxSpeed = (
      this.maxPixelsPerSecond - ((this.steeringSpeed / this.maxSteeringSpeed) * 10)
    ) * this.p5.deltaTime / 1000

    this.acceleration = this.accelerationPerSecond * this.p5.deltaTime / 1000

    if (speed < this.maxSpeed) {
      return speed + this.getDelta(speed)
    } else {
      // console.log('max speed')
      return this.maxSpeed
    }
  }

  getAngleDelta (isInBounds) {
    if (!isInBounds) {
      return -(Math.PI / 4)

    } else {
      const steeringAccel = Math.random() - 0.5
      const steeringDelta = (steeringAccel + this.lastSteeringAccel) / 2

      this.steeringSpeed += steeringDelta

      this.steeringSpeed = limitNumberWithinRange(
        this.steeringSpeed,
        this.maxSteeringSpeed,
        -this.maxSteeringSpeed
      )

      const angleChange = this.steeringSpeed / 50

      this.lastSteeringAccel = steeringAccel

      return angleChange

    }
  }
}
