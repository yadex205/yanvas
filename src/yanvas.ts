interface YanvasStartOptions {
  frameRate?: number;
}

export class Yanvas {
  private gl: WebGLRenderingContext | WebGL2RenderingContext;
  private intervalHandle = 0;
  private requestAnimationFrameId = 0;

  public constructor(gl: WebGLRenderingContext | WebGL2RenderingContext) {
    this.gl = gl;
  }

  public start = (drawFunction: () => void, options?: YanvasStartOptions) => {
    const frameRate = options?.frameRate || 60;

    if (frameRate <= 0) {
      throw new Error(`Invalid frame rate "${frameRate}".`);
    }

    if (typeof this.intervalHandle === 'number') {
      return;
    }

    const { gl } = this;

    this.intervalHandle = window.setInterval(() => {
      window.cancelAnimationFrame(this.requestAnimationFrameId);
      this.requestAnimationFrameId = window.requestAnimationFrame(() => {
        drawFunction();
        gl.flush();
      });
    }, frameRate / 1000);
  };

  public stop = () => {
    window.clearInterval(this.intervalHandle);
  };
}
