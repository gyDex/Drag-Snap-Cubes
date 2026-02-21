import { Mesh, OrthographicCamera, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";
import { randomInterval } from "./randomIntFromInterval";

import * as THREE from 'three'
import { colors } from "../components/PanelColors/data/colors";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface CreateSceneResult {
    scene: Scene;
    renderer: WebGLRenderer;
    perspectiveCamera: PerspectiveCamera;
    orthoCamera: OrthographicCamera;
    cubes: { mesh: Mesh; velocity: Vector3 }[];
    controls : OrbitControls
}

export function createScene(
    mountRef: React.RefObject<HTMLDivElement>,  
    PLATFORM_SIZE: number,
    CUBE_SIZE: number,
    minX: number,
    maxX: number,
    minZ: number,
    maxZ: number,
    controlsRef: React.RefObject<any>,
    canControlCamera: React.RefObject<any>,
): CreateSceneResult {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#dee5ed');

    // Камеры
    const perspectiveCamera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );
    perspectiveCamera.position.set(0, 600, 600);
    perspectiveCamera.lookAt(0, 0, 0);

    const orthoSize = 800;
    const aspect = window.innerWidth / window.innerHeight;
    const orthoCamera = new THREE.OrthographicCamera(
        (-orthoSize * aspect) / 2,
        (orthoSize * aspect) / 2,
        orthoSize / 2,
        -orthoSize / 2,
        0.1,
        2000
    );
    orthoCamera.position.set(0, 800, 0.001);
    orthoCamera.lookAt(0, 0, 0);

    // Рендерер
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current?.appendChild(renderer.domElement);

    const controls = new OrbitControls(perspectiveCamera, renderer.domElement);
    controls.enableDamping = true; 
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;   
    controls.maxDistance = 1400; 
    controls.maxPolarAngle = Math.PI / 2;

    controlsRef.current = controls;
    controlsRef.current.enabled = canControlCamera.current;

    // Свет
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(300, 400, 200);
    scene.add(dirLight);

    // Платформа
    const platformGeometry = new THREE.BoxGeometry(PLATFORM_SIZE, 2, PLATFORM_SIZE);
    const platformMaterial = new THREE.MeshBasicMaterial({ color: '#dee5ed' });
    const groundMesh = new THREE.Mesh(platformGeometry, platformMaterial);
    groundMesh.position.y = -2;
    scene.add(groundMesh);

    const platformEdges = new THREE.EdgesGeometry(platformGeometry);
    const platformBorder = new THREE.LineSegments(
        platformEdges,
        new THREE.LineBasicMaterial({ color: '#b0b8c2' })
    );
    groundMesh.add(platformBorder);

    // Кубы
    const cubes: { mesh: THREE.Mesh; velocity: THREE.Vector3 }[] = [];
    for (let i = 0; i < 2; i++) {
        const index = randomInterval(0, 2);
        const rndColor = colors[index].color;
        const rndBorder = colors[index].borderColor;
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE),
            new THREE.MeshBasicMaterial({ color: rndColor })
        );

        const edges = new THREE.EdgesGeometry(mesh.geometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: rndBorder, linewidth: 2 }));
        mesh.add(line);
        (mesh as any).line = line;

        const dashedMaterial = new THREE.LineDashedMaterial({ color: rndBorder, dashSize: 10, gapSize: 5, linewidth: 2 });
        const dashedEdges = new THREE.EdgesGeometry(mesh.geometry);
        const dashedLine = new THREE.LineSegments(dashedEdges, dashedMaterial);
        dashedLine.computeLineDistances();
        dashedLine.visible = false;
        mesh.add(dashedLine);
        (mesh as any).dashedLine = dashedLine;

        // Генерация позиции без пересечений
        let positionValid = false;
        while (!positionValid) {
            const x = randomInterval(minX + CUBE_SIZE / 2, maxX - CUBE_SIZE / 2);
            const z = randomInterval(minZ + CUBE_SIZE / 2, maxZ - CUBE_SIZE / 2);
            mesh.position.set(x, CUBE_SIZE / 2, z);

            positionValid = true;
            for (const c of cubes) {
                const dx = mesh.position.x - c.mesh.position.x;
                const dz = mesh.position.z - c.mesh.position.z;
                if (Math.abs(dx) < CUBE_SIZE && Math.abs(dz) < CUBE_SIZE) {
                    positionValid = false;
                    break;
                }
            }
        }

        scene.add(mesh);
        cubes.push({ mesh, velocity: new THREE.Vector3(0, 0, 0) });
    }

    return { scene, renderer, perspectiveCamera, orthoCamera, cubes, controls  };
}