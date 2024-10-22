import * as THREE from "three";
import Box from "./objects/Box";
import Target from "./objects/Target";
import Tank from "./objects/tank/tank";

/**
 * Añade cajas a la escena
 */
const addBoxes = (scene: THREE.Scene) => {
  const box0 = new Box();
  box0.addToScene(scene);

  box0.figure.position.set(0, 10, 0);
  const box1 = new Box({
    size: 12,
    textureSrc: "src/assets/Prototype_Textures/Purple/texture_01.png",
    phongProperties: { specular: 0x808080, shininess: 50 },
  });
  box1.addToScene(scene);
  box1.figure.position.set(50, 12, 5);

  const box2 = new Box({
    size: 5,
    textureSrc: "src/assets/Prototype_Textures/Red/texture_05.png",
    phongProperties: { specular: 0x808080, shininess: 50 },
  });
  box2.addToScene(scene);
  box2.figure.position.set(20, 5, 30);
};

/**
 * Añade dianas a la escena
 */
const addTargets = (scene: THREE.Scene) => {
  const target0 = new Target();
  target0.addToScene(scene);
  target0.figure.position.set(-50, 15, 30);
  target0.figure.rotation.y = Math.PI / 2;

  const target1 = new Target({
    baseRadius: 10,
    topRadius: 10,
    textureSrc: "src/assets/Prototype_Textures/Orange/texture_06.png",
  });
  target1.addToScene(scene);
  target1.figure.position.set(-45, 10, 75);
  target1.figure.rotation.y = Math.PI / 1.5;
};

/**
 * Añade un tanque a la escena
 */
const addTank = (scene: THREE.Scene) => {
  // Se añade un tanque a la escena
  const tank = new Tank(scene);
  tank.body.position.set(0, 2, 50);

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
};

/**
 * Añade cajas y dianas a la escena
 */
const addObjectsToScene = (scene: THREE.Scene) => {
  addTank(scene);
  addBoxes(scene);
  addTargets(scene);
};

/**
 * Añade un skybox a la escena
 */
const addSkybox = (scene: THREE.Scene) => {
  const textureDir = "src/assets/Daylight Box_Pieces";
  const textures: THREE.Texture[] = [];
  const sides = ["Right", "Left", "Top", "Bottom", "Front", "Back"];
  sides.forEach((side) => {
    const texture = new THREE.TextureLoader().load(
      `${textureDir}/Daylight Box_${side}.bmp`,
    );
    textures.push(texture);
  });

  const skyboxGeometry = new THREE.BoxGeometry(1600, 1600, 1600);
  const skyboxMaterials = textures.map(
    (texture) =>
      new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide }),
  );
  const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
  scene.add(skybox);
};

export { addObjectsToScene, addSkybox };
