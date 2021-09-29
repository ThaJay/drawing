import {Triangle} from '.'
import {LeavingTraces} from '../properties/leaving-traces'
import {Sensing} from '../properties/sensing'
import {Wandering} from '../properties/wandering'
import {inBounds} from '../util/helpers'

export class WanderingTriangle extends Triangle {
  worldSize = 100
  startingPosition = null
  size = 10
  angle = 0
  // in pixels per frame
  speed = 0

  constructor (p5, config) {
    super(p5, config)
    this.wandering = new Wandering(p5)
    this.traces = new LeavingTraces(p5)
    this.sense = new Sensing(p5)
    this.setConfig(config)
    this.position = config?.startingPosition?.copy() || p5.createVector(0, 0)
    this.init()
  }

  init () {
    this.movingShape = {
      move: this.move,
      draw: () => {
        this.drawShape()
        this.sense.drawShape(this.size)
      }
    }
  }

  move = () => {
    const angleDelta = this.wandering.getAngleDelta(this.angle, inBounds(this.position, this.worldSize))

    this.angle += this.sense.correctAngle(angleDelta)
    this.speed = this.wandering.getNextSpeed(this.speed)

    const movement = this.p5.createVector(1, 1)
      .setHeading(this.angle)
      .setMag(this.speed)

    this.position.add(movement)
  }

  updateShapes = () => {
    this.staticShapes = this.traces.getNext(this.staticShapes, this.position)
  }
}
