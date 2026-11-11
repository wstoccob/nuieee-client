import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Group,
  LineBasicMaterial,
  LineLoop,
  Points,
  ShaderMaterial,
  type Color,
} from "three";

// Orbit radii, in the same units as the emblem model.
const ORBITS = [40, 60, 84, 112, 146];
const ORBIT_SPREAD = 5;
const ORBIT_SEGMENTS = 128;
const FIELD_TILT = 0.38;

const VERTEX_SHADER = /* glsl */ `
  attribute vec4 aOrbit; // radius, phase, height, size
  uniform float uTime;
  uniform float uPointScale;
  varying float vAlpha;

  void main() {
    float radius = aOrbit.x;
    // Slower further out, like field strength falling off with distance.
    float angle = aOrbit.y + uTime * 14.0 / radius;
    float bob = sin(uTime * 0.6 + aOrbit.y * 3.0) * 1.5;
    vec3 position = vec3(radius * cos(angle), aOrbit.z + bob, -radius * sin(angle));

    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = aOrbit.w * uPointScale / -viewPosition.z;

    float nearness = smoothstep(-radius, radius, position.z);
    vAlpha = smoothstep(175.0, 45.0, radius) * (0.3 + 0.7 * nearness);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float falloff = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));
    gl_FragColor = vec4(uColor, falloff * vAlpha);
  }
`;

// Roughly bell-shaped in [-1, 1].
const spread = () => (Math.random() + Math.random() + Math.random()) / 1.5 - 1;

function createParticles(count: number, color: Color) {
  const orbits = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    const radius = ORBITS[i % ORBITS.length] + spread() * ORBIT_SPREAD;
    orbits.set([radius, Math.random() * Math.PI * 2, spread() * radius * 0.16, 0.6 + Math.random() * 1.2], i * 4);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("aOrbit", new BufferAttribute(orbits, 4));
  // Positions are computed in the shader, so three cannot work out bounds for culling.
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(count * 3), 3));

  const material = new ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPointScale: { value: 1 }, uColor: { value: color } },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });

  const points = new Points(geometry, material);
  points.frustumCulled = false;
  return { points, material };
}

function createOrbitLine(radius: number, material: LineBasicMaterial) {
  const positions = new Float32Array(ORBIT_SEGMENTS * 3);
  for (let i = 0; i < ORBIT_SEGMENTS; i++) {
    const angle = (i / ORBIT_SEGMENTS) * Math.PI * 2;
    positions.set([radius * Math.cos(angle), 0, radius * Math.sin(angle)], i * 3);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  return new LineLoop(geometry, material);
}

/** A disc of particles and faint orbit lines circling the emblem's arrow, like the field around a current. */
export function createField(count: number, color: Color) {
  const { points, material } = createParticles(count, color);
  const lineMaterial = new LineBasicMaterial({ color, transparent: true, opacity: 0.09, depthWrite: false });
  const lines = ORBITS.map((radius) => createOrbitLine(radius, lineMaterial));

  const object = new Group().add(points, ...lines);
  object.rotation.x = FIELD_TILT;

  return {
    object,
    setTime: (seconds: number) => {
      material.uniforms.uTime.value = seconds;
    },
    setPointScale: (scale: number) => {
      material.uniforms.uPointScale.value = scale;
    },
    lean: (x: number, y: number) => object.rotation.set(FIELD_TILT + x * 0.6, 0, y * 0.12),
  };
}
