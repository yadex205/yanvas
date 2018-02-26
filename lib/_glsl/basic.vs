attribute vec3 position;
attribute vec3 normal;
uniform   vec4 color;

uniform   mat4 modelTransform;
uniform   mat4 modelTransformInverse;
uniform   vec3 camPos;
uniform   vec3 lookAtPos;
uniform   mat4 projectionTransform;

uniform   vec4 ambientColor;
uniform   vec3 sunDirection;

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

// @see https://wgld.org/d/webgl/w021.html
// @see https://wgld.org/d/webgl/w022.html
// @see https://wgld.org/d/webgl/w023.html
vec4 sunLight(vec4 baseColor) {
  vec3 localLightDirection = normalize(modelTransformInverse * vec4(sunDirection, 0.0)).xyz;
  vec3 localCamPos         = normalize(modelTransformInverse * vec4(camPos, 0.0)).xyz;
  vec3 halfLE = normalize(localLightDirection + localCamPos);
  float diffuse  = clamp(dot(localLightDirection, normalize(normal)), 0.0, 1.0);
  float specular = pow(clamp(dot(halfLE, normalize(normal)), 0.0, 1.0), 50.0);
  return baseColor * vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0) + ambientColor;
}

void main(void) {
  fragmentColor = sunLight(color);
  gl_Position = projectionTransform * transpose(viewMatrix()) * modelTransform * vec4(position, 1.0);
}
