import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useCubeActions } from './providers/CubeActionsContext';
import { useCubeColor } from './providers/CubeColorContext';
import { useCamera } from './providers/CameraContext';
import { explodeCubes } from './utils/explodeCubes';
import { animateScene, AnimateSceneParams } from './utils/animateScene';
import { handlePointerDown } from './utils/handlePointerDown';
import { handlePointerMove } from './utils/handlePointerMove';
import { createScene } from './utils/createScene';
import { BOUNDS, CUBE_SIZE, PLATFORM_SIZE, SNAP_DISTANCE } from './data/SceneConstants';

interface SceneProps {
  explodeRef: any;
}

export const Scene: React.FC<SceneProps> = ({ explodeRef }) => {
    const mountRef = useRef<any>(null);
    const isDraggingRef = useRef(false);

    const snappedRef = useRef<{ a: any; b: any, offsetX: any, offsetZ: any } | null>(null);

    const { setSticking } = useCubeActions();

    const { colorCube, borderCube } = useCubeColor();

    const { space } = useCamera();

    const cameraRef = useRef(null) as any;

    const selectedCubeRef = useRef<any>(null);

    const perspectiveCameraRef = useRef<any | null>(null);
    const orthoCameraRef = useRef<any | null>(null);
    const isAnimating = useRef(false);

    const targetPos = useRef(new THREE.Vector3());

    const switchToOrtho = useRef(false);
    
    useEffect(() => {
        if (selectedCubeRef.current) {
            selectedCubeRef.current.mesh.children.forEach((child: any) => {
                if (child.type === 'LineSegments') {
                    child.material.color.set(borderCube);
                }
            });

            selectedCubeRef.current.mesh.material.color.set(colorCube);
        }
    }, [colorCube]);

    useEffect(() => {
        if (!perspectiveCameraRef.current || !orthoCameraRef.current) return;

        isAnimating.current = true;

        if (space === '2D') {
            targetPos.current.set(0, 800, 0.001);
            switchToOrtho.current = true;
        } else {
            cameraRef.current = perspectiveCameraRef.current;
            targetPos.current.set(0, 600, 600);
            switchToOrtho.current = false;
        }
    }, [space]);

    useEffect(() => {
        const { scene, renderer, perspectiveCamera, orthoCamera, cubes } = createScene(
            mountRef,
            PLATFORM_SIZE,
            CUBE_SIZE,
            BOUNDS.minX,
            BOUNDS.maxX,
            BOUNDS.minZ,
            BOUNDS.maxZ
        );

        orthoCamera.position.set(0, 800, 0.001);
        orthoCamera.lookAt(0, 0, 0);

        perspectiveCameraRef.current = perspectiveCamera;
        orthoCameraRef.current = orthoCamera;

        cameraRef.current = perspectiveCamera;

        const getCamera = () => cameraRef.current as any;

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onPointerMove = (e: MouseEvent | TouchEvent) => {
            handlePointerMove({ e, mountRef, raycaster, mouse, selectedCubeRef, snappedRef, cubes, isDraggingRef, minX: BOUNDS.minX, maxX: BOUNDS.maxX, minZ: BOUNDS.minZ, maxZ: BOUNDS.maxZ, SNAP_DISTANCE:SNAP_DISTANCE, setSticking, colorCube, getCamera })
        };

        const onPointerUp = (e: any) => {
            isDraggingRef.current = false;
            if (selectedCubeRef.current) {
                const mesh = selectedCubeRef.current.mesh;
                if ((mesh as any).dashedLine) (mesh as any).dashedLine.visible = false;
                if ((mesh as any).line) (mesh as any).line.visible = true;
            }
            if (mountRef.current) mountRef.current.style.cursor = 'default';
            if (e.button !== 0) return;
        };

        explodeRef.current = () => explodeCubes(snappedRef, setSticking, space);

        const params: AnimateSceneParams = {
            renderer,
            scene,
            cameraRef,
            perspectiveCameraRef,
            orthoCameraRef,
            targetPos,
            switchToOrtho,
            isAnimating,
            cubes,
            bounds: {minX : BOUNDS.minX, maxX: BOUNDS.maxX, minZ: BOUNDS.minZ, maxZ: BOUNDS.maxZ },
        };

        animateScene(params);

        const handleMouseDown = (e: MouseEvent) =>
            handlePointerDown({
                e,
                selectedCubeRef,
                mountRef,
                cubes: cubes as any,
                colorCube,
                snappedRef,
                getCamera,
                mouse,
                isDraggingRef
        });

        const handleTouchStart = (e: TouchEvent) =>
            handlePointerDown({
                e,
                selectedCubeRef,
                mountRef,
                cubes: cubes as any,
                colorCube,
                snappedRef,
                getCamera,
                mouse,
                isDraggingRef
        });

        window.addEventListener('mousedown', handleMouseDown);

        window.addEventListener('mousemove', onPointerMove);
        window.addEventListener('mouseup', onPointerUp);

        window.addEventListener('touchstart', handleTouchStart, { passive: false });

        window.addEventListener('touchmove', onPointerMove, { passive: false });
        window.addEventListener('touchend', onPointerUp);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            
            window.removeEventListener('mousemove', onPointerMove);
            window.removeEventListener('mouseup', onPointerUp);

            window.removeEventListener('touchstart', handleTouchStart);

            window.removeEventListener('touchmove', onPointerMove);
            window.removeEventListener('touchend', onPointerUp);
            mountRef.current?.removeChild(renderer.domElement);

            cubes.forEach(cube => {
                cube.mesh.geometry.dispose();
                if (Array.isArray(cube.mesh.material)) {
                    cube.mesh.material.forEach(mat => mat.dispose());
                } else {
                    cube.mesh.material.dispose();
                }
            });
            renderer.dispose();
        };
    }, [setSticking]);

    return <div ref={mountRef}></div>;
};