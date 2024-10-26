import { Material, Object3D } from "three";
import Cube from "./Cube";
import Sphere from "./Sphere";
import Scene from "../../utils/Scene";

export default class Primitive {
  figure: Object3D | undefined;
  scene: Scene | undefined;
  velocity: number | undefined;
  collider: Cube | Sphere | undefined;
  protected dimensions: {
    width: number;
    height: number;
    depth: number;
  };

  constructor() {
    this.dimensions = {
      width: 0,
      height: 0,
      depth: 0,
    };
  }

  update(deltaTime: number): void {}

  getDimensions(): { width: number; height: number; depth: number } {
    return this.dimensions;
  }

  addToScene(scene: Scene) {
    if (!this.figure) return;
    this.scene = scene;
    scene.add(this.figure);
    if (this.collider) {
      const material = this.collider.figure.material as Material;
      material.visible = scene.debugMode;
      material.needsUpdate = true;
    }
  }
}
