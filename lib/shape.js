class Shape {
  constructor(gl) {
    this._gl = gl
    this._vbos = { position: gl.createBuffer(), normal: gl.createBuffer() }
    this._ibo = null
    this._drawMode = gl.TRIANGLES
    this._usage = gl.STATIC_DRAW

    this._vertices = []
    this._indices = []
    this._normals = null
    this._verticesLength = 0
    this._indicesLength = 0
  }

  set vertices(positions) {
    let gl = this._gl
    let vbo = this._vbos.position

    this._vertices = positions
    this._verticesLength = positions.length / 3
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), this._usage)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    if (!this._normals || positions.length !== this._normals.length) {
      this.normals = (new Array(positions.length)).fill(0.0)
    }
  }

  set normals(vectors) {
    let gl = this._gl
    let vbo = this._vbos.normal

    this._normals = vectors
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vectors), this._usage)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }

  set indices(indexArray) {
    let gl = this._gl
    let ibo = this._ibo || gl.createBuffer()

    this._indices = indexArray
    this._indicesLength = indexArray.length
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(this._indices), this._usage)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    this._ibo = this._ibo || ibo
  }

  set drawMode(name) {
    this._drawMode = this._gl[name]
  }

  set usage(name) {
    this._usage = this._gl[name]
  }

  get vbos() {
    return this._vbos
  }

  draw() {
    let gl  = this._gl
    let ibo = this._ibo

    if (ibo) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
      gl.drawElements(this._drawMode, this._indicesLength, gl.UNSIGNED_SHORT, 0)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    } else {
      gl.drawArrays(this._drawMode, 0, this._verticesLength)
    }
  }
}

module.exports = Shape
