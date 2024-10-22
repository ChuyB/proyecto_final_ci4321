import * as THREE from "three";
import Box from "./box";
import Target from "./target";

/**
 * Añade cajas a la escena
 */
const addBoxes = (scene: THREE.Scene) => {
  const box0 = new Box(scene, 10);
  box0.figure.position.set(0, 10, 0);
  const box1 = new Box(
    scene,
    12,
    "src/assets/Prototype_Textures/Purple/texture_01.png",
    { specular: 0x808080, shininess: 50 },
  );
  box1.figure.position.set(50, 12, 5);
  const box2 = new Box(
    scene,
    5,
    "src/assets/Prototype_Textures/Red/texture_05.png",
    { specular: 0x808080, shininess: 50 },
  );
  box2.figure.position.set(20, 5, 30);
};

/**
 * Añade dianas a la escena
 */
const addTargets = (scene: THREE.Scene) => {
  const target0 = new Target(scene);
  target0.figure.position.set(-50, 15, 30);
  target0.figure.rotation.y = Math.PI / 2;

  const target1 = new Target(scene, {
    baseRadius: 10,
    topRadius: 10,
    textureSrc: "src/assets/Prototype_Textures/Orange/texture_06.png",
  });
  target1.figure.position.set(-45, 10, 75);
  target1.figure.rotation.y = Math.PI / 1.5;
};

const addObjectsToScene = (scene: THREE.Scene) => {
  addBoxes(scene);
  addTargets(scene);
};

export default addObjectsToScene;
