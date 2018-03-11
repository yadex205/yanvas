#define MAX_LIGHT_COUNT 16

attribute vec3 vertex;
attribute vec3 surfaceNormal;
attribute vec3 vertexNormal;
attribute vec2 textureCoord;
uniform   vec4 color;

uniform   int  shadingMode;

uniform   mat4 modelTransform;
uniform   mat4 modelTransformInverse;
uniform   vec3 camPos;
uniform   vec3 lookAtPos;
uniform   mat4 projectionTransform;

uniform   mat4 lightTransforms[MAX_LIGHT_COUNT];
uniform   int  lightModes[MAX_LIGHT_COUNT];
uniform   bool lightEnabled[MAX_LIGHT_COUNT];

uniform   vec4 ambientColor;

varying   vec4 fragmentColor;
varying   vec2 vTextureCoord;

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
  vec3 xVector = cross(vec3(0.0, 0.0, 1.0), zVector);
  if (length(xVector) == 0.0) {
    xVector = vec3(-1.0, 0.0, 0.0);
  } else {
    xVector = normalize(xVector);
  }
  vec3 yVector = normalize(cross(zVector, xVector));
  return mat4(vec4(xVector, -1.0 * dot(camPos, xVector)),
              vec4(yVector, -1.0 * dot(camPos, yVector)),
              vec4(zVector, -1.0 * dot(camPos, zVector)),
              vec4(0.0, 0.0, 0.0, 1.0));
}

/**
 * @param [vec4] baseColor
 * @param [vec3] normal
 * @param [int] mode 0: directional, 1: point
 * @param [mat4] lightTransform
 * @return [vec4]
 */
vec4 lighting(vec4 baseColor, vec3 normal, int mode, mat4 lightTransform) {
  vec3 localLightDirection = vec3(0.0, 0.0, 1.0);
  if (mode == 0) {
    vec4 lightPosition = lightTransform * vec4(0.0, 0.0, 1.0, 0.0);
    localLightDirection = normalize((modelTransformInverse * lightPosition).xyz);
  } else if (mode == 1) {
    vec4 lightPosition = lightTransform * vec4(0.0, 0.0, 0.0, 1.0);
    localLightDirection = normalize((modelTransformInverse * lightPosition).xyz - vertex);
  }

  vec3 localCameraPosition = normalize(modelTransformInverse * vec4(camPos, 0.0)).xyz;
  vec3 halfLE = normalize(localLightDirection + localCameraPosition);

  float diffuse  = clamp(dot(localLightDirection, normalize(normal)), 0.0, 1.0);
  float specular = pow(clamp(dot(halfLE, normalize(normal)), 0.0, 1.0), 25.0);
  return baseColor * vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0) + ambientColor;
}

vec4 shading(vec4 baseColor) {
  vec4 resultColor = vec4(0.0, 0.0, 0.0, 0.0);

  if (shadingMode == 1) {
    for (int i = 0; i < MAX_LIGHT_COUNT; i++) {
      if (lightEnabled[i]) {
        resultColor += lighting(baseColor, surfaceNormal, lightModes[i], lightTransforms[i]);
      }
    }
  } else if (shadingMode == 2) {
    for (int i = 0; i < MAX_LIGHT_COUNT; i++) {
      if (lightEnabled[i]) {
        resultColor += lighting(baseColor, vertexNormal, lightModes[i], lightTransforms[i]);
      }
    }
  } else {
    resultColor = baseColor;
  }

  return resultColor;
}

void main(void) {
  fragmentColor = shading(color);
  vTextureCoord = textureCoord;
  vertexNormal;
  gl_Position = projectionTransform * transpose(viewMatrix()) * modelTransform * vec4(vertex, 1.0);
}
