import {BaseP5} from '../util/base-p5'

export class BaseShape extends BaseP5 {
  position = null
  staticShapes = []
  movingShape = {
    move () {},
    draw () {}
  }

  setConfig (config = {}) {
    for (const [key, value] of Object.entries(config)) {
      if (this[key] !== undefined) {
        this[key] = value
      } else {
        console.log(this)
        // this[key] = value
        throw new Error(`Shape ${this.constructor.name} does not have property ${key}`)
      }
    }
  }

  init () {}

  // constructor (p5, config) {
  //   super(p5)
  // }

  updateShapes () {}

  drawStatic () {
    if (this.staticShapes) {
      for (const shape of this.staticShapes) {
        this.p5.push()
        shape.draw()
        this.p5.pop()
      }
    } else {
      console.log('static shapes are gone', this.staticShapes)
    }
  }

  drawMoving () {
    this.movingShape.move()
    this.p5.push()
    this.movingShape.draw()
    this.p5.pop()
  }

  draw () {
    this.updateShapes()
    this.drawStatic()
    this.drawMoving()
  }
}
