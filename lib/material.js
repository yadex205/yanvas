const SHADING_MODES = { CONSTANT: 0, FLAT: 1, GOURAUD: 2 }

class Material {
  constructor() {
    this._shadingMode = SHADING_MODES.FLAT
    this.diffuseColor = [1.0, 1.0, 1.0, 1.0]
    this.diffuseIntensity = 0.8
    this.specularColor = [0.5, 0.5, 0.5, 1.0]
    this.specularIntensity = 0.8
  }

  get shadingMode() {
    return this._shadingMode
  }

  set shadingMode(newValue) {
    if (Object.keys(SHADING_MODES).indexOf(newValue.toUpperCase()) < 0) { return }

    this._shadingMode = SHADING_MODES[newValue.toUpperCase()]
  }
}

module.exports = Material
