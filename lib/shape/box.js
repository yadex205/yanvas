const Shape = require('../shape')

// @see https://stackoverflow.com/a/38855946
// @see http://www.cs.umd.edu/gvil/papers/av_ts.pdf
class Box extends Shape {
  constructor(gl, size = 1.0) {
    super(gl)

    this.drawMode = 'TRIANGLE_STRIP'
    this.vertices = Box.VERT_POSITIONS.map(val => val * size)
  }
}

Box.VERT_POSITIONS = [0.5, 0.5, 0.5,
                      -0.5, 0.5, 0.5,
                      0.5, 0.5, -0.5,
                      -0.5, 0.5, -0.5,
                      -0.5, -0.5, -0.5,
                      -0.5, 0.5, 0.5,
                      -0.5, -0.5, 0.5,
                      0.5, 0.5, 0.5,
                      0.5, -0.5, 0.5,
                      0.5, 0.5, -0.5,
                      0.5, -0.5, -0.5,
                      -0.5, -0.5, -0.5,
                      0.5, -0.5, 0.5,
                      -0.5, -0.5, 0.5]

module.exports = Box
