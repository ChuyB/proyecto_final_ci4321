import { Object3D } from "three";
import Cube from "./Cube";

export default class Primitive {
  figure: Object3D | undefined;
  velocity: number | undefined;
  boundingBox: Cube | undefined;
  dimensions: {
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
}
