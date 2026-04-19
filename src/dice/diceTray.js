import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { DiceModel } from './diceModel.js';

import OBR from '@owlbear-rodeo/sdk';

let scene, camera, renderer;
let world;
let diceList = [];
let animationFrameId = null;

// Wait for WASM to initialize
let initPromise = RAPIER.init();

const OBRinitPromise = new Promise((resolve)=>{
    OBR.onReady(async ()=>{
        const container = document.getElementById('dice-canvas-container');
        if (!container) return;

        // Setup Three.js
        scene = new THREE.Scene();
        
        // Canvas size
        const width = await OBR.viewport.getWidth();
        const height = await OBR.viewport.getHeight();

        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        // Position camera closer since canvas is smaller
        camera.position.set(0, 18, 0);
        camera.lookAt(0, 0, 0);

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // To allow transparent background so the character sheet is visible
        renderer.setClearColor(0x000000, 0); 
        container.appendChild(renderer.domElement);

        // Setup lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 30, -10);
        directionalLight.castShadow = true;

        //Shadow Distance
        const d = 10; 
        directionalLight.shadow.camera.left = -d;
        directionalLight.shadow.camera.right = d;
        directionalLight.shadow.camera.top = d;
        directionalLight.shadow.camera.bottom = -d;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 50;

        //shadow Resolution
        directionalLight.shadow.mapSize.width = 1024/2;
        directionalLight.shadow.mapSize.height = 1024/2;

        scene.add(directionalLight);

        // Setup Rapier Physics
        const gravity = { x: 0.0, y: -9.81 * 3, z: 0.0 }; // Slightly higher gravity feels better for dice
        world = new RAPIER.World(gravity);

        //Create Floor
        const floorGeometry = new THREE.PlaneGeometry(100, 100);
        const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.5}); 
        const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);

        floorMesh.receiveShadow = true;
        floorMesh.rotation.x = -Math.PI / 2;
        
        scene.add(floorMesh);

        // Create Floor Collider
        let groundColliderDesc = RAPIER.ColliderDesc.cuboid(50.0, 0.1, 50.0);
        world.createCollider(groundColliderDesc);

        // Create Invisible Walls for dice tray feel
        const aspectRatio = width / height;

        const baseViewSize = 5.5; 

        const boundsX = baseViewSize * aspectRatio;
        const boundsZ = baseViewSize;

        const wallThickness = 1.0;
        const wallHeight = 10.0;

        // Left/Right walls
        world.createCollider(RAPIER.ColliderDesc.cuboid(wallThickness, wallHeight, boundsZ + wallThickness)
            .setTranslation(-boundsX, wallHeight, 0).setRestitution(0.4));

        world.createCollider(RAPIER.ColliderDesc.cuboid(wallThickness, wallHeight, boundsZ + wallThickness)
            .setTranslation(boundsX, wallHeight, 0).setRestitution(0.4));

        // Top/Bottom walls
        world.createCollider(RAPIER.ColliderDesc.cuboid(boundsX + wallThickness, wallHeight, wallThickness)
            .setTranslation(0, wallHeight, -boundsZ).setRestitution(0.4));

        world.createCollider(RAPIER.ColliderDesc.cuboid(boundsX + wallThickness, wallHeight, wallThickness)
            .setTranslation(0, wallHeight, boundsZ).setRestitution(0.4));

        // Handle resizing
        window.addEventListener('resize', onWindowResize, false);

        // Start loop
        startRenderLoop();
        resolve();
    });
});

export async function initDiceTray() {
    await initPromise;
    await OBRinitPromise;
}

function onWindowResize() {
    // Canvas is fixed size now, no need to resize Three.js
}

function startRenderLoop() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    const _loop = () => {
        animationFrameId = requestAnimationFrame(_loop);
        
        if (world) {
            world.step();
        }

        // Update visual meshes from physics state
        for (const dice of diceList) {
            dice.update();
        }

        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    };
    _loop();
}

export function addDiceToTray() {
    if (!world || !scene) {
        console.warn("Dice tray not fully initialized yet.");
        return null;
    }
    const dice = new DiceModel(scene, world);
    diceList.push(dice);
    return dice;
}

export function clearDice() {
    for (const dice of diceList) {
        dice.destroy(scene, world);
    }
    diceList = [];
}
