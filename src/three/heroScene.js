import * as THREE from "three";

/**
 * RS International hero scene (Three.js, loaded on demand by HeroScene.jsx):
 *  - a dot globe turned to face India, with faint graticule lines and an emerald rim glow
 *  - arcs that draw out from New Delhi to the regions served, each carrying a travelling pulse
 *  - a rolling particle wave field along the bottom of the hero
 * The globe sits on the right of the hero so the headline stays clear.
 *
 * createHeroScene(canvas, { onFirstFrame }) → { setActive(bool), dispose() }
 */

const EMERALD = new THREE.Color("#10b981");
const MINT = new THREE.Color("#6ee7b7");

const ORIGIN = { lat: 28.61, lon: 77.21 }; // New Delhi
const DESTINATIONS = [
  { lat: 25.2, lon: 55.27 }, // Middle East (Dubai)
  { lat: 1.35, lon: 103.82 }, // South East Asia (Singapore)
  { lat: 52.52, lon: 13.4 }, // Europe (Berlin)
  { lat: 55.75, lon: 37.62 }, // Russian Federation (Moscow)
];

const DEG = Math.PI / 180;
function latLon(lat, lon, r = 1) {
  const phi = (90 - lat) * DEG;
  const theta = (lon + 180) * DEG;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

/** Round, soft-edged point sprite (shared by the globe dots and pulses). */
function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.45, "rgba(255,255,255,0.9)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function createHeroScene(canvas, { onFirstFrame } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.set(0, 0.25, 5.2);
  camera.lookAt(0, 0, 0);

  const disposables = [];
  const track = (...items) => (disposables.push(...items), items[0]);
  const sprite = track(dotTexture());

  // ---------- Globe ----------
  const tilt = new THREE.Group(); // fixed tilt so India's latitude faces the camera
  const spin = new THREE.Group(); // gentle sway + mouse parallax
  tilt.add(spin);
  scene.add(tilt);

  // Fibonacci-distributed dots
  const N = 2200;
  const dotPos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const a = i * Math.PI * (3 - Math.sqrt(5));
    dotPos.set([Math.cos(a) * r, y, Math.sin(a) * r], i * 3);
  }
  const dotsGeo = track(new THREE.BufferGeometry());
  dotsGeo.setAttribute("position", new THREE.BufferAttribute(dotPos, 3));
  const dotsMat = track(
    new THREE.PointsMaterial({ size: 0.03, map: sprite, color: EMERALD, transparent: true, opacity: 0.85, depthWrite: false })
  );
  spin.add(new THREE.Points(dotsGeo, dotsMat));

  // Graticule (meridians + parallels)
  const grat = [];
  for (let m = 0; m < 12; m++) {
    const lon = m * 30;
    for (let lat = -90; lat < 90; lat += 6) grat.push(latLon(lat, lon, 1.002), latLon(lat + 6, lon, 1.002));
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    for (let lon = 0; lon < 360; lon += 6) grat.push(latLon(lat, lon, 1.002), latLon(lat, lon + 6, 1.002));
  }
  const gratGeo = track(new THREE.BufferGeometry().setFromPoints(grat));
  const gratMat = track(new THREE.LineBasicMaterial({ color: EMERALD, transparent: true, opacity: 0.1, depthWrite: false }));
  spin.add(new THREE.LineSegments(gratGeo, gratMat));

  // Opaque dark core: drawn before the transparent dots/lines and writes depth,
  // so the far side of the globe is hidden and it reads as a solid sphere
  const coreGeo = track(new THREE.SphereGeometry(0.985, 48, 48));
  const coreMat = track(new THREE.MeshBasicMaterial({ color: 0x06100e }));
  spin.add(new THREE.Mesh(coreGeo, coreMat));

  // Soft halo: brightest at the globe's edge, fading to nothing at the halo's edge.
  // On this back-facing shell, dot(normal, view) runs from ~-0.55 at the globe rim to 0 at r=1.2.
  const glowGeo = track(new THREE.SphereGeometry(1.2, 48, 48));
  const glowMat = track(
    new THREE.ShaderMaterial({
      uniforms: { uColor: { value: EMERALD } },
      vertexShader: `varying vec3 vN; varying vec3 vV;
        void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
      fragmentShader: `uniform vec3 uColor; varying vec3 vN; varying vec3 vV;
        void main(){ float d = dot(vN, vV); float f = d > -0.553 ? pow(-d / 0.553, 2.2) : 0.0; gl_FragColor = vec4(uColor, f * 0.38); }`,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    })
  );
  tilt.add(new THREE.Mesh(glowGeo, glowMat));

  // Face New Delhi toward the camera
  const o = latLon(ORIGIN.lat, ORIGIN.lon);
  const baseYaw = -Math.atan2(o.x, o.z);
  tilt.rotation.x = ORIGIN.lat * DEG * 0.75;

  // ---------- Markers + arcs ----------
  const markerGeo = track(new THREE.SphereGeometry(0.018, 16, 16));
  const ringGeo = track(new THREE.RingGeometry(0.03, 0.04, 40));
  const rings = [];
  const addMarker = (p, color, scale = 1) => {
    const mat = track(new THREE.MeshBasicMaterial({ color }));
    const m = new THREE.Mesh(markerGeo, mat);
    m.position.copy(p).multiplyScalar(1.004);
    m.scale.setScalar(scale);
    spin.add(m);
    const rMat = track(new THREE.MeshBasicMaterial({ color, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
    const ring = new THREE.Mesh(ringGeo, rMat);
    ring.position.copy(p).multiplyScalar(1.006);
    ring.lookAt(p.clone().multiplyScalar(2));
    spin.add(ring);
    rings.push({ ring, mat: rMat, offset: Math.random() * Math.PI * 2, scale });
  };
  addMarker(o, new THREE.Color("#ffffff"), 1.4);

  const ARC_PTS = 80;
  const arcs = DESTINATIONS.map((d, i) => {
    const b = latLon(d.lat, d.lon);
    addMarker(b, MINT);
    const angle = o.angleTo(b);
    const lift = 0.12 + angle * 0.32;
    const pts = [];
    for (let k = 0; k <= ARC_PTS; k++) {
      const t = k / ARC_PTS;
      const v = new THREE.Vector3().copy(o).lerp(b, t).normalize(); // slerp-ish for short arcs
      pts.push(v.multiplyScalar(1 + lift * Math.sin(Math.PI * t)));
    }
    const geo = track(new THREE.BufferGeometry().setFromPoints(pts));
    geo.setDrawRange(0, 0);
    const mat = track(new THREE.LineBasicMaterial({ color: MINT, transparent: true, opacity: 0.85, depthWrite: false }));
    spin.add(new THREE.Line(geo, mat));

    // Travelling pulse
    const pGeo = track(new THREE.BufferGeometry());
    pGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(3), 3));
    const pMat = track(
      new THREE.PointsMaterial({ size: 0.075, map: sprite, color: new THREE.Color("#d1fae5"), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    const pulse = new THREE.Points(pGeo, pMat);
    spin.add(pulse);
    return { pts, geo, pGeo, pulse, delay: 0.6 + i * 0.45 };
  });

  // ---------- Particle wave field ----------
  const COLS = 160;
  const ROWS = 56;
  const wavePos = new Float32Array(COLS * ROWS * 3);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = (r * COLS + c) * 3;
      wavePos[i] = (c - COLS / 2) * 0.11;
      wavePos[i + 1] = 0;
      wavePos[i + 2] = -r * 0.13 + 1.2;
    }
  }
  const waveGeo = track(new THREE.BufferGeometry());
  waveGeo.setAttribute("position", new THREE.BufferAttribute(wavePos, 3));
  const waveMat = track(
    new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uColor: { value: EMERALD }, uPixel: { value: renderer.getPixelRatio() } },
      vertexShader: `uniform float uTime; uniform float uPixel; varying float vFade;
        void main(){
          vec3 p = position;
          p.y += sin(p.x * 0.55 + uTime * 0.7) * 0.16 + cos(p.z * 0.9 + uTime * 0.5) * 0.12 + sin((p.x + p.z) * 0.35 + uTime * 0.4) * 0.1;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = 2.2 * uPixel * (4.0 / -mv.z);
          vFade = smoothstep(9.0, 3.5, -mv.z) * (0.45 + 0.55 * smoothstep(-0.25, 0.3, p.y - position.y));
        }`,
      fragmentShader: `uniform vec3 uColor; varying float vFade;
        void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard; gl_FragColor = vec4(uColor, vFade * 0.95 * (1.0 - d * 1.6)); }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  const waves = new THREE.Points(waveGeo, waveMat);
  waves.position.y = -1.45;
  scene.add(waves);

  // ---------- Layout ----------
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas.parentElement;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const halfH = Math.tan((camera.fov / 2) * DEG) * camera.position.z;
    const halfW = halfH * camera.aspect;
    tilt.position.set(halfW * 0.6, 0.32, 0); // right side, clear of the headline
    tilt.scale.setScalar(Math.min(0.82, (halfW * 0.34) / 1.2));
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);
  resize();

  // ---------- Interaction ----------
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const onPointer = (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  // ---------- Loop ----------
  const clock = new THREE.Clock();
  let raf = 0;
  let active = true;
  let time = 0; // own clock, so pausing off-screen resumes rather than restarting the arcs
  let first = true;

  const frame = () => {
    raf = 0;
    if (!active) return;
    time += Math.min(clock.getDelta(), 0.05);
    const t = time;

    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    spin.rotation.y = baseYaw + Math.sin(t * 0.12) * 0.35 + mouse.x * 0.25;
    spin.rotation.x = mouse.y * 0.12;

    rings.forEach((r) => {
      const k = (Math.sin(t * 2 + r.offset) + 1) / 2;
      r.ring.scale.setScalar(r.scale * (1 + k * 1.4));
      r.mat.opacity = 0.7 * (1 - k);
    });

    arcs.forEach((a) => {
      const draw = THREE.MathUtils.clamp((t - a.delay) / 1.4, 0, 1);
      const eased = 1 - Math.pow(1 - draw, 3);
      a.geo.setDrawRange(0, Math.floor(eased * (ARC_PTS + 1)));
      // Pulse runs along the finished arc every ~3.2s
      const cycle = ((t - a.delay - 1.4) % 3.2) / 3.2;
      a.pulse.visible = draw >= 1 && cycle >= 0;
      if (a.pulse.visible) {
        const p = a.pts[Math.min(ARC_PTS, Math.floor(cycle * ARC_PTS))];
        a.pGeo.attributes.position.setXYZ(0, p.x, p.y, p.z);
        a.pGeo.attributes.position.needsUpdate = true;
      }
    });

    waveMat.uniforms.uTime.value = t;
    renderer.render(scene, camera);
    if (first) {
      first = false;
      onFirstFrame?.();
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return {
    /** Pause while the hero is off-screen or the tab is hidden. */
    setActive(on) {
      if (on === active) return;
      active = on;
      if (on) {
        clock.getDelta(); // drop the paused interval
        if (!raf) raf = requestAnimationFrame(frame);
      }
    },
    dispose() {
      active = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      disposables.forEach((d) => d.dispose?.());
      renderer.dispose();
    },
  };
}
