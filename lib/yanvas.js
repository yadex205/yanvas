require('./polyfill')

const Context       = require('./context')
const Shader        = require('./shader')
const Renderer      = require('./renderer')
const Transform     = require('./transform')

const Renderable    = require('./transformable/renderable')
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
    this.setUniform('shadingMode', [1.0])
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

  createQuad(size = 1.0) {
    let gl = this._gl
    let geometry = new Quad(gl, size)

    return new Renderable(gl, { geometry: geometry })
  }

  createBox(size = 1.0) {
    let gl = this._gl
    let geometry = new Box(gl, size)

    return new Renderable(gl, { geometry: geometry })
  }

  createTorus(segMajor = 32, segMinor = 32, radMajor = 2.0, radMinor = 0.4) {
    let gl = this._gl
    let geometry = new Torus(gl, segMajor, segMinor, radMajor, radMinor)

    return new Renderable(gl, { geometry: geometry })
  }

  createSphere(size = 1.0, segV = 16, segH = 32) {
    let gl = this._gl
    let geometry = new Sphere(gl, size, segV, segH)

    return new Renderable(gl, { geometry: geometry })
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
}

window.Yanvas = Yanvas
