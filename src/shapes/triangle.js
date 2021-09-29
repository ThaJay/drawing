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
