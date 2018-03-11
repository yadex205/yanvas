const Transformable = require('./')

const LIGHTING_MODE = { DIRECTIONAL: 0, POINT: 1 }

class Light extends Transformable {
  constructor() {
    super()
    this._mode = LIGHTING_MODE.DIRECTIONAL
  }

  set mode(newValue) {
    if (Object.keys(LIGHTING_MODE).indexOf(newValue.toUpperCase()) < 0) { return }

    this._mode = LIGHTING_MODE[newValue.toUpperCase()]
  }

  get mode() {
    return this._mode
  }
}

module.exports = Light
