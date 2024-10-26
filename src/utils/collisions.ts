import * as THREE from "three";
import Cube from "../objects/primitives/Cube";
import Primitive from "../objects/primitives/Primitive";
import Sphere from "../objects/primitives/Sphere";
import Projectile from "../objects/Projectile";
import Target from "../objects/Target";
import Scene from "./Scene";
import Box from "../objects/Box";

const checkObjectsCollision = (scene: Scene) => {
  for (let i = 0; i < scene.objects.length; i++) {
    const obj1 = scene.objects[i]; // Proyectil

    if (!(obj1 instanceof Projectile)) continue; // Solo chequea colisiones con proyectiles

    for (let j = 0; j < scene.objects.length; j++) {
      const obj2 = scene.objects[j]; // Diana

      // Solo chequea colisiones con dianas y cajas
      if (!(obj2 instanceof Target) && !(obj2 instanceof Box)) continue;

      if (checkCollision(obj1, obj2)) {
        // Elimina los objetos de la escena
        scene.removeObjectFromScene(obj1); // Elimina el proyectil
        scene.removeObjectFromScene(obj2); // Elimina la diana o caja
      }
    }
  }
};

// Revisa si dos objetos colisionan
const checkCollision = (obj1: Primitive, obj2: Primitive): boolean => {
  if (!obj1.collider || !obj2.collider) return false;

  // Revisa las colisiones entre esferas y cubos
  if (obj1.collider instanceof Sphere && obj2.collider instanceof Cube)
    return checkSphereCubeCollision(obj1.collider, obj2.collider);
  if (obj1.collider instanceof Cube && obj2.collider instanceof Sphere)
    return checkSphereCubeCollision(obj2.collider, obj1.collider);

  return false;
};

// Revisa las colisiones entre una esfera y un cubo
const checkSphereCubeCollision = (sphere: Sphere, cube: Cube): boolean => {
  const cubeSize = cube.getDimensions();
  const sphereSize = sphere.getDimensions();
  let spherePosition = new THREE.Vector3();
  let cubePosition = new THREE.Vector3();
  sphere.figure.getWorldPosition(spherePosition);
  cube.figure.getWorldPosition(cubePosition);

  const sphereXDistance = Math.abs(spherePosition.x - cubePosition.x);
  const sphereYDistance = Math.abs(spherePosition.y - cubePosition.y);
  const sphereZDistance = Math.abs(spherePosition.z - cubePosition.z);

  if (sphereXDistance >= cubeSize.depth + sphereSize.depth) return false;
  if (sphereYDistance >= cubeSize.height + sphereSize.height) return false;
  if (sphereZDistance >= cubeSize.width + sphereSize.width) return false;

  if (sphereXDistance < cubeSize.depth) return true;
  if (sphereYDistance < cubeSize.height) return true;
  if (sphereZDistance < cubeSize.width) return true;

  const cornerDistance =
    Math.pow(sphereXDistance - cubeSize.depth, 2) +
    Math.pow(sphereYDistance - cubeSize.height, 2) +
    Math.pow(sphereZDistance - cubeSize.width, 2);

  return cornerDistance < Math.pow(sphereSize.width, 2);
};

export { checkObjectsCollision };
