import * as THREE from 'three';

export default class Floor {
    constructor(scene) {
        this.scene = scene;
        this.mesh = this.createMesh();
        this.scene.add(this.mesh);
    }

    createMesh() {
        const geometry = new THREE.PlaneGeometry(100, 100);
        const material = new THREE.MeshStandardMaterial({
            color: 0xA1A1FF,
            metalness: 0.9,
            roughness: 0.1
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2; // Rotate to make it horizontal
        mesh.receiveShadow = true; // Allow shadows to be cast on the floor
        return mesh;
    }
}
