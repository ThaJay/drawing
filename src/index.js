import P5 from 'p5'

let p5
const drawing = new P5(sketch => {p5 = sketch})
console.log('drawing', drawing, '\np5', p5)

const size = 800
const maxSpeed = 4
let speed = 0
let acceleration = 0
let angle = 0
// const steerStrength = 2

const center = p5.createVector(size / 2, size / 2)
const max = p5.createVector(size, size)
const position = center.copy()
const target = p5.createVector(Math.random() * size - 1, Math.random() * size - 1)

function getDistance (target, position) {
  return target.copy().sub(position).mag()
}

const startingDistance = getDistance(target, position)

// const velocity = p5.createVector(0, 0)
// const desiredVelocity = p5.createVector(0, 0)
// const desiredDirection = p5.createVector(0, 0)
// const desiredSteeringForce = center.copy()

// function drawHorizontalGrid () {
//   let x = 0

//   while (x < size) {
//     p5.line(0, x, size, x)
//     x += 100
//   }
// }

// function drawVerticalGrid () {
//   let y = 0

//   while (y < size) {
//     p5.line(y, 0, y, size)
//     y += 100
//   }
// }

// function drawGrid () {
//   drawHorizontalGrid()
//   drawVerticalGrid()
// }

function isInBounds (position) {
  return (
    position.x < size && position.y < size &&
    position.x > 0 && position.y > 0
  )
}

function drawTriangle (size = 1, position = p5.createVector(0, 0)) {
  return p5.triangle(
    position.x, position.y,
    position.x - size, position.y + (2 * size),
    position.x + size, position.y + (2 * size)
  )
}

let textHeight = 0

const textHeights = []

function logMessage (name, message) {
  if (textHeights[name]) {
    p5.text(message, 10, textHeights[name])
  } else {
    textHeights[name] = textHeight
    textHeight += 20
  }
}

function logVector (name, vector) {
  logMessage(name, `${name} x: ${vector.x.toFixed(2)} y: ${vector.y.toFixed(2)}`)
}

function logNumber (name, number) {
  logMessage(name, `${name}, ${number}`)
}

function limitNumberWithinRange (number, max, min = 0) {
  return Math.min(Math.max(number, min), max)
}

function addAcceleration (positive = true, delta = 0.001) {
  if (positive) {
      speed += acceleration
      acceleration += delta
  } else {
      speed += acceleration
      acceleration -= delta
  }

  speed = limitNumberWithinRange(speed, maxSpeed)
}

  function drawFrame (distance) {
    p5.background(220)
    p5.strokeWeight(10)
    p5.point(target)
    p5.point(center)
    p5.strokeWeight(1)

    logVector('position', position)
    logNumber('angle', p5.degrees(angle).toFixed(4))
    logNumber('distance', distance.toFixed(2))
    logNumber('speed', speed.toFixed(2))
    logNumber('acceleration', acceleration.toFixed(2))

    if (distance >= (startingDistance / 3) * 2) {
      logMessage('go', 'go')
      addAcceleration()

    } else if (distance <= startingDistance / 3) {
      logMessage('slow', 'slow')
      addAcceleration(false)

    } else {
      logMessage('coast', 'coast')
      acceleration = 0
    }

    p5.translate(position)
    p5.rotate(angle)

    drawTriangle(10)

    position.add(
      max.copy()
        .setHeading(angle - (Math.PI / 2))
        .limit(speed)
        .limit(distance)
    )
  }

p5.setup = () => {
  p5.createCanvas(size, size)
  p5.frameRate(60)

  console.log('position', position)
  console.log('target', target)

  angle = target.copy().sub(position).heading() + (Math.PI / 2)

  console.log('angle in radians', angle.toFixed(4))
  console.log('angle in degrees', p5.degrees(angle).toFixed(4))
}

p5.draw = () => {
  const distance = target.copy().sub(position).mag()
  drawFrame(distance)

  if (!isInBounds(position) || distance <= 1) {
    console.log('done')
    p5.noLoop()
  }
}
