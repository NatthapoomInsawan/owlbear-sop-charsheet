import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

// A simple utility to generate a canvas texture with a number
function createDiceTexture(number) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 256, 256);

    // Border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, 246, 246);

    // Number
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 120px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number.toString(), 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.MeshStandardMaterial({ map: texture, roughness: 0.2, metalness: 0.1 });
}

// Generate materials for faces 1-6
const diceMaterials = [
    createDiceTexture(1), // right
    createDiceTexture(6), // left
    createDiceTexture(2), // top
    createDiceTexture(5), // bottom
    createDiceTexture(3), // front
    createDiceTexture(4), // back
];

// Mapping materials specific to standard D6 
// In BoxGeometry, faces are corresponding directly: +x, -x, +y, -y, +z, -z
// So: x:1 vs -x:6, y:2 vs -y:5, z:3 vs -z:4
const FACE_NORMALS = [
    { number: 1, normal: new THREE.Vector3(1, 0, 0) },
    { number: 6, normal: new THREE.Vector3(-1, 0, 0) },
    { number: 2, normal: new THREE.Vector3(0, 1, 0) },
    { number: 5, normal: new THREE.Vector3(0, -1, 0) },
    { number: 3, normal: new THREE.Vector3(0, 0, 1) },
    { number: 4, normal: new THREE.Vector3(0, 0, -1) },
];

export class DiceModel {
    constructor(scene, world, size = 1.0) {
        this.size = size;

        // --- Visuals (Three.js) ---
        const geometry = new THREE.BoxGeometry(size, size, size);
        this.mesh = new THREE.Mesh(geometry, diceMaterials);
        // Start high up to drop
        this.mesh.position.set(0, 10, 0);
        scene.add(this.mesh);

        // --- Physics (Rapier3D) ---
        // Rapier extents are half-extents, so size / 2.
        let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0.0, 10.0, 0.0);
        this.body = world.createRigidBody(rigidBodyDesc);

        let colliderDesc = RAPIER.ColliderDesc.cuboid(size / 2, size / 2, size / 2)
            .setRestitution(0.1)   // Reduced Bounciness
            .setFriction(0.6);     // Friction
        
        this.collider = world.createCollider(colliderDesc, this.body);

        this.hasStopped = false;
    }

    throw() {
        this.hasStopped = false;
        // Start further apart since walls will catch them
        const startX = (Math.random() - 0.5) * 6; 
        const startY = 8 + Math.random() * 3;
        const startZ = (Math.random() - 0.5) * 6;
        
        this.body.setTranslation({ x: startX, y: startY, z: startZ }, true);
        
        // Lower torque for less spinning
        const tau = Math.PI * 2;
        const spinX = (Math.random() - 0.5) * tau * 5; // Reduced from 20 to 5
        const spinY = (Math.random() - 0.5) * tau * 5;
        const spinZ = (Math.random() - 0.5) * tau * 5;

        // Stronger outward impulses so they hit walls and bounce back
        const impulseX = (Math.random() - 0.5) * 15; 
        const impulseZ = (Math.random() - 0.5) * 15;
        const impulseY = (Math.random() - 0.5) * 2 - 2; // push down somewhat

        this.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
        this.body.setAngvel({ x: 0, y: 0, z: 0 }, true);

        this.body.applyImpulse({ x: impulseX, y: impulseY, z: impulseZ }, true);
        this.body.applyTorqueImpulse({ x: spinX, y: spinY, z: spinZ }, true);
    }

    update() {
        if (!this.body || !this.mesh) return;

        // Sync visual mesh with physics simulation
        const position = this.body.translation();
        this.mesh.position.set(position.x, position.y, position.z);

        const rotation = this.body.rotation();
        this.mesh.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
    }

    isAsleep() {
         // Using magnitude of velocity as sleeping threshold
         const linvel = this.body.linvel();
         const angvel = this.body.angvel();

         const moveSpeedSq = linvel.x*linvel.x + linvel.y*linvel.y + linvel.z*linvel.z;
         const rotSpeedSq = angvel.x*angvel.x + angvel.y*angvel.y + angvel.z*angvel.z;
         
         const threshold = 0.01;
         
         if (moveSpeedSq < threshold && rotSpeedSq < threshold && this.body.translation().y < 1.5) {
             // To ensure it's not mid-air pausing
             return true;
         }
         return false;
    }

    getTopFace() {
        const rotation = new THREE.Quaternion().copy(this.mesh.quaternion);
        const upVector = new THREE.Vector3(0, 1, 0);
        let bestFace = 1;
        let maxDot = -Infinity;

        for (const face of FACE_NORMALS) {
             // Clone the normal, rotate it by the dice's current rotation
             const worldNormal = face.normal.clone().applyQuaternion(rotation);
             // See how closely it aligns with the (0,1,0) Up vector
             const dot = worldNormal.dot(upVector);

             if (dot > maxDot) {
                 maxDot = dot;
                 bestFace = face.number;
             }
        }
        return bestFace;
    }

    destroy(scene, world) {
        scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        // Since we share material we don't dispose them here directly
        world.removeCollider(this.collider);
        world.removeRigidBody(this.body);
    }
}
