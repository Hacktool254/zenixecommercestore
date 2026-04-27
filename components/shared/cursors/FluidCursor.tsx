"use client";

// WebGL Fluid Simulation cursor (ported from Pavel Dobryakov's sim)
// Full Navier-Stokes: curl, vorticity, divergence, pressure, gradient-subtract, advection
import { useEffect, useRef } from "react";
import type { FC } from "react";

export const FluidCursor: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasRaw = canvasRef.current;
    if (!canvasRaw) return;
    const canvas: HTMLCanvasElement = canvasRaw;

    const config = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 1024,
      DENSITY_DISSIPATION: 3.5,
      VELOCITY_DISSIPATION: 2,
      PRESSURE: 0.1,
      PRESSURE_ITERATIONS: 20,
      CURL: 10,
      SPLAT_RADIUS: 0.5,
      SPLAT_FORCE: 6000,
    };

    const params = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    };
    let glRaw = canvas.getContext("webgl2", params) as WebGL2RenderingContext | null;
    const isWebGL2 = !!glRaw;
    if (!glRaw)
      glRaw = (canvas.getContext("webgl", params) ||
        canvas.getContext("experimental-webgl", params)) as WebGL2RenderingContext;
    if (!glRaw) return;

    // Capture as non-null const so TypeScript can trust it inside all closures
    const gl: WebGL2RenderingContext = glRaw;

    let halfFloat: { HALF_FLOAT_OES: number } | null = null;
    let supportLinearFiltering: unknown;
    if (isWebGL2) {
      gl.getExtension("EXT_color_buffer_float");
      supportLinearFiltering = gl.getExtension("OES_texture_float_linear");
    } else {
      halfFloat = gl.getExtension("OES_texture_half_float") as { HALF_FLOAT_OES: number } | null;
      supportLinearFiltering = gl.getExtension("OES_texture_half_float_linear");
    }

    gl.clearColor(0, 0, 0, 1);
    const halfFloatTexType = isWebGL2
      ? gl.HALF_FLOAT
      : (halfFloat?.HALF_FLOAT_OES ?? gl.UNSIGNED_BYTE);

    function getSupportedFormat(
      internalFormat: number,
      format: number,
      type: number
    ): { internalFormat: number; format: number } | null {
      if (!supportRenderTextureFormat(internalFormat, format, type)) {
        if (internalFormat === gl.R16F) return getSupportedFormat(gl.RG16F, gl.RG, type);
        if (internalFormat === gl.RG16F) return getSupportedFormat(gl.RGBA16F, gl.RGBA, type);
        return null;
      }
      return { internalFormat, format };
    }

    function supportRenderTextureFormat(internalFormat: number, format: number, type: number) {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    }

    let formatRGBA: { internalFormat: number; format: number } | null;
    let formatRG: { internalFormat: number; format: number } | null;
    let formatR: { internalFormat: number; format: number } | null;

    if (isWebGL2) {
      formatRGBA = getSupportedFormat(gl.RGBA16F, gl.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(gl.RG16F, gl.RG, halfFloatTexType);
      formatR = getSupportedFormat(gl.R16F, gl.RED, halfFloatTexType);
    } else {
      formatRGBA = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
      formatR = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
    }

    // Uniform locations may be null (missing/inactive uniforms) — reflect that in the type
    type UniformMap = Record<string, WebGLUniformLocation | null>;

    function compileShader(type: number, src: string, keywords?: string[] | null): WebGLShader {
      let source = src;
      if (keywords) source = keywords.map((k) => `#define ${k}\n`).join("") + source;
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    function createProgram(vert: WebGLShader, frag: WebGLShader): WebGLProgram {
      const p = gl.createProgram()!;
      gl.attachShader(p, vert);
      gl.attachShader(p, frag);
      gl.linkProgram(p);
      return p;
    }

    function getUniforms(program: WebGLProgram): UniformMap {
      const uniforms: UniformMap = {};
      const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
      for (let i = 0; i < count; i++) {
        const name = gl.getActiveUniform(program, i)!.name;
        uniforms[name] = gl.getUniformLocation(program, name);
      }
      return uniforms;
    }

    function loc(map: UniformMap, name: string): WebGLUniformLocation | null {
      return map[name] ?? null;
    }

    const baseVertSrc = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform vec2 texelSize;
      void main(){
        vUv=aPosition*.5+.5;
        vL=vUv-vec2(texelSize.x,0.); vR=vUv+vec2(texelSize.x,0.);
        vT=vUv+vec2(0.,texelSize.y); vB=vUv-vec2(0.,texelSize.y);
        gl_Position=vec4(aPosition,0.,1.);
      }`;

    const baseVert = compileShader(gl.VERTEX_SHADER, baseVertSrc);

    const splatSrc = `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget; uniform float aspectRatio;
      uniform vec3 color; uniform vec2 point; uniform float radius;
      void main(){
        vec2 p=vUv-point.xy; p.x*=aspectRatio;
        vec3 splat=exp(-dot(p,p)/radius)*color;
        vec3 base=texture2D(uTarget,vUv).xyz;
        gl_FragColor=vec4(base+splat,1.);
      }`;

    const advSrc = `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity; uniform sampler2D uSource;
      uniform vec2 texelSize; uniform vec2 dyeTexelSize;
      uniform float dt; uniform float dissipation;
      vec4 bilerp(sampler2D sam,vec2 uv,vec2 tsize){
        vec2 st=uv/tsize-.5; vec2 iuv=floor(st); vec2 fuv=fract(st);
        vec4 a=texture2D(sam,(iuv+vec2(.5,.5))*tsize);
        vec4 b=texture2D(sam,(iuv+vec2(1.5,.5))*tsize);
        vec4 c=texture2D(sam,(iuv+vec2(.5,1.5))*tsize);
        vec4 d=texture2D(sam,(iuv+vec2(1.5,1.5))*tsize);
        return mix(mix(a,b,fuv.x),mix(c,d,fuv.x),fuv.y);
      }
      #ifdef MANUAL_FILTERING
      void main(){
        vec2 coord=vUv-dt*bilerp(uVelocity,vUv,texelSize).xy*texelSize;
        vec4 result=bilerp(uSource,coord,dyeTexelSize);
        gl_FragColor=result/(1.+dissipation*dt);
      }
      #else
      void main(){
        vec2 coord=vUv-dt*texture2D(uVelocity,vUv).xy*texelSize;
        vec4 result=texture2D(uSource,coord);
        gl_FragColor=result/(1.+dissipation*dt);
      }
      #endif`;

    const divSrc = `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main(){
        float L=texture2D(uVelocity,vL).x; float R=texture2D(uVelocity,vR).x;
        float T=texture2D(uVelocity,vT).y; float B=texture2D(uVelocity,vB).y;
        vec2 C=texture2D(uVelocity,vUv).xy;
        if(vL.x<0.) L=-C.x; if(vR.x>1.) R=-C.x;
        if(vT.y>1.) T=-C.y; if(vB.y<0.) B=-C.y;
        gl_FragColor=vec4(.5*(R-L+T-B),0.,0.,1.);
      }`;

    const curlSrc = `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main(){
        float L=texture2D(uVelocity,vL).y; float R=texture2D(uVelocity,vR).y;
        float T=texture2D(uVelocity,vT).x; float B=texture2D(uVelocity,vB).x;
        gl_FragColor=vec4(.5*(R-L-T+B),0.,0.,1.);
      }`;

    const vortSrc = `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uVelocity; uniform sampler2D uCurl;
      uniform float curl; uniform float dt;
      void main(){
        float L=texture2D(uCurl,vL).x; float R=texture2D(uCurl,vR).x;
        float T=texture2D(uCurl,vT).x; float B=texture2D(uCurl,vB).x;
        float C=texture2D(uCurl,vUv).x;
        vec2 force=.5*vec2(abs(T)-abs(B),abs(R)-abs(L));
        force/=length(force)+.0001; force*=curl*C; force.y*=-1.;
        vec2 velocity=texture2D(uVelocity,vUv).xy;
        velocity+=force*dt; velocity=min(max(velocity,-1000.),1000.);
        gl_FragColor=vec4(velocity,0.,1.);
      }`;

    const pressSrc = `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
      uniform sampler2D uPressure; uniform sampler2D uDivergence;
      void main(){
        float L=texture2D(uPressure,vL).x; float R=texture2D(uPressure,vR).x;
        float T=texture2D(uPressure,vT).x; float B=texture2D(uPressure,vB).x;
        float divergence=texture2D(uDivergence,vUv).x;
        gl_FragColor=vec4((L+R+B+T-divergence)*.25,0.,0.,1.);
      }`;

    const gradSrc = `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
      uniform sampler2D uPressure; uniform sampler2D uVelocity;
      void main(){
        float L=texture2D(uPressure,vL).x; float R=texture2D(uPressure,vR).x;
        float T=texture2D(uPressure,vT).x; float B=texture2D(uPressure,vB).x;
        vec2 velocity=texture2D(uVelocity,vUv).xy;
        velocity.xy-=vec2(R-L,T-B);
        gl_FragColor=vec4(velocity,0.,1.);
      }`;

    const clearSrc = `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture; uniform float value;
      void main(){ gl_FragColor=value*texture2D(uTexture,vUv); }`;

    const displaySrc = `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uTexture; uniform vec2 texelSize;
      vec3 linearToGamma(vec3 c){ c=max(c,vec3(0.)); return max(1.055*pow(c,vec3(.4166667))-.055,vec3(0.)); }
      void main(){
        vec3 c=texture2D(uTexture,vUv).rgb;
        float a=max(c.r,max(c.g,c.b));
        gl_FragColor=vec4(c,a);
      }`;

    function makeProgram(fragSrc: string, keywords?: string[] | null) {
      const frag = compileShader(gl.FRAGMENT_SHADER, fragSrc, keywords);
      const prog = createProgram(baseVert, frag);
      return { prog, uniforms: getUniforms(prog) };
    }

    const splatP = makeProgram(splatSrc);
    const advP = makeProgram(advSrc, supportLinearFiltering ? null : ["MANUAL_FILTERING"]);
    const divP = makeProgram(divSrc);
    const curlP = makeProgram(curlSrc);
    const vortP = makeProgram(vortSrc);
    const pressP = makeProgram(pressSrc);
    const gradP = makeProgram(gradSrc);
    const clearP = makeProgram(clearSrc);
    const displayP = makeProgram(displaySrc);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    type FBO = {
      texture: WebGLTexture;
      fbo: WebGLFramebuffer;
      width: number;
      height: number;
      texelSizeX: number;
      texelSizeY: number;
      attach: (id: number) => number;
    };
    type DFBO = {
      read: FBO;
      write: FBO;
      width: number;
      height: number;
      texelSizeX: number;
      texelSizeY: number;
      swap: () => void;
    };

    function createFBO(
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): FBO {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
        attach(id: number) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        },
      };
    }

    function createDFBO(
      w: number,
      h: number,
      iF: number,
      f: number,
      t: number,
      param: number
    ): DFBO {
      let r = createFBO(w, h, iF, f, t, param);
      let wr = createFBO(w, h, iF, f, t, param);
      return {
        get read() {
          return r;
        },
        get write() {
          return wr;
        },
        width: w,
        height: h,
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
        swap() {
          const tmp = r;
          r = wr;
          wr = tmp;
        },
      };
    }

    function blit(target: FBO | null) {
      if (!target) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    function getResolution(res: number) {
      let ar = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (ar < 1) ar = 1 / ar;
      const min = Math.round(res);
      const max = Math.round(res * ar);
      return gl.drawingBufferWidth > gl.drawingBufferHeight
        ? { width: max, height: min }
        : { width: min, height: max };
    }

    function scaleByPixelRatio(v: number) {
      return Math.floor(v * (window.devicePixelRatio || 1));
    }

    const texType = halfFloatTexType;
    const rgba = formatRGBA!;
    const rg = formatRG!;
    const r = formatR!;
    const filtering = supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

    let dyeFBO: DFBO, velFBO: DFBO, divFBO: FBO, curlFBO: FBO, pressFBO: DFBO;

    function initFBOs() {
      const sim = getResolution(config.SIM_RESOLUTION);
      const dye = getResolution(config.DYE_RESOLUTION);
      dyeFBO = createDFBO(
        dye.width,
        dye.height,
        rgba.internalFormat,
        rgba.format,
        texType,
        filtering
      );
      velFBO = createDFBO(sim.width, sim.height, rg.internalFormat, rg.format, texType, filtering);
      divFBO = createFBO(sim.width, sim.height, r.internalFormat, r.format, texType, gl.NEAREST);
      curlFBO = createFBO(sim.width, sim.height, r.internalFormat, r.format, texType, gl.NEAREST);
      pressFBO = createDFBO(sim.width, sim.height, r.internalFormat, r.format, texType, gl.NEAREST);
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initFBOs();
    }
    resize();
    window.addEventListener("resize", resize);

    function HSVtoRGB(h: number) {
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const q = 1 - f;
      const t = f;
      let r = 0,
        g = 0,
        b = 0;
      switch (i % 6) {
        case 0:
          r = 1;
          g = t;
          b = 0;
          break;
        case 1:
          r = q;
          g = 1;
          b = 0;
          break;
        case 2:
          r = 0;
          g = 1;
          b = t;
          break;
        case 3:
          r = 0;
          g = q;
          b = 1;
          break;
        case 4:
          r = t;
          g = 0;
          b = 1;
          break;
        case 5:
          r = 1;
          g = 0;
          b = q;
          break;
      }
      return { r: r * 0.15, g: g * 0.15, b: b * 0.15 };
    }

    function correctRadius(radius: number) {
      const ar = canvas.width / canvas.height;
      return ar > 1 ? radius * ar : radius;
    }
    function correctDeltaX(d: number) {
      const ar = canvas.width / canvas.height;
      return ar < 1 ? d * ar : d;
    }
    function correctDeltaY(d: number) {
      const ar = canvas.width / canvas.height;
      return ar > 1 ? d / ar : d;
    }

    function splat(
      x: number,
      y: number,
      dx: number,
      dy: number,
      color: { r: number; g: number; b: number }
    ) {
      gl.useProgram(splatP.prog);
      gl.uniform1i(loc(splatP.uniforms, "uTarget"), velFBO.read.attach(0));
      gl.uniform1f(loc(splatP.uniforms, "aspectRatio"), canvas.width / canvas.height);
      gl.uniform2f(loc(splatP.uniforms, "point"), x, y);
      gl.uniform3f(loc(splatP.uniforms, "color"), dx, dy, 0);
      gl.uniform1f(loc(splatP.uniforms, "radius"), correctRadius(config.SPLAT_RADIUS / 100));
      blit(velFBO.write);
      velFBO.swap();
      gl.uniform1i(loc(splatP.uniforms, "uTarget"), dyeFBO.read.attach(0));
      gl.uniform3f(loc(splatP.uniforms, "color"), color.r, color.g, color.b);
      blit(dyeFBO.write);
      dyeFBO.swap();
    }

    const pointer = {
      texcoordX: 0,
      texcoordY: 0,
      prevTexcoordX: 0,
      prevTexcoordY: 0,
      deltaX: 0,
      deltaY: 0,
      moved: false,
      color: HSVtoRGB(Math.random()),
    };

    const onMove = (e: MouseEvent) => {
      const posX = scaleByPixelRatio(e.clientX);
      const posY = scaleByPixelRatio(e.clientY);
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.texcoordX = posX / canvas.width;
      pointer.texcoordY = 1 - posY / canvas.height;
      pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
      pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
      pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
    };
    window.addEventListener("mousemove", onMove);

    let lastTime = Date.now();
    let colorTimer = 0;
    let raf: number;

    function step(dt: number) {
      gl.disable(gl.BLEND);

      gl.useProgram(curlP.prog);
      gl.uniform2f(loc(curlP.uniforms, "texelSize"), velFBO.texelSizeX, velFBO.texelSizeY);
      gl.uniform1i(loc(curlP.uniforms, "uVelocity"), velFBO.read.attach(0));
      blit(curlFBO);

      gl.useProgram(vortP.prog);
      gl.uniform2f(loc(vortP.uniforms, "texelSize"), velFBO.texelSizeX, velFBO.texelSizeY);
      gl.uniform1i(loc(vortP.uniforms, "uVelocity"), velFBO.read.attach(0));
      gl.uniform1i(loc(vortP.uniforms, "uCurl"), curlFBO.attach(1));
      gl.uniform1f(loc(vortP.uniforms, "curl"), config.CURL);
      gl.uniform1f(loc(vortP.uniforms, "dt"), dt);
      blit(velFBO.write);
      velFBO.swap();

      gl.useProgram(divP.prog);
      gl.uniform2f(loc(divP.uniforms, "texelSize"), velFBO.texelSizeX, velFBO.texelSizeY);
      gl.uniform1i(loc(divP.uniforms, "uVelocity"), velFBO.read.attach(0));
      blit(divFBO);

      gl.useProgram(clearP.prog);
      gl.uniform1i(loc(clearP.uniforms, "uTexture"), pressFBO.read.attach(0));
      gl.uniform1f(loc(clearP.uniforms, "value"), config.PRESSURE);
      blit(pressFBO.write);
      pressFBO.swap();

      gl.useProgram(pressP.prog);
      gl.uniform2f(loc(pressP.uniforms, "texelSize"), velFBO.texelSizeX, velFBO.texelSizeY);
      gl.uniform1i(loc(pressP.uniforms, "uDivergence"), divFBO.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(loc(pressP.uniforms, "uPressure"), pressFBO.read.attach(1));
        blit(pressFBO.write);
        pressFBO.swap();
      }

      gl.useProgram(gradP.prog);
      gl.uniform2f(loc(gradP.uniforms, "texelSize"), velFBO.texelSizeX, velFBO.texelSizeY);
      gl.uniform1i(loc(gradP.uniforms, "uPressure"), pressFBO.read.attach(0));
      gl.uniform1i(loc(gradP.uniforms, "uVelocity"), velFBO.read.attach(1));
      blit(velFBO.write);
      velFBO.swap();

      gl.useProgram(advP.prog);
      gl.uniform2f(loc(advP.uniforms, "texelSize"), velFBO.texelSizeX, velFBO.texelSizeY);
      if (!supportLinearFiltering)
        gl.uniform2f(loc(advP.uniforms, "dyeTexelSize"), velFBO.texelSizeX, velFBO.texelSizeY);
      const vId = velFBO.read.attach(0);
      gl.uniform1i(loc(advP.uniforms, "uVelocity"), vId);
      gl.uniform1i(loc(advP.uniforms, "uSource"), vId);
      gl.uniform1f(loc(advP.uniforms, "dt"), dt);
      gl.uniform1f(loc(advP.uniforms, "dissipation"), config.VELOCITY_DISSIPATION);
      blit(velFBO.write);
      velFBO.swap();

      if (!supportLinearFiltering)
        gl.uniform2f(loc(advP.uniforms, "dyeTexelSize"), dyeFBO.texelSizeX, dyeFBO.texelSizeY);
      gl.uniform1i(loc(advP.uniforms, "uVelocity"), velFBO.read.attach(0));
      gl.uniform1i(loc(advP.uniforms, "uSource"), dyeFBO.read.attach(1));
      gl.uniform1f(loc(advP.uniforms, "dissipation"), config.DENSITY_DISSIPATION);
      blit(dyeFBO.write);
      dyeFBO.swap();
    }

    function tick() {
      const now = Date.now();
      const dt = Math.min((now - lastTime) / 1000, 0.016666);
      lastTime = now;

      colorTimer += dt * 10;
      if (colorTimer >= 1) {
        colorTimer = 0;
        pointer.color = HSVtoRGB(Math.random());
      }

      if (pointer.moved) {
        pointer.moved = false;
        splat(
          pointer.texcoordX,
          pointer.texcoordY,
          pointer.deltaX * config.SPLAT_FORCE,
          pointer.deltaY * config.SPLAT_FORCE,
          pointer.color
        );
      }

      step(dt);

      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      gl.useProgram(displayP.prog);
      gl.uniform1i(loc(displayP.uniforms, "uTexture"), dyeFBO.read.attach(0));
      blit(null);

      raf = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden="true"
    />
  );
};
