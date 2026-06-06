import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

export let scene, camera, renderer, boxMesh;

export function initNavViewer(containerId) {
    const container = document.getElementById(containerId);

    // Make Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Make Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 0, -1);

    // Make Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    //Add a box
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshNormalMaterial();
    boxMesh = new THREE.Mesh(geometry, material);
    boxMesh.position.y = 1;
    scene.add(boxMesh);

    // Add grid helper
    scene.add(new THREE.GridHelper(20, 20));

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
}

export function renderNavViewer(dataStore) {
    boxMesh.position.x = dataStore.position.x;
    boxMesh.position.z = dataStore.position.z;

    boxMesh.rotation.y = dataStore.getHeadingRadians();

    renderer.render(scene, camera);
}