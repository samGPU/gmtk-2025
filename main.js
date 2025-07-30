import './style.css';
import Interaction from './src/Interaction'
import Renderer from './src/Renderer'
import * as THREE from 'three'

const SCORE = {
  value: 0
}

const renderer = new Renderer()
const interaction = new Interaction(SCORE, renderer)
const clock = new THREE.Clock(false)

function gameLoop() {
  const deltaTime = clock.getDelta();
  renderer.render(deltaTime);

  requestAnimationFrame(gameLoop);
}

document.addEventListener('DOMContentLoaded', () => {
  clock.start();
  gameLoop();
});
