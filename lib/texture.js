class Texture {
  constructor(gl) {
    this._gl = gl
    this._texture = gl.createTexture()
  }

  addTexture(image, unit = 0) {
    let gl = this._gl
    let tex = this._texture

    gl.bindTexture(gl.TEXTURE_2D, tex)
    // gl.activeTexture(gl['TEXTURE' + unit.toString()])
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  addTextureByURL(url, unit = 0, callback = () => {}) {
    let img = new Image()
    img.src = url
    // @see https://qiita.com/ta-ke-no-bu/items/b7cd4b4719249a9c365e
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      this.addTexture(img, unit)
    }
  }

  bind(callback = () => {}) {
    let gl = this._gl
    let tex = this._texture

    gl.bindTexture(gl.TEXTURE_2D, tex)
    callback()
    // gl.bindTexture(gl.TEXTURE_2D, null)
  }
}

module.exports = Texture