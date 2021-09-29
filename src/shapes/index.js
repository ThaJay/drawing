import {BaseShape} from './base-shape'

export class Triangle extends BaseShape {
  constructor (p5, config) {
    super(p5, config)
    this.init()
  }

  init () {
    this.staticShapes.push({draw:this.drawShape})
  }

  drawShape () {
    const {position, angle, size, p5} = this
    const halfSize = size / 2

    p5.translate(position)
    p5.rotate(angle + (Math.PI / 2))
    p5.stroke(3)
    p5.fill('blue')
    p5.triangle(
      0, -halfSize,
      -halfSize, halfSize,
      halfSize, halfSize
    )
  }
}

export class Point extends BaseShape {
  strokeWeight = 10

  constructor (p5, config) {
    super(p5, config)
    this.init()
  }

  init () {
    this.staticShapes.push({
      draw: () => {
        const {p5, position} = this

        if (position) {
          p5.strokeWeight(this.strokeWeight)
          p5.point(position.x, position.y)
        }
      }
    })
  }
}

export class Grid extends BaseShape {
  constructor (p5, config) {
    super(p5, config)
    this.init()
  }

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

  init () {
    for (const draw of this.getHorizontals()) {
      this.staticShapes.push({draw})
    }

    for (const draw of this.getVerticals()) {
      this.staticShapes.push({draw})
    }
  }
}
