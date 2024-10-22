import { OrbitControls } from "three/examples/jsm/Addons.js";
import "./style.css";
import * as THREE from "three";
import Tank from "./objects/tank/tank";
import { addObjectsToScene, addSkybox } from "./sceneObjects";

const init = () => {
  // Se crea la escena
  const scene = new THREE.Scene();
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
    1300,
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

  // Se añade el suelo de la escena
  const groundGeometry = new THREE.PlaneGeometry(1600, 1600);
  const groundMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(
      "src/assets/Prototype_Textures/Dark/texture_05.png",
    ),
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  ground.updateMatrix();
  ground.receiveShadow = true;
  scene.add(ground);

  // Se añade el skybox
  addSkybox(scene);

  // Se añaden objetos a la escena
  addObjectsToScene(scene);

  // Se añade un tanque a la escena
  const tank = new Tank(scene);
  tank.body.position.set(0, 2, 50);

  // Iluminación
  // Luz direccional
  const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
  directionalLight.position.set(200, 200, 200);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.top += 100;
  directionalLight.shadow.camera.left -= 100;
  directionalLight.shadow.camera.bottom -= 100;
  directionalLight.shadow.camera.right += 100;
  scene.add(directionalLight);
  // Camera helper
  //scene.add(new THREE.CameraHelper(directionalLight.shadow.camera));

  // Luz ambiental
  const light = new THREE.AmbientLight(0xffffff);
  scene.add(light);

  // Se añade un listener para el evento de resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "s":
        tank.move(1);
        break;
      case "w":
        tank.move(-1);
        break;
      case "a":
        tank.rotateTurret(0.1);
        break;
      case "d":
        tank.rotateTurret(-0.1);
        break;
      case "ArrowDown":
        tank.elevateCannon(0.1);
        break;
      case "ArrowUp":
        tank.elevateCannon(-0.1);
        break;
    }
  });

  // Inicio del loop de la animación
  const animate = () => {
    controls.update();
    renderer.render(scene, camera);
  };
  renderer.setAnimationLoop(animate);
};

init();
