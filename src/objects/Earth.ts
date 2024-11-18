import * as THREE from "three";
import Sphere from "./primitives/Sphere";

export class Earth extends Sphere {
  clouds: Sphere;

  constructor() {
    const dir = "src/assets/earth/";

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setPath(dir);
    const map = textureLoader.load("earth.jpg");
    const normalMap = textureLoader.load("normal.tif");
    const specularMap = textureLoader.load("specular.tif");

    const material = new THREE.MeshPhongMaterial({
      map,
      normalMap,
      specularMap,
    });

    super({
      radius: 150,
      sectorCount: 64,
      stackCount: 32,
      material,
    });

    // Añade las nubes
    this.clouds = new Sphere({
      radius: 152,
      sectorCount: 64,
      stackCount: 32,
      material: new THREE.MeshPhongMaterial({
        alphaMap: textureLoader.load("clouds.jpg"),
        transparent: true,
      })
    })
    this.figure.add(this.clouds.figure);

    this.figure.rotation.x = Math.PI / 2;
  }

  update(deltaTime: number) {
    const rotationSpeed = 0.05;
    this.figure.rotation.z += deltaTime * rotationSpeed;
    this.clouds.figure.rotation.z += deltaTime * rotationSpeed;
  }
}
