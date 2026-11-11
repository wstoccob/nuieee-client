import {
  CatmullRomCurve3,
  ConeGeometry,
  CylinderGeometry,
  ExtrudeGeometry,
  Group,
  Mesh,
  Path,
  Shape,
  SphereGeometry,
  TubeGeometry,
  Vector3,
  type Material,
} from "three";

// Proportions follow the IEEE emblem artwork, measured in its 54-unit viewBox and centred on the origin.
const FRAME_OUTER = { halfWidth: 26.3, halfHeight: 26.9 };
const FRAME_INNER = { halfWidth: 23.6, halfHeight: 24.2 };
const FRAME_DEPTH = 3.2;

const SHAFT = { top: 7.7, bottom: -17.8, topRadius: 1.35, bottomRadius: 2.2 };
const HEAD = { height: 11.7, radius: 4 };

const LOOP = {
  radius: 14,
  thickness: 1.25,
  tilt: 0.38,
  height: -1.5,
  start: (115 * Math.PI) / 180,
  span: (290 * Math.PI) / 180,
  headLength: 6.5,
  headRadius: 3.1,
};

const UP = new Vector3(0, 1, 0);

const LOOP_SAMPLES = 96;

// The field loop runs counter-clockwise seen from above: the right-hand rule for an upward current.
function createLoopArc() {
  const points = Array.from({ length: LOOP_SAMPLES + 1 }, (_, i) => {
    const angle = LOOP.start + (i / LOOP_SAMPLES) * LOOP.span;
    return new Vector3(LOOP.radius * Math.cos(angle), 0, -LOOP.radius * Math.sin(angle));
  });
  return new CatmullRomCurve3(points);
}

// The emblem's outline is a square on its corner whose sides bow outwards.
function traceKite<T extends Path>(path: T, { halfWidth: w, halfHeight: h }: typeof FRAME_OUTER): T {
  const nearTip = w * 0.175;
  const nearSide = h * 0.182;
  path.moveTo(0, h);
  path.bezierCurveTo(-nearTip, h, -w, nearSide, -w, 0);
  path.bezierCurveTo(-w, -nearSide, -nearTip, -h, 0, -h);
  path.bezierCurveTo(nearTip, -h, w, -nearSide, w, 0);
  path.bezierCurveTo(w, nearSide, nearTip, h, 0, h);
  return path;
}

function createFrame(material: Material) {
  const outline = traceKite(new Shape(), FRAME_OUTER);
  outline.holes.push(traceKite(new Path(), FRAME_INNER));
  const geometry = new ExtrudeGeometry(outline, {
    depth: FRAME_DEPTH,
    curveSegments: 32,
    bevelThickness: 0.45,
    bevelSize: 0.4,
    bevelSegments: 4,
  });
  geometry.translate(0, 0, -FRAME_DEPTH / 2);
  return new Mesh(geometry, material);
}

function createArrow(material: Material) {
  const shaftLength = SHAFT.top - SHAFT.bottom;
  const shaft = new Mesh(new CylinderGeometry(SHAFT.topRadius, SHAFT.bottomRadius, shaftLength, 40), material);
  shaft.position.y = (SHAFT.top + SHAFT.bottom) / 2;

  const head = new Mesh(new ConeGeometry(HEAD.radius, HEAD.height, 48), material);
  head.position.y = SHAFT.top + HEAD.height / 2;

  return new Group().add(shaft, head);
}

function createLoop(material: Material) {
  const arc = createLoopArc();
  const band = new Mesh(new TubeGeometry(arc, 160, LOOP.thickness, 20), material);

  const tail = new Mesh(new SphereGeometry(LOOP.thickness, 20, 12), material);
  tail.position.copy(arc.getPoint(0));

  const direction = arc.getTangent(1);
  const head = new Mesh(new ConeGeometry(LOOP.headRadius, LOOP.headLength, 40), material);
  head.position.copy(arc.getPoint(1)).addScaledVector(direction, LOOP.headLength / 2);
  head.quaternion.setFromUnitVectors(UP, direction);

  const spin = new Group().add(band, tail, head);
  const tilted = new Group().add(spin);
  tilted.rotation.x = LOOP.tilt;
  tilted.position.y = LOOP.height;
  return { object: tilted, spin };
}

export function createEmblem(frameMaterial: Material, glyphMaterial: Material) {
  const loop = createLoop(glyphMaterial);
  const object = new Group().add(createFrame(frameMaterial), createArrow(glyphMaterial), loop.object);
  return { object, loopSpin: loop.spin };
}
