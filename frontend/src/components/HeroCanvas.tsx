import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle } from 'ogl'

// Full-screen teal-tinted mesh-gradient drift behind the hero headline. Isolated in
// its own file so it can fail/be skipped independently of the rest of the page - the
// parent only ever lazy-imports this, and only when explicitly safe to do so (see the
// gating in PublicSite's hero: skipped under prefers-reduced-motion, on narrow/mobile
// viewports, and on low-core-count devices). A single fullscreen triangle (cheaper
// than a quad, standard technique) with a fragment shader animating a few drifting
// sine-based blobs - ambient depth, not a "look at me" effect.
const VERT = `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
  }
`

const FRAG = `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  varying vec2 vUv;

  float blob(vec2 uv, vec2 center, float r) {
    return smoothstep(r, 0.0, length(uv - center));
  }

  void main() {
    vec2 uv = vUv;
    uv.x *= uRes.x / uRes.y;
    float t = uTime * 0.05;

    vec2 c1 = vec2(0.65 + sin(t * 1.3) * 0.12, 0.55 + cos(t * 0.9) * 0.10);
    vec2 c2 = vec2(0.30 + cos(t * 0.8) * 0.14, 0.40 + sin(t * 1.1) * 0.12);
    vec2 c3 = vec2(0.50 + sin(t * 0.6 + 1.5) * 0.16, 0.65 + cos(t * 0.7 + 1.0) * 0.10);

    float g = blob(uv, c1, 0.55) * 0.5 + blob(uv, c2, 0.45) * 0.4 + blob(uv, c3, 0.5) * 0.35;
    g = clamp(g, 0.0, 1.0);

    vec3 teal = vec3(0.0, 0.961, 0.769);
    vec3 base = vec3(0.0, 0.0, 0.0);
    vec3 col = mix(base, teal, g * 0.22);

    gl_FragColor = vec4(col, g * 0.5);
  }
`

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio, 2) })
    const gl = renderer.gl
    gl.canvas.style.width = '100%'
    gl.canvas.style.height = '100%'
    container.appendChild(gl.canvas)

    const geometry = new Triangle(gl)
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uRes: { value: [container.clientWidth, container.clientHeight] },
      },
      transparent: true,
    })
    const mesh = new Mesh(gl, { geometry, program })

    const resize = () => {
      const w = container.clientWidth, h = container.clientHeight
      renderer.setSize(w, h)
      program.uniforms.uRes.value = [w, h]
    }
    resize()
    window.addEventListener('resize', resize)

    let rafId = 0
    let running = true
    const render = (t: number) => {
      if (!running) return
      program.uniforms.uTime.value = t * 0.001
      renderer.render({ scene: mesh })
      rafId = requestAnimationFrame(render)
    }
    rafId = requestAnimationFrame(render)

    // Pause when the tab isn't visible - no reason to burn GPU on a hidden tab.
    const onVis = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(rafId) }
      else if (!running) { running = true; rafId = requestAnimationFrame(render) }
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      running = false
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas)
    }
  }, [])

  return <div ref={containerRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }} />
}
