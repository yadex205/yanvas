const Shape = require('../shape')

const BASE_VERTICES = [-0.5, 0.5, 0.0,
                       -0.5, -0.5, 0.0,
                       0.5, -0.5, 0.0,
                       0.5, 0.5, 0.0]

const TEXTURE_COORDS = [0.0, 0.0,
                        0.0, 1.0,
                        1.0, 1.0,
                        1.0, 0.0]

class Quad extends Shape {
  constructor(gl, size = 1.0) {
    super(gl)

    this.drawMode = 'TRIANGLE_FAN'
    this.vertices = BASE_VERTICES.map(val => val * size)
    this.textureCoords = [].concat(TEXTURE_COORDS)
  }
}

module.exports = Quad
