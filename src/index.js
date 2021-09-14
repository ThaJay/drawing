import P5 from 'p5'

let p5
const drawing = new P5(sketch => {p5 = sketch})
console.log('drawing', drawing)

const size = 800
// const heading = p5.createVector(size / 2, size / 2)
const coordinate = p5.createVector(size / 2, size / 2)
const heading = p5.createVector((Math.random() * 2) - 1, (Math.random() * 2) - 1)

function isInBounds (coordinate) {
  return (
    coordinate.x < size && coordinate.y < size &&
    coordinate.x > 0 && coordinate.y > 0
  )
}

p5.setup = () => {
  p5.createCanvas(size, size)
  p5.frameRate(60)
  p5.background(220)
  p5.strokeWeight(10)

  // heading.setHeading(Math.random())
  // heading.normalize()
  // heading.mult(2)
  // heading.sub(1, 1)

  console.log('heading', heading)
  console.log('coordinate', coordinate)
}

p5.draw = () => {
  p5.background(220)
  p5.point(coordinate)

  if (isInBounds(coordinate)) coordinate.add(heading)
  else {
    console.log('done')
    p5.noLoop()
  }
}
