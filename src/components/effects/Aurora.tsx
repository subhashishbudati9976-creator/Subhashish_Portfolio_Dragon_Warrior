import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';

import './Aurora.css';

const VERT = `#version 300 es
in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
uniform float uLightMode;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865784187,
      0.366025403784439,
      -0.577350269189626,
      0.024390243902439
  );

  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

  vec2 i1 = (x0.x > x0.y)
    ? vec2(1.0, 0.0)
    : vec2(0.0, 1.0);

  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
    0.5 - vec3(
      dot(x0, x0),
      dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)
    ),
    0.0
  );

  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 -
       0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;

  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;

  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                              \
  for (int i = 0; i < 2; i++) {                              \
    ColorStop currentColor = colors[i];                      \
    bool isInBetween = currentColor.position <= factor;      \
    index = int(mix(                                       \
      float(index),                                         \
      float(i),                                             \
      float(isInBetween)                                    \
    ));                                                       \
  }                                                           \
  ColorStop currentColor = colors[index];                    \
  ColorStop nextColor = colors[index + 1];                   \
  float range = nextColor.position - currentColor.position;  \
  float lerpFactor = (factor - currentColor.position) / range;\
  finalColor = mix(                                           \
    currentColor.color,                                       \
    nextColor.color,                                          \
    lerpFactor                                                \
  );                                                          \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  ColorStop colors[3];

  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);

  vec3 rampColor;

  COLOR_RAMP(colors, uv.x, rampColor);

  float height =
    snoise(
      vec2(
        uv.x * 2.0 + uTime * 0.1,
        uTime * 0.25
      )
    ) * 0.5 * uAmplitude;

  height = exp(height);
  height = uv.y * 2.0 - height + 0.2;

  float intensity = 0.6 * height;

  float midPoint = 0.02;

  float auroraAlpha = smoothstep(
    midPoint - uBlend * 0.5,
    midPoint + uBlend * 0.5,
    intensity
  );

  vec3 auroraColor = intensity * rampColor;

  if (uLightMode > 0.5) {
    float energy = clamp(max(intensity, 0.0), 0.0, 1.0);

    float coverage = clamp(
      auroraAlpha * (0.55 + 0.45 * energy),
      0.0,
      0.86
    );

    vec3 chroma =
      pow(clamp(rampColor, 0.0, 1.0), vec3(1.2));

    float chromaPeak =
      max(chroma.r, max(chroma.g, chroma.b));

    chroma /= max(chromaPeak, 0.0001);

    fragColor = vec4(
      mix(
        vec3(1.0),
        chroma,
        min(coverage * 1.08, 0.94)
      ),
      1.0
    );
  } else {
    fragColor = vec4(
      auroraColor * auroraAlpha,
      auroraAlpha
    );
  }
}
`;

interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  lightMode?: boolean;
  time?: number;
  speed?: number;
}

export default function Aurora({
  colorStops = ['#6e1726', '#c6283d', '#1a0910'],
  amplitude = 0.8,
  blend = 0.5,
  lightMode = false,
  time,
  speed = 0.7,
}: AuroraProps) {
  const ctnDom = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Cap devicePixelRatio to 1.5 to prevent GPU fill-rate throttling on 4K/retina displays
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      dpr,
    });

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = 'transparent';

    let program: Program | null = null;

    const resize = () => {
      const width = ctn.offsetWidth;
      const height = ctn.offsetHeight;
      if (width === 0 || height === 0) return;

      renderer.setSize(width, height);
      if (program) {
        program.uniforms.uResolution.value = [width, height];
      }
    };

    window.addEventListener('resize', resize, { passive: true });

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    // Pre-calculate color stops ONCE, avoid per-frame allocation
    const colorStopsArray = colorStops.map((hex: string) => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });

    program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: colorStopsArray },
        uResolution: {
          value: [ctn.offsetWidth || 1, ctn.offsetHeight || 1],
        },
        uBlend: { value: blend },
        uLightMode: {
          value: lightMode ? 1 : 0,
        },
      },
    });

    const mesh = new Mesh(gl, {
      geometry,
      program,
    });

    ctn.appendChild(gl.canvas);

    let animateId = 0;
    let isVisible = false;

    const update = (t: number) => {
      if (!isVisible) return;

      animateId = requestAnimationFrame(update);

      const currentTime = time ?? t * 0.01;
      program!.uniforms.uTime.value = currentTime * speed * 0.1;
      program!.uniforms.uAmplitude.value = amplitude;
      program!.uniforms.uBlend.value = blend;

      renderer.render({
        scene: mesh,
      });
    };

    // IntersectionObserver: Only render when Aurora is actually visible in the viewport!
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;

        if (isVisible && !wasVisible) {
          resize();
          animateId = requestAnimationFrame(update);
        } else if (!isVisible && wasVisible) {
          cancelAnimationFrame(animateId);
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(ctn);
    resize();

    return () => {
      cancelAnimationFrame(animateId);
      observer.disconnect();
      window.removeEventListener('resize', resize);

      if (ctn && gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas);
      }

      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [amplitude, blend, colorStops, lightMode, speed, time]);

  return (
    <div
      ref={ctnDom}
      className="aurora-container"
    />
  );
}