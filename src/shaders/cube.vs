#version 100
precision highp float;

attribute vec4 a_position;

uniform mat4 a_model;

void main() {
  gl_Position = a_position;
  gl_PointSize = 128.0;
}