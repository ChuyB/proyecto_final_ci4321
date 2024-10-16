import * as THREE from "three";
import { Scene } from "three";

export default class Box {
  public figure: THREE.Mesh;
  constructor(scene: Scene, size = 10) {
    const cube = this.createBox(scene, size);
    this.figure = cube;
  }

  private createBox(scene: Scene, size: number) {
    const geometry = new THREE.BufferGeometry();
    const vertexArray = [
      -1.0,-1.0,-1.0,
      -1.0,-1.0, 1.0,
      -1.0, 1.0, 1.0,
      1.0, 1.0,-1.0,
      -1.0,-1.0,-1.0,
      -1.0, 1.0,-1.0,
      1.0,-1.0, 1.0,
      -1.0,-1.0,-1.0,
      1.0,-1.0,-1.0,
      1.0, 1.0,-1.0,
      1.0,-1.0,-1.0,
      -1.0,-1.0,-1.0,
      -1.0,-1.0,-1.0,
      -1.0, 1.0, 1.0,
      -1.0, 1.0,-1.0,
      1.0,-1.0, 1.0,
      -1.0,-1.0, 1.0,
      -1.0,-1.0,-1.0,
      -1.0, 1.0, 1.0,
      -1.0,-1.0, 1.0,
      1.0,-1.0, 1.0,
      1.0, 1.0, 1.0,
      1.0,-1.0,-1.0,
      1.0, 1.0,-1.0,
      1.0,-1.0,-1.0,
      1.0, 1.0, 1.0,
      1.0,-1.0, 1.0,
      1.0, 1.0, 1.0,
      1.0, 1.0,-1.0,
      -1.0, 1.0,-1.0,
      1.0, 1.0, 1.0,
      -1.0, 1.0,-1.0,
      -1.0, 1.0, 1.0,
      1.0, 1.0, 1.0,
      -1.0, 1.0, 1.0,
      1.0,-1.0, 1.0
    ];
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertexArray.map(x => x * size), 3),
    );
    geometry.computeVertexNormals();
    // const material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, specular: 0xFF6865, shininess: 30 });
    const material = new THREE.MeshStandardMaterial({ color: 0x049EF4, roughness: 0.9, metalness: 0.8 });

    const cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    scene.add(cube);
    return cube;
  }
}
