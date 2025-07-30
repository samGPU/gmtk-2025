import * as THREE from 'three';

export default class Interaction {
    constructor(SCORE, RENDERER) {
        this.SCORE = SCORE;
        this.RENDERER = RENDERER;

        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        this.mouse = new THREE.Vector2(0, 0);

        this.raycaster = new THREE.Raycaster();

        document.addEventListener('resize', this.onWindowResize.bind(this), false);
        document.addEventListener("mousemove", this.onMouseMove.bind(this), false);
        document.addEventListener("touchmove", this.onTouchMove.bind(this), false);
    }

    onWindowResize() {
        this.sizes.width = window.innerWidth;
        this.sizes.height = window.innerHeight;
    }

    onMouseMove(event) { 
        const x = event.clientX / this.sizes.width * 2 - 1;
        const y = -(event.clientY / this.sizes.height * 2 - 1);
        this.updateMouse(x,y)
    }

    onTouchMove(event) {
        const touch = event.touches[0];
        const x = touch.clientX / this.sizes.width * 2 - 1;
        const y = -(touch.clientY / this.sizes.height * 2 - 1);
        this.updateMouse(x,y)
    }

    updateMouse(x, y) {
        this.mouse.x = x;
        this.mouse.y = y;
        // console.log(`Mouse moved to: ${this.mouse.x}, ${this.mouse.y}`);
    }

    castRay(floor, camera) {
        this.raycaster.setFromCamera(this.mouse, camera);
        var intersects = this.raycaster.intersectObjects([floor]);
        if (intersects.length > 0) {
            return intersects[0].uv;
        }
    }

    getMouse() {
        return this.mouse;
    }
}
