const BASE_MATRIX = new Float32Array([1.0, 0.0, 0.0, 0.0,
                                      0.0, 1.0, 0.0, 0.0,
                                      0.0, 0.0, 1.0, 0.0,
                                      0.0, 0.0, 0.0, 1.0])

class Transform {
  constructor() {
    this._translate = []
    this._rotate    = new Array(3)
    this._scale     = []

    for (var i = 0; i < 3; i++) {
      this._rotate[i] = []
      Object.assign(this._rotate[i], BASE_MATRIX)
    }
    Object.assign(this._translate, BASE_MATRIX)
    Object.assign(this._scale, BASE_MATRIX)
  }

  set translate(position) {
    for (let i = 0; i < 3; i++) {
      this._translate[i * 4 + 3] = position[i]
    }
  }

  set rotate(degrees) {
    this._rotateX(Math.PI * degrees[0] / 180)
    this._rotateY(Math.PI * degrees[1] / 180)
    this._rotateZ(Math.PI * degrees[2] / 180)
  }

  set scale(values) {
    this._scale = new Float32Array([values[0], 0.0, 0.0, 0.0,
                                    0.0, values[1], 0.0, 0.0,
                                    0.0, 0.0, values[2], 0.0,
                                    0.0, 0.0, 0.0, 1.0])
  }

  get translateVector() {
    return this._translate
  }

  get rotateXVector() {
    return this._rotate[0]
  }

  get rotateYVector() {
    return this._rotate[1]
  }

  get rotateZVector() {
    return this._rotate[2]
  }

  get scaleVector() {
    return this._scale
  }

  _rotateX(radian) {
    this._rotate[0] = new Float32Array([1.0, 0.0, 0.0, 0.0,
                                        0.0, Math.cos(radian), -1.0 * Math.sin(radian), 0.0,
                                        0.0, Math.sin(radian), Math.cos(radian), 0.0,
                                        0.0, 0.0, 0.0, 1.0])
  }

  _rotateY(radian) {
    this._rotate[1] = new Float32Array([Math.cos(radian), 0.0, Math.sin(radian), 0.0,
                                        0.0, 1.0, 0.0, 0.0,
                                        -1 * Math.sin(radian), 0.0, Math.cos(radian), 0.0,
                                        0.0, 0.0, 0.0, 1.0])
  }

  _rotateZ(radian) {
    this._rotate[2] = new Float32Array([Math.cos(radian), -1.0 * Math.sin(radian), 0.0, 0.0,
                                        Math.sin(radian), Math.cos(radian), 0.0, 0.0,
                                        0.0, 0.0, 1.0, 0.0,
                                        0.0, 0.0, 0.0, 1.0])
  }
}

// @see http://marupeke296.com/DXG_No70_perspective.html
Transform.projection = function(width, height, start, end, angle) {
  let sy = Math.tan(Math.PI * angle / 360)
  let aspect = width / height
  return new Float32Array([1 / (sy * aspect), 0.0, 0.0, 0.0,
                           0.0, 1 / sy, 0.0, 0.0,
                           0.0, 0.0, 2.0 / (end - start), -1 * (start + end) / (end - start),
                           0.0, 0.0, 1.0, 0.0])
}

module.exports = Transform
