import { OrbitControls } from "three/examples/jsm/Addons.js";
import "./style.css";
import * as THREE from "three";
import Scene from "./utils/Scene";
import { checkObjectsCollision } from "./utils/collisions";

const init = () => {
  const clock = new THREE.Clock();

  // Se crea la escena
  const scene = new Scene();
  scene.background = new THREE.Color(0x87ceeb);

  // Se crea el renderizador
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true; // Sombras
  document.body.appendChild(renderer.domElement);

  // Se crea la cámara
  const camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    5000,
  );
  camera.position.set(100, 50, 0); // Posición inical de la cámara

  // Controles generales
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.maxPolarAngle = Math.PI / 2;
  controls.keyPanSpeed = 30;
  // WASD
  // controls.listenToKeyEvents(window);
  // controls.keys = {
  //   LEFT: "KeyA",
  //   UP: "KeyW",
  //   RIGHT: "KeyD",
  //   BOTTOM: "KeyS",
  // };

  // Se añade un listener para el evento de resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  // Inicio del loop de la animación
  const animate = () => {
    const deltaTime = clock.getDelta();
    controls.update();
    scene.updateObjects(deltaTime); // Actualiza los objetos de la escena
    checkObjectsCollision(scene); // Comprueba las colisiones entre los proyectiles y las dianas
    renderer.render(scene, camera);
  };
  renderer.setAnimationLoop(animate);
};

init();
