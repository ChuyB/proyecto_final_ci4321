import * as THREE from "three";
import Cylinder from "./primitives/Cylinder";
import Box from "./Box";

interface TargetOptions {
  baseRadius?: number;
  topRadius?: number;
  height?: number;
  sectorCount?: number;
  stackCount?: number;
  textureSrc?: string;
  phongProperties?: { specular: number; shininess: number };
  shadow?: boolean;
}

/**
 * Clase que representa un objeto de tipo diana
 */
export default class Target extends Cylinder {
  constructor(options?: TargetOptions) {
    super(options);
    this.setBoundingBox();
  }

  protected setDefaults() {
    return {
      baseRadius: 15,
      topRadius: 15,
      height: 2,
      sectorCount: 50,
      stackCount: 1,
      textureSrc: "src/assets/Prototype_Textures/Dark/texture_09.png",
      phongProperties: { specular: 0x808080, shininess: 50 },
      shadow: true,
    };
  }

  /**
   * Establece la caja de colisión de la diana
   */
  private setBoundingBox = () => {
    const box = new Box({
      size: 0.5,
      shadow: false,
      material: new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
      }),
    });
    const greatestRadius = Math.max(
      this.dimensions.width,
      this.dimensions.height,
    );
    box.figure.scale.x = greatestRadius;
    box.figure.scale.y = greatestRadius;
    box.figure.scale.z = this.dimensions.height;

    this.boundingBox = box;
    this.figure.add(box.figure);
  };
}
