import * as THREE from 'three';

export default class Floor {
    constructor(scene) {
        this.scene = scene;
        this.mesh = this.createMesh();
        this.scene.add(this.mesh);
    }

    createMesh() {
        const geometry = new THREE.PlaneGeometry(70, 70, 50, 50);
        const material = new THREE.MeshStandardMaterial({
            color: 0x333366, // Darker blue-grey for water
            metalness: 0.0,   // Water isn't metallic
            roughness: 0.0,   // Very smooth for perfect reflections
            transparent: true,
            opacity: 0.9,     // Slightly transparent
            envMapIntensity: 1.5 // Strong environment reflections
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2; // Rotate to make it horizontal
        // mesh.receiveShadow = true; // Allow shadows to be cast on the floor
        return mesh;
    }
}
