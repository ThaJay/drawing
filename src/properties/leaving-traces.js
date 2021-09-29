import {BaseP5} from '../util/base-p5'

export class LeavingTraces extends BaseP5 {
  lastDropped = 0
  traceStrokeWeight = 5
  fadeTime = 10 * 1000
  dropInterval = 200

  getTrace (position, stroke = this.traceStrokeWeight) {
    return () => {
      this.p5.strokeWeight(stroke)
      this.p5.stroke('red')
      this.p5.point(position)
    }
  }

  fadeTraces (traces) {
    const amount = traces.length
    const maxAmount = this.fadeTime / this.dropInterval
    const strokeStep = this.traceStrokeWeight / maxAmount

    let newTraces

    if (amount > maxAmount) {
      newTraces = traces.slice(Math.max(amount - maxAmount, 0))
    } else {
      newTraces = [...traces]
    }

    let currentStrokeWeight = this.traceStrokeWeight
    for (let i = newTraces.length; i--;) {
      newTraces[i].draw = this.getTrace(newTraces[i].position, currentStrokeWeight)
      currentStrokeWeight -= strokeStep
    }

    return newTraces
  }

  dropTrace (traces, position) {
    traces.push({
      draw    : this.getTrace(position.copy()),
      position: position.copy()
    })

    return traces
  }

  getNext (traces, position) {
    const millis = this.p5.millis()

    if (millis - this.lastDropped > this.dropInterval) {
      this.lastDropped = millis

      return this.dropTrace(this.fadeTraces(traces), position)
    } else {
      return traces
    }
  }
}
