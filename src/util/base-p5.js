import {MessageLogger} from './helpers'

export class BaseP5 {
  p5
  log

  constructor (p5) {
    this.p5 = p5
    this.log = new MessageLogger(p5)
  }
}
