const Transform = require('../transform')

class Transformable {
  constructor() {
    this._position = [0.0, 0.0, 0.0]
    this._rotation = [0.0, 0.0, 0.0]
    this._scaling  = [1.0, 1.0, 1.0]

    this._transform = new Transform()
  }

  set position(newValue) {
    this._position = newValue
    this._calcTransform()
  }

  set rotation(newValue) {
    this._rotation = newValue
    this._calcTransform()
  }

  set scaling(newValue) {
    this._scaling = newValue
    this._calcTransform()
  }

  get transform() {
    return this._transform
  }

  _calcTransform() {
    this._transform = Transform.scale(...this._scaling)
                               .rotate(...this._rotation)
                               .translate(...this._position)
  }
}

module.exports = Transformable
