import P5 from 'p5'

let p5
const drawing = new P5(sketch => {p5 = sketch})
console.log('drawing', drawing, '\np5', p5)

const size = 800
const maxSpeed = 4
let speed = 0
let acceleration = 0
const steerStrength = 2
let angle = 0
let triangle

const center = p5.createVector(size / 2, size / 2)
const position = center.copy()
const target = p5.createVector(Math.random() * size - 1, Math.random() * size - 1)
// const velocity = p5.createVector(0, 0)
// const desiredVelocity = p5.createVector(0, 0)
// const desiredDirection = p5.createVector(0, 0)
// const desiredSteeringForce = center.copy()

function isInBounds (position) {
  return (
    position.x < size && position.y < size &&
    position.x > 0 && position.y > 0
  )
}

function drawTriangle (position, size = 1) {
  return p5.triangle(
    position.x, position.y,
    position.x - size, position.y + (2 * size),
    position.x + size, position.y + (2 * size)
  )
}

function drawHorizontals () {
  let x = 0

  while (x < size) {
    p5.line(0, x, size, x)
    x += 100
  }
}

function drawVerticals () {
  let y = 0

  while (y < size) {
    p5.line(y, 0, y, size)
    y += 100
  }
}

function drawGrid () {
  drawHorizontals()
  drawVerticals()
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
  const difference = target.copy().sub(position)

  if (speed <= maxSpeed) {
    speed += acceleration
    acceleration += 0.001
  }

  const distance = position.copy().dist(target)

  const translation = difference.normalize().mult(speed).limit(distance)

  p5.background(220)
  p5.strokeWeight(10)
  p5.point(target)
  p5.point(center)
  p5.strokeWeight(1)

  if (isInBounds(position) && position !== target) {
    p5.translate(position)
    p5.rotate(angle)
    drawGrid()

    drawTriangle(p5.createVector(0, 0), 10)
    position.add(translation)
    // p5.translate(0, 0)

  } else {
    console.log('done')
    p5.noLoop()
  }
}
