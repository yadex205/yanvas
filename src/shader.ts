interface ShaderConstructorOptions {
  vertexShaderSourceCode: string;
  fragmentShaderSourceCode: string;
}

export class Shader {
  private gl: WebGLRenderingContext | WebGL2RenderingContext;
  private program: WebGLProgram;

  private static getShaderTypeString = (gl: WebGLRenderingContext | WebGL2RenderingContext, shaderType: GLenum) => {
    if (shaderType === gl.VERTEX_SHADER) {
      return 'vertex';
    } else if (shaderType === gl.FRAGMENT_SHADER) {
      return 'fragment';
    } else {
      return 'unknown';
    }
  };

  public constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, options: ShaderConstructorOptions) {
    this.gl = gl;

    const vertexShader = this.compileShader(options.vertexShaderSourceCode, gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(options.fragmentShaderSourceCode, gl.FRAGMENT_SHADER);

    const program = gl.createProgram();
    if (!program) {
      throw new Error('Cannot create shader program.');
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const errorDetailsString = gl.getProgramInfoLog(program);
      throw new Error(`Cannot link shaders to program.\n\n${errorDetailsString}`);
    }

    this.program = program;
  }

  public getAttributeLocation = (name: string) => {
    const { gl, program } = this;

    const location = gl.getAttribLocation(program, name);
    if (location < 0) {
      throw new Error(`Cannot find attribute "${name}".`);
    }

    return location;
  };

  public getUniformLocation = (name: string) => {
    const { gl, program } = this;

    const location = gl.getUniformLocation(program, name);
    if (!location) {
      throw new Error(`Cannot find uniform "${name}"`);
    }

    return location;
  };

  private compileShader = (shaderSourceCode: string, shaderType: GLenum) => {
    const gl = this.gl;

    const shaderTypeString = Shader.getShaderTypeString(gl, shaderType);
    const shader = gl.createShader(shaderType);

    if (!shader) {
      throw new Error(`Cannot create ${shaderTypeString} shader.`);
    }

    gl.shaderSource(shader, shaderSourceCode);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const errorDetailsString = gl.getShaderInfoLog(shader);
      throw new Error(`Cannot compile ${shaderTypeString} shader.\n\n${errorDetailsString}`);
    }

    return shader;
  };
}
