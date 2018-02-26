const Shape = require('../shape')

function generateBaseVertices(size) {
  return [1, 1, 1,
          1, 1, -1,
          1, -1, 1,
          1, -1, -1,
          -1, 1, 1,
          -1, 1, -1,
          -1, -1, 1,
          -1, -1, -1].map(val => size * val / 2)
}

class Box extends Shape {
  constructor(gl, size = 1.0) {
    super(gl)

    this.drawMode = 'TRIANGLE_STRIP'
    this.vertices = generateBaseVertices(size)

    // @see https://stackoverflow.com/a/38855946
    // @see http://www.cs.umd.edu/gvil/papers/av_ts.pdf
    this.indices  = [0, 4, 1, 5, 7, 4, 6, 0, 2, 1, 3, 7, 2, 6]
  }
}

module.exports = Box
