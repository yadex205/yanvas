class Geometry {
  constructor(gl) {
    this._gl = gl

    this._vertices       = []
    this._surfaces       = []
    this._vertexNormals  = []
    this._surfaceNormals = []
    this._textureCoords  = []

    this._vertexCount = 0

    this._vbos = { vertex       : gl.createBuffer(),
                   surfaceNormal: gl.createBuffer(),
                   vertexNormal : gl.createBuffer(),
                   textureCoord : gl.createBuffer() }
  }

  get vbos() {
    return this._vbos
  }

  get vertexCount() {
    return this._vertexCount
  }

  initWithVertices(newValues) {
    if (newValues.length % 3 !== 0) { return }
    this._vertices = new Array(newValues.length / 3)

    for (let i = 0; i < newValues.length / 3; i++) {
      this._vertices[i] = newValues.slice(3 * i, 3 * (i + 1))
    }

    this._surfaces       = []
    this._vertexNormals  = []
    this._surfaceNormals = []
    this._textureCoords  = []
  }

  set surfaces(newValues) {
    if (newValues.length % 3 !== 0) { return }

    this._surfaces       = []
    this._surfaceNormals = []

    for (let i = 0; i < newValues.length / 3; i++) {
      this._addSurface(...newValues.slice(3 * i, 3 * (i + 1)))
    }

    this._vertexCount = newValues.length
    this._textureCoords = new Array(newValues.length * 2).fill(0)
    this._calcVertexNormals()
    this._updateVBOs()
  }

  _addSurface(...indices) {
    if (indices.length !== 3) { return }
    this._surfaces.push(indices)

    let vertices = indices.map(index => this._vertices[index])
    let vec1 = vertices[1].map((val, index) => val - vertices[0][index])
    let vec2 = vertices[2].map((val, index) => val - vertices[0][index])
    let normal = [vec1[1] * vec2[2] - vec1[2] * vec2[1],
                  vec1[2] * vec2[0] - vec1[0] * vec2[2],
                  vec1[0] * vec2[1] - vec1[1] * vec2[0]]
    this._surfaceNormals.push(normal)
  }

  _calcVertexNormals() {
    let normals = (new Array(this._vertices.length)).fill([0, 0, 0])

    for (let surfaceIndex = 0; surfaceIndex < this._surfaces.length; surfaceIndex++) {
      let surfaceNormal = this._surfaceNormals[surfaceIndex]

      for (let i = 0; i < 3; i++) {
        let vertexIndex = this._surfaces[surfaceIndex][i]
        normals[vertexIndex] = normals[vertexIndex].map((val, index) => val + surfaceNormal[index])
      }
    }

    this._vertexNormals = normals
  }

  _updateVBOs() {
    let gl = this._gl
    let length = this._surfaces.length * 3 * 3
    let glVertices       = new Array(length)
    let glSurfaceNormals = new Array(length)
    let glVertexNormals  = new Array(length)

    for (let surfaceIndex = 0; surfaceIndex < this._surfaces.length; surfaceIndex++) {
      let surface = this._surfaces[surfaceIndex]
      let surfaceNormal = this._surfaceNormals[surfaceIndex]

      for (let vertexIndex = 0; vertexIndex < 3; vertexIndex++) {
        let vertex = this._vertices[surface[vertexIndex]]
        let vertexNormal = this._vertexNormals[surface[vertexIndex]]

        for (let coordIndex = 0; coordIndex < 3; coordIndex++) { // XYZ
          let index = 9 * surfaceIndex + 3 * vertexIndex + coordIndex
          glVertices[index]       = vertex[coordIndex]
          glSurfaceNormals[index] = surfaceNormal[coordIndex]
          glVertexNormals[index]  = vertexNormal[coordIndex]
        }
      }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this._vbos.vertex)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(glVertices), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vbos.surfaceNormal)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(glSurfaceNormals), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vbos.vertexNormal)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(glVertexNormals), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vbos.textureCoord)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._textureCoords), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }
}

module.exports = Geometry
