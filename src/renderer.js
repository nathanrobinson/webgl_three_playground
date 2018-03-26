import './styles/appStyles.scss';
import cubeSource from './shaders/cube.vs';
import fragmentSource from './shaders/cube.fs';

export class Renderer {
    constructor() {
        this.backgroundColor = this.getRandomColor();
        this.color = this.getRandomColor();
        this.velocity = 3.0;
        this.position = [0, 0, 0, 1];

        this.canvas = this.initCanvas();
    }

    run() {
        this.gl = this.initGl(this.canvas);
        this.setupAnimation();
    }

    stop() {
        if (!!this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
        this.cleanup();
    }

    initCanvas() {
        const canvas = document.createElement('canvas');
        canvas.innerText = 'WebGL not supported in this browser.';      
        return canvas;
    }

    initGl(canvas) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        const localGl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

        if (!!localGl) {
            localGl.viewport(0, 0, localGl.drawingBufferWidth, localGl.drawingBufferHeight);
        }
        return localGl;
    }
    
    getRandomColor() {
        return [Math.random(), Math.random(), Math.random()];
    }

    drawBackground() {
        this.gl.disable(this.gl.SCISSOR_TEST);
        this.gl.clearColor(this.backgroundColor[0] * 0.22, this.backgroundColor[1] * 0.25, this.backgroundColor[2] * 0.24, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    createShader(gl, type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
          return shader;
        }
       
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    createProgram(gl, vertexShader, fragmentShader) {
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {            
            gl.detachShader(program, vertexShader);
            gl.detachShader(program, fragmentShader);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            return program;
        }
       
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

    setupAnimation() {
        if (!!this.gl) {
        //     this.position = [0, this.gl.drawingBufferHeight];
        //     this.gl.enable(this.gl.SCISSOR_TEST);
        //     this.gl.clearColor(this.color[0], this.color[1], this.color[2], 1.0);
        //     this.timer = setInterval(() => this.drawAnimation(), 17);
        // }
            const vertexShader = this.createShader(this.gl, this.gl.VERTEX_SHADER, cubeSource);

            const fragmentShader = this.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentSource);

            this.program = this.createProgram(this.gl, vertexShader, fragmentShader);
            if (!this.program) {
                return;
            }

            this.initializeAttributes();

            this.gl.useProgram(this.program);
            this.gl.drawArrays(this.gl.POINTS, 0, 1);
            this.timer = setInterval(() => this.drawAnimation(), 17);
        }
    }
    
    initializeAttributes() {
        const positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
        const matrixLocation = this.gl.getUniformLocation(this.program, "a_model");
        this.gl.enableVertexAttribArray(positionAttributeLocation);
        this.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.position), this.gl.STATIC_DRAW);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 2;          // 2 components per iteration
        var type = this.gl.FLOAT;   // the data is 32bit floats
        var normalize = true; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer

        this.gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
        
        this.gl.enable(this.gl.DEPTH_TEST);
    }

    cleanup() {
        this.gl.useProgram(null);
        if (this.buffer)
            this.gl.deleteBuffer(this.buffer);
        if (this.program)
            this.gl.deleteProgram(this.program);
    }

    drawAnimation() {
        // //this.drawBackground();
        // this.gl.scissor(this.position[0], this.position[1], this.size[0] , this.size[1]);
        // this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        // // Every frame the vertical position of the square is
        // // decreased, to create the illusion of movement.
        // this.position[1] -= this.velocity;
        // // When the sqaure hits the bottom of the drawing buffer,
        // // we override it with new square of different color and
        // // velocity.
        // if (this.position[1] < 0) {
        //   // Horizontal position chosen randomly, and vertical
        //   // position at the top of the drawing buffer.
        //   this.position = [
        //     Math.random()*(this.gl.drawingBufferWidth - this.size[0]),
        //     this.gl.drawingBufferHeight
        //   ];
        //   // Random velocity between 1.0 and 7.0
        //   this.velocity = 1.0 + 10.0*Math.random();
        //   this.color = this.getRandomColor();
        //   this.gl.clearColor(this.color[0], this.color[1], this.color[2], 1.0);
        // }
        const ticks = new Date().getTime();
        this.position[0] = Math.sin(ticks/1000) * 0.75;
        this.position[1] = Math.cos(ticks/1000) * 0.75;

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.position), this.gl.STATIC_DRAW);

        this.gl.drawArrays(this.gl.POINTS, 0, 1);
    }
}