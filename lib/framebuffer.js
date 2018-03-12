const Texture = require('./texture')

class Framebuffer {
  constructor(gl, params = {}) {
    if (params.colorbuffer && params.colorbuffer instanceof Texture) {
      throw 'params.colorbuffer should be a Texture instance'
    }

    this._gl = gl
    this._width       = params.width || 512
    this._height      = params.height || 512
    this._framebuffer = gl.createFramebuffer()
    this._colorbuffer = params.colorbuffer || new Texture(gl)
    this._depthbuffer = params.depthbuffer || gl.createRenderbuffer()

    this._init()
  }

  get pointer() {
    return this._framebuffer
  }

  get width() {
    return this._width
  }

  get height() {
    return this._height
  }

  get colorbuffer() {
    return this._colorbuffer
  }

  _init() {
    let gl          = this._gl
    let framebuffer = this._framebuffer
    let colorbuffer = this._colorbuffer
    let depthbuffer = this._depthbuffer

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthbuffer)

    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this._width, this._height)
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthbuffer)

    colorbuffer.bind((texPointer) => {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this._width, this._height,
                    0, gl.RGBA, gl.UNSIGNED_BYTE, null)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texPointer, 0)
    })

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.bindRenderbuffer(gl.RENDERBUFFER, null)
  }
}

module.exports = Framebuffer
