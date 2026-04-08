import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { DiceModel } from './diceModel.js';

let scene, camera, renderer;
let world;
let diceList = [];
let animationFrameId = null;

// Wait for WASM to initialize
let initPromise = RAPIER.init();

export async function initDiceTray() {
    await initPromise;
    
    const container = document.getElementById('dice-canvas-container');
    if (!container) return;

    // Setup Three.js
    scene = new THREE.Scene();
    
    // Canvas is fixed to 500x500 in CSS
    const width = 500;
    const height = 500;

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    // Position camera closer since canvas is smaller
    camera.position.set(0, 18, 10);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // To allow transparent background so the character sheet is visible
    renderer.setClearColor(0x000000, 0); 
    container.appendChild(renderer.domElement);

    // Setup lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    // Setup Rapier Physics
    const gravity = { x: 0.0, y: -9.81 * 3, z: 0.0 }; // Slightly higher gravity feels better for dice
    world = new RAPIER.World(gravity);

    // Create Floor Collider
    let groundColliderDesc = RAPIER.ColliderDesc.cuboid(50.0, 0.1, 50.0);
    world.createCollider(groundColliderDesc);

    // Create Invisible Walls for dice tray feel
    const wallThickness = 1.0;
    const wallHeight = 10.0;
    // The camera views roughly a 10x10 area, so put walls just at the edge
    const boxSize = 5.5; 

    // Top wall (negative z)
    world.createCollider(RAPIER.ColliderDesc.cuboid(boxSize + wallThickness, wallHeight, wallThickness).setTranslation(0, wallHeight, -boxSize).setRestitution(0.4));
    
    // Bottom wall (positive z)
    world.createCollider(RAPIER.ColliderDesc.cuboid(boxSize + wallThickness, wallHeight, wallThickness).setTranslation(0, wallHeight, boxSize).setRestitution(0.4));
    
    // Left wall (negative x)
    world.createCollider(RAPIER.ColliderDesc.cuboid(wallThickness, wallHeight, boxSize + wallThickness).setTranslation(-boxSize, wallHeight, 0).setRestitution(0.4));
    
    // Right wall (positive x)
    world.createCollider(RAPIER.ColliderDesc.cuboid(wallThickness, wallHeight, boxSize + wallThickness).setTranslation(boxSize, wallHeight, 0).setRestitution(0.4));

    // Handle resizing
    window.addEventListener('resize', onWindowResize, false);

    // Start loop
    startRenderLoop();
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
