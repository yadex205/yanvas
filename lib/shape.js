class Shape {
  constructor(gl) {
    this._gl = gl
    this._vbo = gl.createBuffer()
    this._drawMode = gl.TRIANGLES
    this._usage = gl.STATIC_DRAW

    this._vertices = []
    this._indices = 0
  }

  set vertices(positions) {
    this._vertices = positions
    this._indices = positions.length / 3
    this._updateBuffers()
  }

  set origin(position) {
    this._origin = position
  }

  set drawMode(name) {
    this._drawMode = this._gl[name]
  }

  set usage(name) {
    this._usage = this._gl[name]
  }

  draw() {
    let gl  = this._gl
    let vbo = this._vbo

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.drawArrays(this._drawMode, 0, this._indices)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }

  _updateBuffers() {
    let gl  = this._gl
    let vbo = this._vbo

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices), this._usage)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }
}

module.exports = Shape
