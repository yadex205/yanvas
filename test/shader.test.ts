import headlessGl from 'gl';
import { Shader } from 'yanvas/shader';

describe('Shader', () => {
  describe('constructor()', () => {
    describe('given valid source codes', () => {
      const gl = headlessGl(640, 480);
      const vertexShaderSourceCode = `
        attribute vec4 position;
        void main(void) {
          gl_Position = position;
        }
      `;
      const fragmentShaderSourceCode = `
        void main(void) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        }
      `;

      it('should initialize a Shader instance', () => {
        expect(() => {
          new Shader(gl, { vertexShaderSourceCode, fragmentShaderSourceCode });
        }).not.toThrow();
      });
    });

    describe('given invalid source codes', () => {
      const gl = headlessGl(640, 480);
      const vertexShaderSourceCode = '';
      const fragmentShaderSourceCode = '';

      it('should throw an error', () => {
        expect(() => {
          new Shader(gl, { vertexShaderSourceCode, fragmentShaderSourceCode });
        }).toThrow();
      });
    });

    describe('given valid source codes with wrong "varying" usage', () => {
      const gl = headlessGl(640, 480);
      const vertexShaderSourceCode = `
        attribute vec4 position;
        void main(void) {
          gl_Position = position;
        }
      `;
      const fragmentShaderSourceCode = `
        varying highp vec4 vColor;
        void main(void) {
          gl_FragColor = vColor;
        }
      `;

      it('should throw an error', () => {
        expect(() => {
          new Shader(gl, { vertexShaderSourceCode, fragmentShaderSourceCode });
        }).toThrow();
      });
    });
  });

  describe('getAttributeLocation()', () => {
    describe('given known name', () => {
      const gl = headlessGl(640, 480);
      const vertexShaderSourceCode = `
        attribute vec4 position;
        void main(void) {
          gl_Position = position;
        }
      `;
      const fragmentShaderSourceCode = `
        void main(void) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        }
      `;
      const shader = new Shader(gl, { vertexShaderSourceCode, fragmentShaderSourceCode });

      it('should return the location of attribute', () => {
        expect(shader.getAttributeLocation('position')).toBeGreaterThanOrEqual(0);
      });
    });

    describe('given unknown name', () => {
      const gl = headlessGl(640, 480);
      const vertexShaderSourceCode = `
        attribute vec4 position;
        void main(void) {
          gl_Position = position;
        }
      `;
      const fragmentShaderSourceCode = `
        void main(void) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        }
      `;
      const shader = new Shader(gl, { vertexShaderSourceCode, fragmentShaderSourceCode });

      it('should throw an error', () => {
        expect(() => {
          shader.getAttributeLocation('foobar');
        }).toThrow();
      });
    });
  });

  describe('getUniformLocation()', () => {
    describe('given known name', () => {
      const gl = headlessGl(640, 480);
      const vertexShaderSourceCode = `
        attribute vec4 position;
        uniform vec4 color;
        varying vec4 vColor;
        void main(void) {
          vColor = color;
          gl_Position = position;
        }
      `;
      const fragmentShaderSourceCode = `
        void main(void) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        }
      `;
      const shader = new Shader(gl, { vertexShaderSourceCode, fragmentShaderSourceCode });

      it('should return the location of uniform', () => {
        expect(shader.getUniformLocation('color')).toBeDefined();
      });
    });

    describe('given unknown name', () => {
      const gl = headlessGl(640, 480);
      const vertexShaderSourceCode = `
        attribute vec4 position;
        uniform vec4 color;
        varying vec4 vColor;
        void main(void) {
          vColor = color;
          gl_Position = position;
        }
      `;
      const fragmentShaderSourceCode = `
        void main(void) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        }
      `;
      const shader = new Shader(gl, { vertexShaderSourceCode, fragmentShaderSourceCode });

      it('should throw an error', () => {
        expect(() => {
          shader.getUniformLocation('foobar');
        }).toThrow();
      });
    });
  });
});
