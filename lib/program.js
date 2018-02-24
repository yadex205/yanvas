const fs = require('fs')

const VERTEX_SHADER = fs.readFileSync(__dirname + '/_glsl/basic.vs')
const BASIC_FRAGMENT_SHADER = fs.readFileSync(__dirname + '/_glsl/basic.fs')

class Program {
  constructor(gl, fshaderCode = BASIC_FRAGMENT_SHADER) {
    this._gl = gl
    this._program = gl.createProgram()
    this._attributes = {}

    this._linkProgram(fshaderCode)
    this._initAttributes()
  }

  use() {
    let gl = this._gl
    let program = this._program
    gl.useProgram(program)
  }

  setAttributePointer(name, buffer) {
    this.use()
    let gl = this._gl
    let attribute = this._attributes[name]

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.vertexAttribPointer(attribute.location, attribute.size, attribute.type, false, 0, 0)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }

  setUniform(name, type, data) {
    this.use()
    let gl = this._gl
    let program = this._program
    let location = gl.getUniformLocation(program, name)

    if (type.startsWith('Matrix')) {
      gl['uniform' + type + 'v'](location, false, data)
    } else {
      gl['uniform' + type + 'v'](location, data)
    }
  }

  _linkProgram() {
    let gl = this._gl
    let program = gl.createProgram()

    gl.attachShader(program, this._compileShader('vertex', VERTEX_SHADER))
    gl.attachShader(program, this._compileShader('fragment', this._fshaderCode))

    gl.linkProgram(program)
    if (gl.getProgramParameter(gl.LINK_STATUS)) {
      this._program = program
    } else {
      gl.deleteProgram(program)
    }
  }

  _compileShader(type, code) {
    let gl = this._gl
    let shader = gl.createShader({ vertex: gl.VERTEX_SHADER, fragment: gl.FRAGMENT_SHADER }[type])

    gl.shaderSource(shader, code)
    gl.compileShader(shader)

    if (gl.getShaderParameter(gl.COMPILE_STATUS)) {
      return shader
    } else {
      gl.deleteShader(shader)
    }
  }

  _initAttributes() {
    let gl = this._gl
    let program = this._program
    let location = gl.getAttribLocation(program, 'pos')

    this.use()
    gl.enableVertexAttribArray(location)
    this.attributes['pos'] = { location: location, size: 3, type: gl.FLOAT }
  }

  _initUniforms() {
    let matrix = [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0]
    this.setUniform('projectionMatrix', 'Matrix4f', matrix)
    this.setUniform('translate', 'Matrix4f', matrix)
    this.setUniform('rotateX', 'Matrix4f', matrix)
    this.setUniform('rotateY', 'Matrix4f', matrix)
    this.setUniform('rotateZ', 'Matrix4f', matrix)
    this.setUniform('scale', 'Matrix4f', matrix)
    this.setUniform('camPos', '3f', [0.0, 0.0, -5.0])
    this.setUniform('lookAtPos', '3f', [0.0, 0.0, 0.0])
    this.setUniform('color', '4f', [0.0, 0.0, 0.0, 0.0])
  }
}


module.exports = Program
