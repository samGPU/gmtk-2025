import * as THREE from 'three';
import GLBLoader from './GLBLoader'

export default class Player {
    constructor(scene, floorSize = 100) {
        this.scene = scene;
        this.FLOORSIZE = floorSize;

        this.mesh = this.createMesh();
        this.mesh.castShadow = true; // Allow player to cast shadows
        this.mesh.position.set(0, 0.7, 0); // Position the player above the floor

        // Load GLB to replace the placeholder mesh
        this.glbLoader = GLBLoader.getInstance('./jet.glb');
        this.isGLBLoaded = false;
        
        // Listen for GLB loaded event
        document.addEventListener('glbLoaded', () => {
            this.replaceWithGLBMesh();
        });

        this.targetUVPos = new THREE.Vector2(0.5, 0.5);
        this.targetAbsMousePos = new THREE.Vector2(0, 0);

        this.distanceToTarget = 0;
        this.speed = new THREE.Vector2(0, 0); // Speed of movement towards the target
        this.direction = new THREE.Vector2(0, 0);
        this.jumping = false;
        this.jumpVelocity = 0;
        this.jumpHeight = 3; // Maximum jump height
        this.jumpSpeed = 8; // Jump speed
        this.gravity = 15; // Gravity strength
        this.groundY = 0.7; // Ground level Y position

        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                this.startJump(); // Trigger a jump when space is pressed
            }
        });

        this.scene.add(this.mesh);
    }

    createMesh() {
        const geometry = new THREE.ConeGeometry( 0.5, 1, 32 );
        geometry.rotateX(Math.PI / 2);
        const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        material.metalness = 0.5; // Add some metallic effect
        material.roughness = 0.5; // Adjust roughness for a shiny appearance
        return new THREE.Mesh(geometry, material);
    }

    replaceWithGLBMesh() {
        // Get the mesh from the loaded GLB
        const meshNames = Array.from(this.glbLoader.meshes.keys());
        if (meshNames.length > 0) {
            const glbMesh = this.glbLoader.getMesh(meshNames[0]); // Get first mesh
            
            if (glbMesh) {
                // Store current properties of the placeholder mesh
                const currentPosition = this.mesh.position.clone();
                const currentQuaternion = this.mesh.quaternion.clone();
                
                // Remove the placeholder mesh from the scene
                this.scene.remove(this.mesh);
                
                // Set up the GLB mesh to replace the placeholder
                this.mesh = glbMesh.clone(); // Clone to avoid affecting the original
         
                // Apply the stored properties
                this.mesh.position.copy(currentPosition);
                this.mesh.quaternion.copy(currentQuaternion);
                this.mesh.castShadow = true;
                this.mesh.receiveShadow = true;
                
                // Add the new mesh to the scene
                this.scene.add(this.mesh);
                this.isGLBLoaded = true;
                
                console.log('Jet model loaded and replaced placeholder mesh');
            }
        }
    }

    setUVPosition(hitPoint) {
        this.targetUVPos.x = hitPoint.x;
        this.targetUVPos.y = hitPoint.y;
    }

    rotate(dx, dy) {
        // Calculate the angle to point toward the target
        const angle = Math.atan2(dx, dy);
        
        // Set the rotation around the Y-axis to face the target
        // Since the cone was rotated 90 degrees on X-axis, it points along Z-axis
        // We need to rotate around Y-axis to change its heading
        this.mesh.rotation.y = angle + (Math.PI / 2);
    }

    calculateSpeed(deltaTime) {
        this.targetAbsMousePos.x = (this.targetUVPos.x - 0.5) * this.FLOORSIZE;
        this.targetAbsMousePos.y = -(this.targetUVPos.y - 0.5) * this.FLOORSIZE;

        let dx = this.targetAbsMousePos.x - this.mesh.position.x;
        let dy = this.targetAbsMousePos.y - this.mesh.position.z;

        this.distanceToTarget = Math.sqrt(dx * dx + dy * dy);
        let ax = dx * 0.5 * deltaTime;
        let ay = dy * 0.5 * deltaTime;
        this.speed.x += ax;
        this.speed.y += ay;

        this.speed.x *= Math.pow(deltaTime, 0.05);
        this.speed.y *= Math.pow(deltaTime, 0.05);
    }

    lookAtTarget(deltaTime) {
        const targetPosition = new THREE.Vector3(this.targetAbsMousePos.x, this.mesh.position.y, this.targetAbsMousePos.y);
        
        // Create a temporary object to calculate the target rotation
        const tempObject = new THREE.Object3D();
        tempObject.position.copy(this.mesh.position);
        tempObject.lookAt(targetPosition);
        
        // Interpolate between current rotation and target rotation
        const rotationSpeed = 5.0; // Adjust this value to control rotation speed
        const lerpFactor = Math.min(1.0, rotationSpeed * deltaTime);
        
        this.mesh.quaternion.slerp(tempObject.quaternion, lerpFactor);
    }

    startJump() {
        if (!this.jumping && this.mesh.position.y <= this.groundY + 0.1) {
            this.jumping = true;
            this.jumpVelocity = this.jumpSpeed;
        }
    }

    doJump(deltaTime) {
        if (!this.jumping) return;

        this.jumpVelocity -= this.gravity * deltaTime;
        
        this.mesh.position.y += this.jumpVelocity * deltaTime;

        if (this.mesh.position.y <= this.groundY) {
            this.mesh.position.y = this.groundY;
            this.jumping = false;
            this.jumpVelocity = 0;
        }
    }

    update(deltaTime) {
        this.calculateSpeed(deltaTime);

        this.mesh.position.x += this.speed.x;
        this.mesh.position.z += this.speed.y;

        this.lookAtTarget(deltaTime);
        this.doJump(deltaTime);
    }
}
