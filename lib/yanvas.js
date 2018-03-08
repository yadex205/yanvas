const Context       = require('./context')
const Transform     = require('./transform')

const Shader        = require('./shader')
const Texture       = require('./texture')
const Renderer      = require('./renderer')

const Quad          = require('./geometry/quad')
const Box           = require('./geometry/box')
const Torus         = require('./geometry/torus')
const Sphere        = require('./geometry/sphere')

class Yanvas extends Renderer {
  constructor(letThereBeLight) {
    super()

    this._gl = null
    this._fps  = 60
    this._renderInterval = 1000 / 60
    this._intervalID = null
    this._beginTime = Date.now()
    this._millis = 0

    this.setup = () => {}
    this.draw = () => {}

    letThereBeLight(this)
    this.setup()
    this.run()
  }

  set framerate(fps) {
    this._fps = fps
    this._renderInterval = 1000 / fps
    if (this._intervalID) {
      this.pause()
      this.run()
    }
  }

  get framerate() {
    return this._fps
  }

  setupCanvas(canvasId, width, height) {
    let canvas = document.getElementById(canvasId)
    canvas.width = width
    canvas.height = height
    let gl = Context.fromCanvas(canvas)

    gl.enable('blend', 'cull_face', 'depth_test')

    this._gl = gl
    this.gl = gl

    this.addShader('basic', Shader.createBaseShader(gl))
    this.useShader('basic')
    this.projection(width, height, 0.5, 100.0, 45.0)
    this.sunDirection(0.0, 8.0, -5.0)
    this.ambientColor(0.1, 0.1, 0.1, 1.0)
  }

  run() {
    this._intervalID = window.setInterval(() => {
      this._millis = Date.now() - this._beginTime
      this.draw()
      this._gl.flush()
    }, this._renderInterval)
  }

  pause() {
    window.clearInterval(this._renderInterval)
    this._renderInterval = null
  }

  createTexture() {
    return new Texture(this._gl)
  }

  createQuad(size = 1.0) {
    return new Quad(this._gl, size)
  }

  createBox(size = 1.0) {
    return new Box(this._gl, size)
  }

  createTorus(segMajor = 32, segMinor = 32, radMajor = 2.0, radMinor = 0.4) {
    return new Torus(this._gl, segMajor, segMinor, radMajor, radMinor)
  }

  createSphere(size = 1.0, segV = 16, segH = 32) {
    return new Sphere(this._gl, size, segV, segH)
  }

  millis() {
    return this._millis
  }

  random(min, max) {
    return Math.random() * (max - min) + min
  }

  clear(r, g, b, a) {
    let gl = this._gl
    gl.clearColor(r, g, b, a)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  }

  fill(r, g, b, a) {
    this.setUniform('color', [r, g, b, a])
  }

  camPos(x, y, z) {
    this.setUniform('camPos', [x, y, z])
  }

  lookAtPos(x, y, z) {
    this.setUniform('lookAtPos', [x, y, z])
  }

  createTransform() {
    return new Transform()
  }

  transform(t) {
    this.setUniform('modelTransform', t.glValues)
    this.setUniform('modelTransformInverse', t.inverse().glValues)
  }

  projection(width, height, start, end, angle) {
    let t = Transform.projection(width, height, start, end, angle)
    this.setUniform('projectionTransform', t.glValues)
  }

  sunDirection(x, y, z) {
    this.setUniform('sunDirection', [x, y, z])
  }

  ambientColor(r, g, b, a) {
    this.setUniform('ambientColor', [r, g, b, a])
  }

  setTexture(texture, unit = 0) {
    texture.bind(() => {
      this.setUniform('texture', unit)
    })
  }

  drawShape(shape) {
    let gl = this._gl
    let shader = this._currentShader

    Object.keys(shape.vbos).forEach((name) => {
      let vbo = shape.vbos[name]
      this.setAttributePointer(name, vbo)
    })

    shape.draw()
  }
}

window.Yanvas = Yanvas
