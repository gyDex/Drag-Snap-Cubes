import * as THREE from 'three';
import React from 'react';
import { Cube, SnappedRef } from '../types/main';

interface PointerDownParams {
  e: MouseEvent | TouchEvent;
  selectedCubeRef: React.MutableRefObject<any>;
  mountRef: React.RefObject<HTMLDivElement>;
  cubes: Cube[];
  colorCube: string;
  snappedRef: React.MutableRefObject<SnappedRef | null>;
  getCamera: () => THREE.Camera;
  mouse: THREE.Vector2;
  isDraggingRef: React.MutableRefObject<any>;
  setSelectedCube: (value: any) => void,
}

export const handlePointerDown = ({
  e,
  selectedCubeRef,
  mountRef,
  cubes,
  colorCube,
  snappedRef,
  getCamera,
  mouse,
  isDraggingRef,
  setSelectedCube
}: PointerDownParams) => {
  if (!mountRef.current) return;

  if (selectedCubeRef.current) {
    selectedCubeRef.current.mesh.material.color.set(colorCube);
  }

  mountRef.current.style.cursor = 'default';

  if ('button' in e && e.button !== 0) return;

  const rect = mountRef.current.getBoundingClientRect();

  let clientX: number;
  let clientY: number;

  if ('touches' in e) {
    if (!e.touches.length) return;
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, getCamera());

  const intersects = raycaster.intersectObjects(cubes.map(c => c.mesh));

  if (!intersects.length) {
    isDraggingRef.current = false;
    return;
  }

  const hit = cubes.find(c => c.mesh === intersects[0].object);
  if (!hit) {
    isDraggingRef.current = false;
    return;
  }

  selectedCubeRef.current = hit;
  isDraggingRef.current = true;

  setSelectedCube(hit);

  cubes.forEach(c => {
    if (c.mesh.dashedLine) c.mesh.dashedLine.visible = false;
    if (c.mesh.line) c.mesh.line.visible = true;
  });

  const mesh = hit.mesh;

  if (mesh.dashedLine) {
    mesh.dashedLine.visible = true;
    mesh.dashedLine.computeLineDistances();
  }
  if (mesh.line) mesh.line.visible = false;

  if (snappedRef.current) {
    const { a, b } = snappedRef.current;
    if (selectedCubeRef.current === b) {
      snappedRef.current = {
        a: b,
        b: a,
        offsetX: -snappedRef.current.offsetX,
        offsetZ: -snappedRef.current.offsetZ,
      };
    }
  }

  mountRef.current.style.cursor = 'grabbing';
};