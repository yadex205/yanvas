const Geometry = require('../geometry')

function generateBaseVertices(rad, segV, segH) {
  if (segV < 3 || segH < 3) { return }

  let vertices = []
  let surfaces = []

  for (let iv = 0; iv <= segV; iv++) {
    let w = rad * Math.sin(Math.PI * iv / segV)
    let h = rad * Math.cos(Math.PI * iv / segV)

    for (let ih = 0; ih <= segH; ih++) {
      vertices.push(w * Math.cos(2 * Math.PI * ih / segH))
      vertices.push(w * Math.sin(2 * Math.PI * ih / segH))
      vertices.push(h)
    }
  }

  for (let iv = 0; iv < segV; iv++) {
    let r = segH + 1
    for (let ih = 0; ih < segH; ih++) {
      surfaces.push(...[iv * r + ih, (iv + 1) * r + ih, (iv + 1) * r + ih + 1])
      surfaces.push(...[iv * r + ih, (iv + 1) * r + ih + 1, iv * r + ih + 1])
    }
  }

  return [vertices, surfaces]
}

class Sphere extends Geometry {
  constructor(gl, size = 1.0, segV = 16, segH = 32) {
    super(gl)

    let result = generateBaseVertices(size, segV, segH)
    this.initWithVertices(result[0])
    this.surfaces = result[1]
  }
}

module.exports = Sphere
