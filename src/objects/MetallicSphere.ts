import * as THREE from "three";
import Sphere from "./primitives/Sphere";

export default class MetallicSphere extends Sphere {
  light: THREE.PointLight;
  count = 0;
  constructor() {
    super();

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setPath("src/assets/Metal_Pattern/");
    const map = textureLoader.load("color.png");
    const aoMap = textureLoader.load("ao.png");
    const normalMap = textureLoader.load("normal.png");
    const roughnessMap = textureLoader.load("roughness.png");
    const metalnessMap = textureLoader.load("metallic.png");
    const displacementMap = textureLoader.load("height.png");

    const material = new THREE.MeshStandardMaterial({
      map,
      aoMap,
      normalMap,
      roughnessMap,
      metalnessMap,
      // displacementMap,
    });

    const sphere = new THREE.SphereGeometry(10, 32, 32);
    const figure = new THREE.Mesh(sphere, material);
    this.figure = figure;

    this.light = new THREE.PointLight(0xffffff, 10, 100, 1);
  }

  update(deltaTime: number) {
    this.count += deltaTime / 4;
    this.light.position.x = Math.sin(this.count) * 30;
  }
}
