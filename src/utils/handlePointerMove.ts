import * as THREE from 'three';

interface OnPointerMoveParams {
  e: MouseEvent | TouchEvent;
  mountRef: React.RefObject<HTMLDivElement>;
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;
  selectedCubeRef: React.RefObject<any>;
  snappedRef: React.RefObject<any>;
  cubes: { mesh: any; velocity: THREE.Vector3 }[];
  isDraggingRef: React.MutableRefObject<boolean>;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  SNAP_DISTANCE: number;
  setSticking: (val: boolean) => void;
  colorCube: string;
  getCamera: () => THREE.Camera;
}

export const handlePointerMove = ({
  e,
  mountRef,
  raycaster,
  mouse,
  selectedCubeRef,
  snappedRef,
  cubes,
  isDraggingRef,
  minX,
  maxX,
  minZ,
  maxZ,
  SNAP_DISTANCE,
  setSticking,
  colorCube,
  getCamera
}: OnPointerMoveParams) => {
  if (!mountRef.current) return;

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

  raycaster.setFromCamera(mouse, getCamera());

  const intersects = raycaster.intersectObjects(cubes.map(c => c.mesh));

  if (intersects.length) {
    mountRef.current.style.cursor = isDraggingRef.current ? 'grabbing' : 'pointer';
  } else {
    mountRef.current.style.cursor = 'default';
  }

  if (!isDraggingRef.current || !selectedCubeRef.current) return;

  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const intersect = new THREE.Vector3();
  raycaster.ray.intersectPlane(plane, intersect);

  if (intersect) {
    let newX = THREE.MathUtils.clamp(intersect.x, minX, maxX);
    let newZ = THREE.MathUtils.clamp(intersect.z, minZ, maxZ);

    if (snappedRef.current) {
      const other =
        snappedRef.current.a === selectedCubeRef.current
          ? snappedRef.current.b
          : snappedRef.current.a;

      const offsetX = other.mesh.position.x - selectedCubeRef.current.mesh.position.x;
      const offsetZ = other.mesh.position.z - selectedCubeRef.current.mesh.position.z;

      const minGroupX = Math.max(minX, minX - offsetX);
      const maxGroupX = Math.min(maxX, maxX - offsetX);
      const minGroupZ = Math.max(minZ, minZ - offsetZ);
      const maxGroupZ = Math.min(maxZ, maxZ - offsetZ);

      newX = THREE.MathUtils.clamp(newX, minGroupX, maxGroupX);
      newZ = THREE.MathUtils.clamp(newZ, minGroupZ, maxGroupZ);
    }

    selectedCubeRef.current.mesh.position.x = newX;
    selectedCubeRef.current.mesh.position.z = newZ;

    if (snappedRef.current) {
      const other =
        snappedRef.current.a === selectedCubeRef.current
          ? snappedRef.current.b
          : snappedRef.current.a;

      other.mesh.position.x =
        selectedCubeRef.current.mesh.position.x - snappedRef.current.offsetX;
      other.mesh.position.z =
        selectedCubeRef.current.mesh.position.z - snappedRef.current.offsetZ;
    }
  }

  const otherCube = cubes.find(c => c !== selectedCubeRef.current)!;

  const dx = selectedCubeRef.current.mesh.position.x - otherCube.mesh.position.x;
  const dz = selectedCubeRef.current.mesh.position.z - otherCube.mesh.position.z;

  const distance = Math.sqrt(dx * dx + dz * dz);

  if (distance < SNAP_DISTANCE) {
    const a = selectedCubeRef.current;
    const b = otherCube;

    if (Math.abs(dx) > Math.abs(dz)) {
      snappedRef.current = {
        a,
        b,
        offsetX: dx > 0 ? SNAP_DISTANCE : -SNAP_DISTANCE,
        offsetZ: dz
      };
      setSticking(true);
    } else if (Math.abs(dz) > Math.abs(dx)) {
      snappedRef.current = {
        a,
        b,
        offsetX: dx,
        offsetZ: dz > 0 ? SNAP_DISTANCE : -SNAP_DISTANCE
      };
      setSticking(true);
    } else {
      snappedRef.current = null;
      setSticking(false);
    }
  }

  if (snappedRef.current) {
    const other =
      snappedRef.current.a === selectedCubeRef.current
        ? snappedRef.current.b
        : snappedRef.current.a;

    if (Math.abs(dx) > Math.abs(dz)) {
      other.mesh.position.x = selectedCubeRef.current.mesh.position.x - snappedRef.current.offsetX;
    } else if (Math.abs(dz) > Math.abs(dx)) {
      other.mesh.position.z = selectedCubeRef.current.mesh.position.z - snappedRef.current.offsetZ;
    }
  }

  if (selectedCubeRef.current) {
    selectedCubeRef.current.mesh.material.color.set(colorCube);
  }
};