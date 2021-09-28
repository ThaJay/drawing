export class BaseShape {
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
        // this[key] = value
        throw new Error(`Shape ${this.constructor.name} does not have property ${key}`)
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
    for (const shape of shapes) {
      this.p5.push()
      shape.draw()
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
