const Shape = require('../shape')

const BASE_VERTICES = [-0.5, 0.5, 0.0,
                       -0.5, -0.5, 0.0,
                       0.5, -0.5, 0.0,
                       0.5, 0.5, 0.0]

class Quad extends Shape {
  constructor(gl, size = 1.0) {
    super(gl)

    this.drawMode = 'TRIANGLE_FAN'
    this.vertices = BASE_VERTICES.map(val => val * size)
  }
}

module.exports = Quad
