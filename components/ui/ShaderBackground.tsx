'use client';

import { useEffect, useRef, useState } from 'react';

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;

    if (!gl) {
      console.warn('WebGL not supported, falling back to CSS animation');
      setHasWebGL(false);
      return;
    }

    // Vertex shader source (simple full-screen quad)
    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment shader source (fluid, domain-warped calming flow)
    const fsSource = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;

      // Bug-free hash generator for noise
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      // Smooth 2D noise
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(mix(hash(i + vec2(0.0,0.0)), 
                       hash(i + vec2(1.0,0.0)), u.x),
                   mix(hash(i + vec2(0.0,1.0)), 
                       hash(i + vec2(1.0,1.0)), u.x), u.y);
      }

      // Fractional Brownian Motion for multi-layered fluid look
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        // Rotate layers to eliminate axis bias
        mat2 rot = mat2(0.87758, 0.47942, -0.47942, 0.87758);
        for (int i = 0; i < 4; ++i) {
          v += a * noise(p);
          p = rot * p * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        // Normalize screen coordinates
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        
        // Dynamic Domain Warping for calming fluid effect
        vec2 q = vec2(0.0);
        q.x = fbm(uv * 1.4 + vec2(0.0) + u_time * 0.015);
        q.y = fbm(uv * 1.4 + vec2(5.2, 1.3) + u_time * 0.02);

        vec2 r = vec2(0.0);
        r.x = fbm(uv * 1.6 + 4.0 * q + vec2(1.7, 9.2) + u_time * 0.008);
        r.y = fbm(uv * 1.6 + 4.0 * q + vec2(8.3, 2.8) + u_time * 0.012);

        // Final morphed noise factor
        float f = fbm(uv * 1.2 + 4.0 * r);

        // Curated Calming Celestial Color Tokens (Pinks, Mints, Lavenders, Creams)
        vec3 blush = vec3(0.99, 0.92, 0.95);     // Soft Blush Pink (#fdeef4)
        vec3 sage = vec3(0.93, 0.96, 0.94);      // Soft Mint/Sage (#edf5f0)
        vec3 lavender = vec3(0.95, 0.93, 0.98);  // Calm Lilac/Lavender (#f2edf9)
        vec3 cream = vec3(0.99, 0.98, 0.95);     // Warm Cream (#fdfdf2)

        // Interpolate colors dynamically based on warped noise
        vec3 col = mix(blush, sage, clamp(f * 1.2, 0.0, 1.0));
        col = mix(col, lavender, clamp(length(q), 0.0, 1.0));
        col = mix(col, cream, clamp(r.x * 1.1, 0.0, 1.0));

        // Subtly shift hue slowly over time
        col += vec3(0.008, 0.008, 0.012) * sin(u_time * 0.1);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    // Helper to compile shaders
    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);

    if (!vs || !fs) return;

    // Link program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Setup buffer for full-screen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

    let animationFrameId: number;
    const startTime = Date.now();

    const resizeCanvas = () => {
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const render = () => {
      const elapsedSeconds = (Date.now() - startTime) / 1000.0;

      // Pass time and resolution to fragment shader
      gl.uniform1f(timeLocation, elapsedSeconds);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  if (!hasWebGL) {
    // Elegant CSS Keyframe fallback for non-WebGL devices
    return (
      <div 
        className="fixed inset-0 pointer-events-none -z-10 animate-aurora-gradient bg-[length:400%_400%]"
        style={{
          backgroundImage: 'linear-gradient(135deg, #fdeef4 0%, #edf5f0 33%, #f2edf9 66%, #fdfdf2 100%)',
          animation: 'aurora-flow 18s ease infinite'
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-10"
      style={{ filter: 'contrast(1.02) saturate(1.05)' }}
    />
  );
}
