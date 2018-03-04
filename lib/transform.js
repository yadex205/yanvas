const Matrix = require('./matrix')

class Transform extends Matrix {
  static translate(x, y, z) {
    let t = new Transform()
    t.setValue(0, 3, x)
    t.setValue(1, 3, y)
    t.setValue(2, 3, z)
    return t
  }

  static rotate(degX, degY, degZ) {
    return this.rotateZ(degZ).multiply(this.rotateY(degY)).multiply(this.rotateX(degX))
  }

  static rotateX(deg) {
    let rad = Math.PI * deg / 180
    return new Transform([1.0, 0.0, 0.0, 0.0,
                          0.0, Math.cos(rad), -1 * Math.sin(rad), 0.0,
                          0.0, Math.sin(rad), Math.cos(rad), 0.0,
                          0.0, 0.0, 0.0, 1.0])
  }

  static rotateY(deg) {
    let rad = Math.PI * deg / 180
    return new Transform([Math.cos(rad), 0.0, Math.sin(rad), 0.0,
                          0.0, 1.0, 0.0, 0.0,
                          -1 * Math.sin(rad), 0.0, Math.cos(rad), 0.0,
                          0.0, 0.0, 0.0, 1.0])
  }

  static rotateZ(deg) {
    let rad = Math.PI * deg / 180
    return new Transform([Math.cos(rad), -1 * Math.sin(rad), 0.0, 0.0,
                          Math.sin(rad), Math.cos(rad), 0.0, 0.0,
                          0.0, 0.0, 1.0, 0.0,
                          0.0, 0.0, 0.0, 1.0])
  }

  // @see http://marupeke296.com/DXG_No70_perspective.html
  static projection(width, height, near, far, angle) {
    let sy = Math.tan(Math.PI * angle / 360)
    let aspect = width / height

    return this.scale(1 / aspect, 1, 1)
      .scale(-1 / sy, 1 / sy, 2 / (far - near))
      .translate(0, 0, -1 * (near + far) / (far - near))
      .setValue(3, 2, 1)
      .setValue(3, 3, 0)
  }

  static scale(x, y, z) {
    let t = new Transform()
    t.setValue(0, 0, x)
    t.setValue(1, 1, y)
    t.setValue(2, 2, z)
    return t
  }

  constructor(values = Matrix.createIdentity(4)) {
    super(values)
  }

  translate(x, y, z) {
    return Transform.translate(x, y, z).multiply(this)
  }

  rotate(x, y, z) {
    return Transform.rotate(x, y, z).multiply(this)
  }

  rotateX(deg) {
    return Transform.rotateX(deg).multiply(this)
  }

  rotateY(deg) {
    return Transform.rorateY(deg).multiply(this)
  }

  rotateZ(deg) {
    return Transform.rotateZ(deg).multiply(this)
  }

  scale(x, y, z) {
    return Transform.scale(x, y, z).multiply(this)
  }
}

module.exports = Transform
