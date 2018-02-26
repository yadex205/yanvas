const Shape = require('../shape')

function generateBaseVertices(segMajor, segMinor, radMajor, radMinor) {
  let vertices = []
  let normals = []

  for (let i = 0; i <= segMinor; i++) {
    let localX = radMinor * Math.cos(2 * Math.PI * i / segMinor)
    let localY = radMinor * Math.sin(2 * Math.PI * i / segMinor)

    for (let j = 0; j <= segMajor; j++) {
      vertices.push((radMajor + localX) * Math.cos(2 * Math.PI * j / segMajor),
                    localY,
                    (radMajor + localX) * Math.sin(2 * Math.PI * j / segMajor))
      normals.push(localX * Math.cos(2 * Math.PI * j / segMajor),
                   localY,
                   localX * Math.sin(2 * Math.PI * j / segMajor))
    }
  }

  return [vertices, normals]
}

function generateIndices(segMajor, segMinor) {
  let indices = []

  for (let i = 0; i < segMinor; i++) {
    for (let j = 0; j < segMajor; j++) {
      let r = segMajor + 1
      indices.push(r * i + j, r * i + j + 1, r * (i + 1) + j + 1)
      indices.push(r * i + j, r * (i + 1) + j + 1, r * (i + 1) + j)
    }
  }
  return indices
}

class Torus extends Shape {
  constructor(gl, segMajor, segMinor, radMajor, radMinor) {
    super(gl)

    let result = generateBaseVertices(segMajor, segMinor, radMajor, radMinor)

    this.drawMode = 'TRIANGLES'
    this.vertices = result[0]
    this.normals = result[1]
    this.indices = generateIndices(segMajor, segMinor)
  }
}

module.exports = Torus
