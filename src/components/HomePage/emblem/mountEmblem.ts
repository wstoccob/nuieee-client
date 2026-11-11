import {
  ACESFilmicToneMapping,
  Color,
  DirectionalLight,
  Group,
  MathUtils,
  MeshStandardMaterial,
  PMREMGenerator,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer,
  type Object3D,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { createEmblem } from "./emblemModel";
import { createField } from "./fieldParticles";

const CAMERA = { fov: 28, distance: 150 };
// Model units across the anchor box; the emblem itself is 54 wide, the rest is breathing room.
const ANCHOR_SPAN = 74;
const MAX_PIXEL_RATIO = 1.5;
const PARTICLES = { wide: 1600, narrow: 800, narrowBelow: 640 };

const INTRO_SECONDS = 1.8;
const INTRO_TURN = -Math.PI * 1.25;
const RESTING_POSE = { x: 0.1, y: -0.45 };
const LOOP_SPEED = 0.45;
const MAX_FRAME_SECONDS = 0.05;
const DRAG_RADIANS_PER_PIXEL = 0.012;
const SCROLL_TURN = 0.9;
const FULL_TURN = Math.PI * 2;

function themeColor(token: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  return new Color(value || "white");
}

function createScene(renderer: WebGLRenderer, particleCount: number) {
  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const accent = themeColor("--color-hk-accent-fg");
  const key = new DirectionalLight("white", 2.2);
  key.position.set(-40, 60, 80);
  const rim = new PointLight(accent, 9000, 0, 2);
  rim.position.set(45, -30, -40);
  scene.add(key, rim);

  const frame = new MeshStandardMaterial({ color: "white", metalness: 1, roughness: 0.2 });
  const glyph = new MeshStandardMaterial({ color: accent, metalness: 0.75, roughness: 0.28 });
  const emblem = createEmblem(frame, glyph);
  const field = createField(particleCount, accent);

  // Everything that should sit on, and scale with, the anchor box.
  const rig = new Group().add(emblem.object, field.object);
  scene.add(rig);
  return { scene, rig, emblem, field };
}

type Disposable = Object3D & {
  geometry?: { dispose: () => void };
  material?: { dispose: () => void };
};

function disposeScene(scene: Scene) {
  scene.environment?.dispose();
  scene.traverse((node: Disposable) => {
    node.geometry?.dispose();
    node.material?.dispose();
  });
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/** Dragging the anchor spins the emblem; on release it coasts, then settles back facing forward. */
function createDragSpin(anchor: HTMLElement) {
  const state = { active: false, lastX: 0, speed: 0, angle: 0 };

  const start = (event: PointerEvent) => {
    state.active = true;
    state.lastX = event.clientX;
    anchor.setPointerCapture(event.pointerId);
  };
  const move = (event: PointerEvent) => {
    if (!state.active) return;
    const turned = (event.clientX - state.lastX) * DRAG_RADIANS_PER_PIXEL;
    state.lastX = event.clientX;
    state.angle += turned;
    state.speed = turned * 60;
  };
  const stop = () => {
    state.active = false;
  };

  anchor.addEventListener("pointerdown", start);
  anchor.addEventListener("pointermove", move);
  anchor.addEventListener("pointerup", stop);
  anchor.addEventListener("pointercancel", stop);

  return {
    update(delta: number) {
      if (state.active) return state.angle;
      state.angle += state.speed * delta;
      state.speed = MathUtils.damp(state.speed, 0, 2.5, delta);
      const facingForward = Math.round(state.angle / FULL_TURN) * FULL_TURN;
      state.angle = MathUtils.damp(state.angle, facingForward, 1.2, delta);
      return state.angle;
    },
    dispose() {
      anchor.removeEventListener("pointerdown", start);
      anchor.removeEventListener("pointermove", move);
      anchor.removeEventListener("pointerup", stop);
      anchor.removeEventListener("pointercancel", stop);
    },
  };
}

/**
 * Renders the hero scene into `canvas` and returns a cleanup function.
 *
 * The canvas covers the whole hero, while the emblem is placed over `anchor`, an element in
 * the page layout, so the 3D scene follows the responsive grid. The emblem turns in once, then
 * sways, leans toward the pointer, turns with scroll and can be dragged; particles circle it
 * throughout. Frames are only drawn while the canvas is on screen and the tab is visible, and
 * with reduced motion a single still frame is drawn. Throws if WebGL is unavailable.
 */
export function mountEmblem(canvas: HTMLCanvasElement, anchor: HTMLElement, onReady: () => void): () => void {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
  renderer.toneMapping = ACESFilmicToneMapping;

  const particleCount = window.innerWidth < PARTICLES.narrowBelow ? PARTICLES.narrow : PARTICLES.wide;
  const { scene, rig, emblem, field } = createScene(renderer, particleCount);
  const camera = new PerspectiveCamera(CAMERA.fov, 1, 1, 800);
  camera.position.z = CAMERA.distance;
  const viewHeight = 2 * CAMERA.distance * Math.tan(MathUtils.degToRad(CAMERA.fov) / 2);

  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointer = { x: 0, y: 0 };
  const sway = { ...RESTING_POSE };
  const dragSpin = still ? null : createDragSpin(anchor);
  let elapsed = 0;
  let lastTime = 0;
  let frameId = 0;
  let onScreen = false;

  const render = () => renderer.render(scene, camera);

  const pose = (delta: number) => {
    const intro = 1 - easeOutCubic(Math.min(elapsed / INTRO_SECONDS, 1));
    const targetY = pointer.x * 0.5 + Math.sin(elapsed * 0.5) * 0.28;
    const targetX = pointer.y * 0.22 + Math.sin(elapsed * 0.37) * 0.05;
    sway.x = MathUtils.damp(sway.x, targetX, 4, delta);
    sway.y = MathUtils.damp(sway.y, targetY, 4, delta);

    const scrolled = Math.min(window.scrollY / window.innerHeight, 1.5) * SCROLL_TURN;
    const dragged = dragSpin?.update(delta) ?? 0;
    emblem.object.rotation.set(sway.x, sway.y + intro * INTRO_TURN + dragged + scrolled, 0);
    emblem.object.scale.setScalar(1 - intro * 0.3);
    emblem.loopSpin.rotation.y = elapsed * LOOP_SPEED;
    field.lean(sway.x, sway.y);
    field.setTime(elapsed);
  };

  const tick = (time: number) => {
    const delta = Math.min((time - lastTime) / 1000, MAX_FRAME_SECONDS);
    lastTime = time;
    elapsed += delta;
    pose(delta);
    render();
    frameId = requestAnimationFrame(tick);
  };

  const syncLoop = () => {
    cancelAnimationFrame(frameId);
    if (still || !onScreen || document.hidden) return;
    lastTime = performance.now();
    frameId = requestAnimationFrame(tick);
  };

  // Maps the anchor's box in the page onto the z = 0 plane of the scene.
  const layout = () => {
    const view = canvas.getBoundingClientRect();
    const box = anchor.getBoundingClientRect();
    if (!view.width || !view.height || !box.width) return;

    renderer.setSize(view.width, view.height, false);
    camera.aspect = view.width / view.height;
    camera.updateProjectionMatrix();

    const unitsPerPixel = viewHeight / view.height;
    const scale = (box.width * unitsPerPixel) / ANCHOR_SPAN;
    rig.position.x = (box.left + box.width / 2 - (view.left + view.width / 2)) * unitsPerPixel;
    rig.position.y = (view.top + view.height / 2 - (box.top + box.height / 2)) * unitsPerPixel;
    rig.scale.setScalar(scale);
    field.setPointScale((scale * view.height * renderer.getPixelRatio()) / viewHeight * CAMERA.distance);
    render();
  };

  const trackPointer = (event: PointerEvent) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  };

  emblem.object.rotation.set(RESTING_POSE.x, RESTING_POSE.y, 0);

  const resizeObserver = new ResizeObserver(layout);
  resizeObserver.observe(canvas);
  resizeObserver.observe(anchor);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    syncLoop();
  });
  visibilityObserver.observe(canvas);
  document.addEventListener("visibilitychange", syncLoop);
  if (!still) window.addEventListener("pointermove", trackPointer, { passive: true });

  layout();
  onReady();

  return () => {
    cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    document.removeEventListener("visibilitychange", syncLoop);
    window.removeEventListener("pointermove", trackPointer);
    dragSpin?.dispose();
    disposeScene(scene);
    renderer.dispose();
  };
}
