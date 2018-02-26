attribute vec3 position;
attribute vec4 normal;
uniform   vec4 color;

uniform   mat4 translate;
uniform   mat4 rotateX;
uniform   mat4 rotateY;
uniform   mat4 rotateZ;
uniform   mat4 scale;

uniform   vec3 camPos;
uniform   vec3 lookAtPos;

uniform   mat4 projectionMatrix;

varying   vec4 fragmentColor;

mat4 transpose(mat4 m) {
  return mat4(m[0][0], m[1][0], m[2][0], m[3][0],
              m[0][1], m[1][1], m[2][1], m[3][1],
              m[0][2], m[1][2], m[2][2], m[3][2],
              m[0][3], m[1][3], m[2][3], m[3][3]);
}

// @see http://yttm-work.jp/gmpg/gmpg_0003.html
// @see https://wgld.org/j/minMatrix.js
mat4 viewMatrix(void) {
  vec3 zVector = normalize(lookAtPos - camPos);
  vec3 xVector = cross(vec3(0.0, 1.0, 0.0), zVector);
  if (length(xVector) == 0.0) {
    xVector = vec3(1.0, 0.0, 0.0);
  } else {
    xVector = normalize(xVector);
  }
  vec3 yVector = normalize(cross(zVector, xVector));
  return mat4(vec4(xVector, -1.0 * dot(camPos, xVector)),
              vec4(yVector, -1.0 * dot(camPos, yVector)),
              vec4(zVector, -1.0 * dot(camPos, zVector)),
              vec4(0.0, 0.0, 0.0, 1.0));
}

mat4 transformMatrix(void) {
  return transpose(scale * rotateX * rotateY * rotateZ * translate * viewMatrix() * projectionMatrix);
}

void main(void) {
  fragmentColor = color;
  normal;
  gl_Position = transformMatrix() * vec4(position, 1.0);
}
