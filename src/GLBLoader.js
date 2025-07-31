import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class GLBLoader {
    constructor(url) {
        if (GLBLoader.instance) {
            return GLBLoader.instance;
        }

        this.url = url;
        this.loader = new GLTFLoader();
        this.meshes = new Map();
        this.isLoaded = false;

        if (url) {
            this.loadGLB();
        }

        GLBLoader.instance = this;
    }

    loadGLB() {
        this.loader.load(
            this.url,
            (gltf) => {
                gltf.scene.traverse((child) => {
                    if (child.isMesh && child.parent === gltf.scene) {
                        this.meshes.set(child.name, child);
                    }
                });
                this.isLoaded = true;
                const event = new Event('glbLoaded');
                document.dispatchEvent(event);
                console.log('GLB loaded successfully:', this.meshes);
            },
            (xhr) => {},
            (error) => {
                console.error('Error loading GLB:', error);
            }
        );
    }

    getMesh(name) {
        if (!this.isLoaded) {
            console.warn('GLB is not fully loaded yet.');
            return null;
        }
        return this.meshes.get(name) || null;
    }

    static getInstance(url = null) {
        if (!GLBLoader.instance) {
            GLBLoader.instance = new GLBLoader(url);
        }
        return GLBLoader.instance;
    }
}

export default GLBLoader;
