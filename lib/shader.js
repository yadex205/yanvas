const fs = require('fs')

const VERTEX_SHADER = fs.readFileSync(__dirname + '/_glsl/basic.vs')
const BASE_FRAGMENT_SHADER = fs.readFileSync(__dirname + '/_glsl/basic.fs')

class Shader {
  static createBaseShader(gl) {
    return new this(gl, { vertex: VERTEX_SHADER,
                          fragment: BASE_FRAGMENT_SHADER })
  }

  constructor(gl, codes) {
    this._gl = gl
    this._program = null
    this._shaders = {}

    this._attributes = {}
    this._uniforms = {}

    if (codes) { this.setProgram(codes) }
  }

  setProgram(codes = {}) {
    let gl = this._gl
    let shaders = Object.keys(codes).map((typeSrc) => {
      return this._shaders[typeSrc] = this._compileShader(typeSrc, codes[typeSrc])
    })
    let program = this._program = this._linkProgram(shaders)
    gl.useProgram(program)
  }

  use() {
    this._gl.useProgram(this._program)
  }

  getAttributeInfo(name) {
    return this._attributes[name]
  }

  getUniformInfo(name) {
    return this._uniforms[name]
  }

  _compileShader(typeSrc, code) {
    let gl     = this._gl
    let type   = { vertex: gl.VERTEX_SHADER, fragment: gl.FRAGMENT_SHADER }[typeSrc]
    let shader = gl.createShader(type)

    gl.shaderSource(shader, code)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(`Cannot compile ${typeSrc} shader:`, gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
    } else {
      return shader
    }
  }

  _linkProgram(shaders) {
    let gl = this._gl
    let program = gl.createProgram()

    shaders.forEach(shader => gl.attachShader(program, shader))

    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(`Cannot link shader program:`, gl.getProgramInfoLog(program))
      gl.deleteProgram(program)
    } else {
      return program
    }
  }

  _initVariables(program) {
    let gl = this._gl

    Object.keys(Shader.VERTEX_ATTRIBUTES).forEach((name) => {
      let type, size
      let location = gl.getAttribLocation(program, name)
      if (location < 0) { throw `Attribute "${name}" not found on the shader` }

      ({type, size} = Shader.VERTEX_ATTRIBUTES[name])
      this._attributes[name] = { location: location, type: type, size: size }
    })
    Object.keys(Shder.UNIFORMS).forEach((name) => {
      let type, size, matrix
      let location = gl.getUniformLocation(program, name)
      if (!location) { throw `Uniform "#{name}" not found on the shader` }

      ({type, size, matrix} = Shader.UNIFORMS[name])
      this._uniforms[name] = { location: location, type: type, size: size, matrix: matrix }
    })
  }
}

Shader.VERTEX_ATTRIBUTES = {
  'position'    : { type: 'float', size: 3 },
  'normal'      : { type: 'float', size: 3 },
  'textureCoord': { type: 'float', size: 2 }
}

Shader.UNIFORMS = {
  // World
  'ambientColor':        { type: 'float', size: 4, matrix: false },

  // Transform
  'modelTransform':      { type: 'float', size: 4, matrix: true },
  'cameraPosition':      { type: 'float', size: 3, matrix: false },
  'lookAtPosition':      { type: 'float', size: 3, matrix: false },
  'projectionTransform': { type: 'float', size: 4, matrix: true },

  // Material
  'constantColor':       { type: 'float', size: 4, matrix: false },

  // Texture
  'texture':             { type: 'int',   size: 1, matrix: false }, // sampler2D

  // Light
  'lightPosition':       { type: 'float', size: 3, matrix: false }
}

module.exports = Shader
