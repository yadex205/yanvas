const Geometry = require('./')

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

class Box extends Geometry {
  constructor(gl, size = 1.0) {
    super(gl)
    this.initWithVertices(generateBaseVertices(size))
    this.surfaces = [1, 4, 0,
                     4, 1, 5,
                     7, 5, 1,
                     5, 7, 4,
                     6, 4, 7,
                     4, 6, 0,
                     2, 0, 6,
                     0, 2, 1,
                     3, 1, 2,
                     1, 3, 7,
                     2, 7, 3,
                     7, 2, 6]
  }
}

module.exports = Box
