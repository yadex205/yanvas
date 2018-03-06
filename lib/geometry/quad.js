const Geometry = require('../geometry')

const BASE_VERTICES = [-0.5, 0.5, 0.0,
                       -0.5, -0.5, 0.0,
                       0.5, -0.5, 0.0,
                       0.5, 0.5, 0.0]

const TEXTURE_COORDS = [0.0, 0.0,
                        0.0, 1.0,
                        1.0, 1.0,
                        1.0, 0.0]

class Quad extends Geometry {
  constructor(gl, size = 1.0) {
    super(gl)

    this.initWithVertices(BASE_VERTICES.map(val => val * size))
    this.surfaces = [0, 1, 2, 0, 2, 3]
    this.textureCoords = [0.0, 0.0,
                          0.0, 1.0,
                          1.0, 1.0,
                          0.0, 0.0,
                          1.0, 1.0,
                          1.0, 0.0]
  }
}

module.exports = Quad
