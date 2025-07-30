import * as THREE from 'three';

export default class Player {
    constructor(scene, floorSize = 100) {
        this.scene = scene;
        this.FLOORSIZE = floorSize;

        this.mesh = this.createMesh();
        this.mesh.castShadow = true; // Allow player to cast shadows
        this.mesh.position.set(0, 0.7, 0); // Position the player above the floor

        this.targetUVPos = new THREE.Vector2(0.5, 0.5);
        this.targetAbsMousePos = new THREE.Vector2(0, 0);

        this.distanceToTarget = 0;
        this.speed = new THREE.Vector2(0, 0); // Speed of movement towards the target

        this.scene.add(this.mesh);
    }

    createMesh() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        material.metalness = 0.5; // Add some metallic effect
        material.roughness = 0.5; // Adjust roughness for a shiny appearance
        return new THREE.Mesh(geometry, material);
    }

    setUVPosition(hitPoint) {
        this.targetUVPos.x = hitPoint.x;
        this.targetUVPos.y = hitPoint.y;
    }

    update(deltaTime) {
        this.targetAbsMousePos.x = (this.targetUVPos.x - 0.5) * this.FLOORSIZE;
        this.targetAbsMousePos.y = (this.targetUVPos.y - 0.5) * this.FLOORSIZE;

        let dx = this.targetAbsMousePos.x - this.mesh.position.x;
        let dy = this.targetAbsMousePos.y - this.mesh.position.z;

        this.distanceToTarget = Math.sqrt(dx * dx + dy * dy);
        let ax = dx * 0.5 * deltaTime;
        let ay = dy * 0.5 * deltaTime;
        this.speed.x += ax;
        this.speed.y += ay;

        this.speed.x *= Math.pow(deltaTime, 0.005);
        this.speed.y *= Math.pow(deltaTime, 0.005);

        this.mesh.position.x += this.speed.x;
        this.mesh.position.z += this.speed.y;
    }
}
