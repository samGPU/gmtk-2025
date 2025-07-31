import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import Floor from './Floor';
import Player from './Player';

export default class Renderer {
    constructor() {
        this.canvas = document.querySelector('#webgl');

        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(60, this.sizes.width / this.sizes.height, 1, 100);
        this.camera.position.z = 8;
        this.camera.position.y = 7;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x6495ED, 1);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;

        window.addEventListener('resize', this.onWindowResize.bind(this), false);

        this.floor = new Floor(this.scene);
        this.scene.add(this.floor.mesh);

        this.addLights();
        this.loadEnvironment();

        this.player = new Player(this.scene);
    }

    addLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // Reduced ambient light
        this.scene.add(ambientLight);
    
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Reduced intensity
        directionalLight.position.set(0, 5, 0);
        directionalLight.target.position.set(0, 0, 0);
        directionalLight.castShadow = true;
    
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;

        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 50;
    
        this.scene.add(directionalLight);
    }

    loadEnvironment() {
        const rgbeLoader = new RGBELoader();
        rgbeLoader.load('/1k.hdr', (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.environment = texture;
            this.scene.background = texture;
            
            // Update floor material to use environment map for reflections
            if (this.floor && this.floor.mesh) {
                this.floor.mesh.material.envMap = texture;
                this.floor.mesh.material.needsUpdate = true;
            }
        });
    }

    onWindowResize() {
        this.sizes.width = window.innerWidth;
        this.sizes.height = window.innerHeight;
        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.sizes.width, this.sizes.height);
    }

    render(deltaTime) {
        this.player.update(deltaTime);
        this.renderer.render(this.scene, this.camera);
    }

}
