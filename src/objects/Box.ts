import * as THREE from "three";
import Cube from "./primitives/Cube";

export default class Box extends Cube {
  constructor(options?: any) {
    super(options);
    this.setCollisionMesh();
  }

  protected setDefaults() {
    return {
      size: 10,
      textureSrc: "src/assets/Prototype_Textures/Dark/texture_13.png",
      phongProperties: { specular: 0x808080, shininess: 50 },
      shadow: true,
    };
  }

  private setCollisionMesh = () => {
    const cube = new Cube({
      size: this.dimensions.width,
      material: new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
      }),
    });

    this.collider = cube;
    this.figure.add(cube.figure);
  };
}
