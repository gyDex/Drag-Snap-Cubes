import * as THREE from 'three';

export const explodeCubes = (
  snappedRef: React.MutableRefObject<{ a: any; b: any; offsetX: any; offsetZ: any } | null>,
  setSticking: (value: boolean) => void,
  space: '2D' | '3D'
) => {
  if (!snappedRef.current) return;

  const impulseStrength = 25;
  const a = snappedRef.current.a;
  const b = snappedRef.current.b;

  let dir = new THREE.Vector3().subVectors(b.mesh.position, a.mesh.position);

  if (space === '2D') {
    dir.y = 0;
  }

  dir.normalize();

  dir.x += (Math.random() - 0.5) * 0.2;
  dir.z += (Math.random() - 0.5) * 0.2;

  dir.normalize();

  a.velocity.addScaledVector(dir, -impulseStrength);
  b.velocity.addScaledVector(dir, impulseStrength);

  snappedRef.current = null;
  setSticking(false);
};