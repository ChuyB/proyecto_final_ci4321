import * as THREE from "three";
import Sphere from "./primitives/Sphere";

export class Moon extends Sphere {
  constructor() {
    const dir = "src/assets/moon/";

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setPath(dir);
    const map = textureLoader.load("moon.jpg");
    const normalMap = textureLoader.load("normal.jpg");

    const material = new THREE.MeshPhongMaterial({
      map,
      normalMap,
    });

    super({
      radius: 50,
      material,
    });

    this.figure.rotation.x = Math.PI / 2;
  }

  update(deltaTime: number) {
    const rotationSpeed = 0.1;
    this.figure.rotation.z += deltaTime * rotationSpeed;
  }
}
