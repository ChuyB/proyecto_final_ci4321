import * as THREE from "three";
import Sphere from "./primitives/Sphere";

export class Sun extends Sphere {
  constructor() {
    const dir = "src/assets/sun/";

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setPath(dir);
    const map = textureLoader.load("sun.jpg");

    const material = new THREE.MeshPhongMaterial({
      emissive: 0xfdb813,
      emissiveMap: map,
      emissiveIntensity: .5,
    });

    super({
      radius: 180,
      material,
    });

    const light = new THREE.PointLight(0xfdb813, 100, 1000, 0.5);
    light.position.set(0, 0, 0);
    this.figure.add(light);

    this.figure.rotation.x = Math.PI / 2;
  }

  update(deltaTime: number) {
    const rotationSpeed = 0.05;
    this.figure.rotation.z += deltaTime * rotationSpeed;
  }
}
