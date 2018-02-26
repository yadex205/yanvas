const Transform     = require('./transform')
const TextureCanvas = require('./texture_canvas')
const Program       = require('./program')
const Quad          = require('./shape/quad')
const Box           = require('./shape/box')
const Torus         = require('./shape/torus')

const CONTEXT_TYPES = ['webgl2', 'webgl', 'experimental-webgl']

class Yanvas {
  constructor(letThereBeLight) {
    this._canvas
    this._gl = null
    this._fps  = 60
    this._renderInterval = 1000 / 60
    this._intervalID = null
    this._programs = {}
    this._currentProgram = null
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
    let gl = null
    let canvas = document.getElementById(canvasId)
    canvas.width = width
    canvas.height = height

    CONTEXT_TYPES.some((type) => {
      gl = canvas.getContext(type)
      return !!gl
    })

    gl.enable(gl.BLEND)
    gl.enable(gl.CULL_FACE)
    gl.enable(gl.DEPTH_TEST)

    this._gl = gl
    this._canvas = canvas

    this.addProgram('basic')
    this.useProgram('basic')
    this.projection(width, height, 0.5, 100.0, 45.0)
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

  addProgram(name, fshaderCode) {
    this._programs[name] = new Program(this._gl, fshaderCode)
  }

  useProgram(name) {
    let program = this._programs[name]
    program.use()
    this._currentProgram = program
  }

  createTexureCanvas() {
    return new TextureCanvas(this._gl)
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

  millis() {
    return this._millis
  }

  random(min, max) {
    return Math.random() * (max - min) + min
  }

  clear(r, g, b, a) {
    let gl = this._gl
    gl.clearColor(r, g, b, a)
    gl.clear(gl.COLOR_BUFFER_BIT)
  }

  fill(r, g, b, a) {
    this._currentProgram.setUniform('color', '4f', [r, g, b, a])
  }

  camPos(x, y, z) {
    this._currentProgram.setUniform('camPos', '3f', [x, y, z])
  }

  lookAtPos(x, y, z) {
    this._currentProgram.setUniform('lookAtPos', '3f', [x, y, z])
  }

  createTransform() {
    return new Transform()
  }

  transform(t) {
    let program = this._currentProgram
    program.setUniform('translate', 'Matrix4f', t.translateVector)
    program.setUniform('rotateX', 'Matrix4f', t.rotateXVector)
    program.setUniform('rotateY', 'Matrix4f', t.rotateYVector)
    program.setUniform('rotateZ', 'Matrix4f', t.rotateZVector)
    program.setUniform('scale', 'Matrix4f', t.scaleVector)
  }

  projection(width, height, start, end, angle) {
    this._currentProgram.setUniform('projectionMatrix', 'Matrix4f',
                                    Transform.projection(width, height, start, end, angle))
  }

  drawShape(shape) {
    Object.keys(shape.vbos).forEach((name) => {
      let vbo = shape.vbos[name]
      this._currentProgram.setAttributePointer(name, vbo)
    })

    shape.draw()
  }
}

window.Yanvas = Yanvas