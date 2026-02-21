import { Camera, PerspectiveCamera, OrthographicCamera, WebGLRenderer, Scene, Vector3 } from 'three';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export interface AnimateSceneParams {
  renderer: WebGLRenderer;
  scene: Scene;
  cameraRef: React.MutableRefObject<Camera>;
  perspectiveCameraRef: React.MutableRefObject<PerspectiveCamera | null>;
  orthoCameraRef: React.MutableRefObject<OrthographicCamera | null>;
  targetPos: React.MutableRefObject<Vector3>;
  switchToOrtho: React.MutableRefObject<boolean>;
  isAnimating: React.MutableRefObject<boolean>;
  cubes: any[];
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  controls: OrbitControls,
  controlsRef: any,
  space: string,
}

export const animateScene = (params: AnimateSceneParams): void => {
    
  const { renderer, scene, cameraRef, perspectiveCameraRef, orthoCameraRef, targetPos, switchToOrtho, isAnimating, cubes, bounds } = params;

  const getCamera = (): Camera => cameraRef.current;

  const animate = () => {
    requestAnimationFrame(animate);

    params.controls.update(); 

    if (isAnimating.current) {
    const camera = perspectiveCameraRef.current!;
    camera.position.lerp(targetPos.current, 0.15);
    camera.lookAt(0, 0, 0);

    if (camera.position.distanceTo(targetPos.current) < 1) {
        isAnimating.current = false;

        if (switchToOrtho.current) {
            if (orthoCameraRef.current) cameraRef.current = orthoCameraRef.current;
            params.controlsRef.current!.object = cameraRef.current;
            params.controlsRef.current!.enabled = false;
            params.controlsRef.current!.update();
        } else {
            if (perspectiveCameraRef.current) cameraRef.current = perspectiveCameraRef.current;
            params.controlsRef.current!.object = cameraRef.current;
            params.controlsRef.current!.enabled = true;
            params.controlsRef.current!.update();
        }
    }
}

    cubes.forEach(c => {
      c.mesh.position.add(c.velocity);
      c.velocity.multiplyScalar(0.92);
      if (c.velocity.length() < 0.01) c.velocity.set(0, 0, 0);

      c.mesh.position.x = THREE.MathUtils.clamp(c.mesh.position.x, bounds.minX, bounds.maxX);
      c.mesh.position.z = THREE.MathUtils.clamp(c.mesh.position.z, bounds.minZ, bounds.maxZ);
    });

    renderer.render(scene, getCamera());
  };

  animate();
};