precision lowp float;

uniform sampler2D texture;

varying vec4 fragmentColor;
varying vec2 vTextureCoord;


// @see https://stackoverflow.com/a/17897228
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(void) {
  // gl_FragColor = vec4(hsv2rgb(fragmentColor.rgb), fragmentColor.a);
  gl_FragColor = texture2D(texture, vTextureCoord) + fragmentColor;
}
