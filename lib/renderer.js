const Framebuffer = require('./framebuffer')

class Renderer {
  constructor() {
    this._gl = null
    this._shaders = {}
    this._currentShader = null
  }

  // TODO: move to constructor
  set gl(context) {
    this._gl = context
  }

  get attributes() {
    return !!this._currentShader ? this._currentShader.attributes : {}
  }

  get uniforms() {
    return !!this._currentShader ? this._currentShader.uniforms : {}
  }

  addShader(name, shader) {
    if (this._shaders[name]) { throw `Shader "${name}" already exists` }

    this._shaders[name] = shader
  }

  useShader(name) {
    if (!this._shaders[name]) { throw `Shader "${name}" not found` }

    let shader = this._shaders[name]
    if (this._currentShader === shader) { return }

    this._currentShader = shader
    shader.use()

    Object.keys(this._currentShader.attributes).forEach(name => {
      this._gl.enableVertexAttribArray(this.attributes[name].location)
    })
  }

  createFramebuffer(width, height) {
    return new Framebuffer(this._gl, { width: width, height: height })
  }

  useFramebuffer(framebuffer) {
    let gl = this._gl

    if (framebuffer === null) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.pointer)
      gl.viewport(0, 0, framebuffer.width, framebuffer.height)
    }
  }

  render(renderable) {
    let gl = this._gl

    Object.entries(renderable.geometry.vbos).forEach(set => this.setAttributePointer(...set))

    this.setUniform('modelTransform', renderable.transform.glValues)
    this.setUniform('modelTransformInverse', renderable.transform.inverse().glValues)
    this.setUniform('shadingMode', [renderable.material.shadingMode])

    renderable.texture.bind(() => {
      gl.activeTexture(gl.TEXTURE0)
      this.setUniform('texture', [0])
      gl.drawArrays(gl.TRIANGLES, 0, renderable.geometry.vertexCount)
    })
  }

  setAttributePointer(name, vbo) {
    let gl = this._gl
    let attributeInfo = this.attributes[name]
    if (!attributeInfo) { throw `Attribute "${name}" not found` }

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.vertexAttribPointer(attributeInfo.location, attributeInfo.size, attributeInfo.type,
                           false, 0, 0)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }

  setUniform(name, value) {
    let gl = this._gl
    let uniformInfo = this.uniforms[name]
    if (!uniformInfo) { throw `Uniform "${name}" not found` }

    let type = uniformInfo.type
    let func = gl['uniform' + type + 'v']
    if (typeof func !== 'function') { throw `${type} uniform not supported` }

    uniformInfo.matrix ? func(uniformInfo.location, false, value) : func(uniformInfo.location, value)
  }
}

module.exports = Renderer
