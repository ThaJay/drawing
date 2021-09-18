export function getDistance (target, position) {
  return target.copy().sub(position).mag()
}

export function isInBounds (position, size) {
  const margin = 30

  return (
    position.x < size - margin && position.y < size - margin &&
    position.x > margin && position.y > margin
  )
}

export class MessageLogger {
  textHeight = 0
  textHeights = []

  constructor (p5) {
    this.p5 = p5
  }

  message = (name, message) => {
    if (this.textHeights[name]) {
      this.p5.text(message, 10, this.textHeights[name])
    } else {
      this.textHeights[name] = this.textHeight
      this.textHeight += 20
    }
  }

  vector = (name, vector) => {
    this.message(name, `${name} x: ${vector.x.toFixed(2)} y: ${vector.y.toFixed(2)}`)
  }

  number = (name, number) => {
    this.message(name, `${name}, ${number}`)
  }

  graphDots = []

  graphNumber = (number) => {
    const currentDot = this.p5.createVector(0, 200)
      .add(this.p5.frameCount * 2, -number * 20)

    this.graphDots.push(currentDot)

    this.p5.push()
    this.p5.strokeWeight(3)

    for (const dot of this.graphDots) this.p5.point(dot)

    this.p5.pop()
  }
}


export function limitNumberWithinRange (number, max, min = 0) {
  return Math.min(Math.max(number, min), max)
}
