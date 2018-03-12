const TYPES = ['webgl2', 'webgl', 'experimental-webgl']
const DEFAULT_ATTRIBUTES = { antialias: true }

String.prototype.enumize = function() {
  return this.replace(/([a-z])([A-Z])/, '$1_$2').toUpperCase()
}

class Context {
  static fromCanvas(canvas, attributes = DEFAULT_ATTRIBUTES) {
    let gl = null

    TYPES.some((type) => {
      gl = canvas.getContext(type, attributes)
      return !!gl
    })

    if (!!gl) {
      return new this(gl)
    } else {
      throw 'Cannot obtain WebGL context'
    }
  }

  constructor(gl) {
    this._gl = gl
    this._defineOriginalMethods()
    this._defineOriginalEnums()
  }

  get canvas() {
    return this._gl.canvas
  }

  enable(...caps) {
    let gl = this._gl

    if (Array.isArray(caps[0])) { caps = caps[0] }
    caps.map(cap => cap.enumize()).forEach(cap => {
      !!gl[cap] ? gl.enable(gl[cap]) : console.warn(`Capability gl.${cap} not found`)
    })
  }

  _defineOriginalMethods() {
    let gl = this._gl

    Object.getOwnPropertyNames(Object.getPrototypeOf(gl)).forEach(name => {
      if (typeof gl[name] !== 'function' || name === 'constructor') { return }

      this[name] = this[name] || ((...args) => {
        return this._gl[name](...args)
      })
    })
  }

  _defineOriginalEnums() {
    let gl = this._gl

    Object.getOwnPropertyNames(gl.constructor).forEach(name => {
      if (['prototype', 'name', 'length'].includes(name)) { return }
      if (!gl[name] instanceof Number) { return }

      this[name] = this[name] || gl[name]
    })
  }
}

module.exports = Context
