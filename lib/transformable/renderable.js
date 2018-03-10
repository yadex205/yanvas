const Transformable = require('./')
const Geometry      = require('../geometry')
const Material      = require('../material')
const Texture       = require('../texture')

class Renderable extends Transformable {
  constructor(gl, params = {}) {
    super()

    this._gl       = gl
    this._geometry = params.geometry || new Geometry(gl)
    this._material = params.material || new Material()
    this._texture  = params.texture || new Texture(gl)
  }

  get geometry() {
    return this._geometry
  }

  get material() {
    return this._material
  }

  get texture() {
    return this._texture
  }

  set texture(newValue) {
    this._texture = newValue
  }
}

module.exports = Renderable
