import {BaseShape} from './baseShape'
import {leavingTraces, wandering} from './shapeProperties'

export class Point extends BaseShape {
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
  }

  constructor (p5, config) {
    super(p5, config)
    this.add()
  }
}

export class Grid extends BaseShape {
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

class Triangle extends BaseShape {
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
