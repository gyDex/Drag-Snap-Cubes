import * as THREE from 'three';

export type Cube = {
  mesh: THREE.Mesh & { velocity: THREE.Vector3; line?: THREE.LineSegments; dashedLine?: THREE.LineSegments };
  velocity: THREE.Vector3;
};

export type SnappedRef = {
  a: Cube;
  b: Cube;
  offsetX: number;
  offsetZ: number;
} | null;