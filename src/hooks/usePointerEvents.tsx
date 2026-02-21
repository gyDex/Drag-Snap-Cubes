import * as THREE from 'three';

export function usePointerEvents(mountRef: any, cubes: any[], cameraRef: any, selectedCubeRef: any, snappedRef: any, setSticking: any, colorCube: string) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;

    const onPointerDown = (e: any) => { /* ваша логика pointerDown */ };
    const onPointerMove = (e: any) => { /* ваша логика pointerMove */ };
    const onPointerUp = (e: any) => { /* ваша логика pointerUp */ };

    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchstart', onPointerDown, { passive: false });
    window.addEventListener('touchmove', onPointerMove, { passive: false });
    window.addEventListener('touchend', onPointerUp);

    return () => {
        window.removeEventListener('mousedown', onPointerDown);
        window.removeEventListener('mousemove', onPointerMove);
        window.removeEventListener('mouseup', onPointerUp);
        window.removeEventListener('touchstart', onPointerDown);
        window.removeEventListener('touchmove', onPointerMove);
        window.removeEventListener('touchend', onPointerUp);
    };
}