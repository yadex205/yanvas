class Texture {
  constructor(gl) {
    this._gl = gl
    this._width       = 512
    this._height      = 512
    this._texture     = gl.createTexture()

    this._init()
  }

  resize(width, height) {
    this._width = width
    this._height = height
    this._init()
  }

  setImageElement(image) {
    if (!(image instanceof HTMLImageElement)) {
      throw new TypeError('Argument should be a HTMLImageElement')
    }

    let gl = this._gl
    let tex = this._texture

    this.size = [image.width, image.height]

    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  addTextureByURL(url, callback = () => {}) {
    let img = new Image()
    img.onload = () => { this.setImageElement(img) }
    img.src = url
  }

  bind(callback = () => {}) {
    let gl      = this._gl
    let texture = this._texture

    gl.bindTexture(gl.TEXTURE_2D, texture)
    callback(texture)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  _init() {
    let gl  = this._gl
    let tex = this._texture

    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this._width, this._height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }
}

module.exports = Texture
