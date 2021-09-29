import {BaseShape} from './base-shape'

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
