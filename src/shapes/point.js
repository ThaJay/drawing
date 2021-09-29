import {BaseShape} from './base-shape'

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
