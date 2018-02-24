attribute vec3 pos;
uniform   vec4 color;

uniform   mat4 translate;
uniform   mat4 rotateX;
uniform   mat4 rotateY;
uniform   mat4 rotateZ;
uniform   mat4 scale;

uniform   vec3 camPos;
uniform   vec3 loopAtPos;

uniform   mat4 projectionMatrix;

varying   vec4 fragmentColor;

mat4 modelMatrix(void) {
  return translate * rotateZ * rotateY * rotateX * scale;
}

// @see http://yttm-work.jp/gmpg/gmpg_0003.html
// @see https://wgld.org/j/minMatrix.js
mat4 viewMatrix(void) {
  vec3 zVector = normalize(lookAtPos - camPos);
  vec3 xVector = normalize(cross(vec3(0.0, 1.0, 0.0), zVector));
  vec3 yVector = cross(zVector, xVector);
  return mat4(vec4(xVector, 0.0),
              vec4(yVector, 0.0),
              vec4(zVector, 0.0),
              vec4(-1.0 * dot(camPos, xVector),
                   -1.0 * dot(camPos, yVector),
                   -1.0 * dot(camPos, zVector),
                   1.0));
}

mat4 transformMatrix(void) {
  return projectionMatrix * viewMatrix() * modelMatrix();
}

void main(void) {
  fragmentColor = color;
  gl_Position = transformMatrix() * vec4(pos, 1.0);
}
