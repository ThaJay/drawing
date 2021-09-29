import {BaseP5} from '../util/base-p5'

export class Sensing extends BaseP5 {
  sensingDistance = 10
  sensorWidth = (Math.PI / 3)

  drawShape (size) {
    const sensorSize = size * this.sensingDistance
    const rotation = Math.PI + (Math.PI / 2)

    this.p5.strokeWeight(0)
    this.p5.fill('#FFFF0040')
    this.p5.arc(
      0,
      0,
      sensorSize,
      sensorSize,
      -this.sensorWidth + rotation,
      this.sensorWidth + rotation
    )

    const sensorPosition = this.p5.createVector(0, size * -this.sensingDistance / 3)

    this.p5.strokeWeight(30)

    this.p5.stroke('#0040FF88')
    const middleSensorPoint = sensorPosition.copy()
    middleSensorPoint.setHeading(rotation)
    this.p5.point(middleSensorPoint)

    this.p5.stroke('#00FF4088')
    const rightSensorPoint = sensorPosition.copy()
    rightSensorPoint.setHeading(rotation + this.sensorWidth)
    this.p5.point(rightSensorPoint)

    this.p5.stroke('#FF400088')
    const leftSensorPoint = sensorPosition.copy()
    leftSensorPoint.setHeading(rotation - this.sensorWidth)
    this.p5.point(leftSensorPoint)
  }

  targetStraight () {
    return false
  }

  targetLeft () {
    return false
  }

  targetRight () {
    return false
  }

  correctAngle (angle) {
    if (this.targetStraight()) {
      return angle / 2

    } else if (this.targetLeft()) {
      return -Math.abs(angle)

    } else if (this.targetRight()) {
      return Math.abs(angle)

    } else return angle
  }
}
