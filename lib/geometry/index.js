class Geometry {
  constructor(gl) {
    this._gl = gl
    this._vertices = []
    this._surfaces = []
    this._textureCoord = []

    this._glVertices = []
    this._glNormals = []
    this._glTextureCoords = []

    this._vbos = { position:     gl.createBuffer(), // TODO: rename to vertex
                   normal:       gl.createBuffer(),
                   textureCoord: gl.createBuffer() }
  }

  set surfaces(newValue) {
    let gl = this._gl
    let vbos = this._vbos

    if (newValue.length % 3 !== 0) { return }
    this._surfaces = newValue

    for (let i = 0; i < newValue.length; i += 3) {
      this.addSurface(...newValue.slice(i, i + 3))
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vbos.position)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._glVertices), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, vbos.normal)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._glNormals), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, vbos.textureCoord)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._glTextureCoords), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }

  set textureCoords(newValue) {
    let gl = this._gl
    let vbo = this._vbos.textureCoord

    this._textureCoord = newValue
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newValue), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }

  get vbos() {
    return this._vbos
  }

  get vertexCount() {
    return this._glVertices.length / 3
  }

  initWithVertices(newValue) {
    if (newValue.length % 3 !== 0) { return }

    this._vertices = newValue
    this._surfaces = []
    this._textureCoord = []

    this._glVertices = []
    this._glNormals = []
  }

  addSurface(...indices) {
    let vertices = indices.map(index => {
      let vertex = this._vertices.slice(3 * index, 3 * (index + 1))
      this._glVertices.push(...vertex)
      this._glTextureCoords.push(...[0, 0])
      return vertex
    })

    let vec1 = vertices[1].map((val, index) => val - vertices[0][index])
    let vec2 = vertices[2].map((val, index) => val - vertices[0][index])
    let normal = [vec1[1] * vec2[2] - vec1[2] * vec2[1],
                  vec1[2] * vec2[0] - vec1[0] * vec2[2],
                  vec1[0] * vec2[1] - vec1[1] * vec2[0]]

    this._glNormals.push(...normal.concat(normal).concat(normal))
  }

  draw() {
    let gl = this._gl

    gl.drawArrays(gl.TRIANGLES, 0, this._glVertices.length / 3)
  }
}

module.exports = Geometry
