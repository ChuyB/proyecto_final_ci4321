import { OrbitControls } from "three/examples/jsm/Addons.js";
import "./style.css";
import * as THREE from "three";
import Scene from "./utils/Scene";
import { checkObjectsCollision } from "./utils/collisions";
import SpeedBar from "./objects/SpeedBar";

const init = () => {
  const clock = new THREE.Clock();

  // Se crea la escena
  const scene = new Scene();
  scene.background = new THREE.Color(0x000000);

  // Se crea el renderizador
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true; // Sombras
  document.body.appendChild(renderer.domElement);

  const camera = scene.camera;

  const uiScene = new THREE.Scene();

  const cameraOrtho = new THREE.OrthographicCamera(
    window.innerWidth / -2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    window.innerHeight / -2,
    1,
    1000
  );
  cameraOrtho.position.z = 10; // Asegúrate de que la cámara ortográfica esté posicionada correctamente

  const speedBar = new SpeedBar(uiScene);

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

    cameraOrtho.left = window.innerWidth / -2;
    cameraOrtho.right = window.innerWidth / 2;
    cameraOrtho.top = window.innerHeight / 2;
    cameraOrtho.bottom = window.innerHeight / -2;
    cameraOrtho.updateProjectionMatrix();
  });

  // Inicio del loop de la animación
  const animate = () => {
    const deltaTime = clock.getDelta();
    controls.update(); // Actualiza los controles de órbita
    scene.updateObjects(deltaTime); // Actualiza los objetos de la escena
    checkObjectsCollision(scene); // Comprueba las colisiones entre los proyectiles y las dianas

    // Mantener la SpeedBar en la misma posición relativa a la cámara ortográfica
    speedBar.setPosition(
      -window.innerWidth / 2 + 80,
      0,
      0
    );
    speedBar.update();

    renderer.autoClear = false;
    renderer.clear();
    renderer.render(scene, camera);
    renderer.clearDepth();
    renderer.render(uiScene, cameraOrtho);
  };
  renderer.setAnimationLoop(animate);
};

init();