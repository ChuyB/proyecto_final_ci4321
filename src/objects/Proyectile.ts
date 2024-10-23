import * as THREE from "three";
import Box from "./Box";
import Cylinder from "./primitives/Cylinder";

export default class Proyectile extends Cylinder {
  constructor(options?: any) {
    super(options);
    this.setBoundingBox();
  }

  protected setDefaults() {
    return {
      baseRadius: 2,
      topRadius: 0,
      height: 8,
      sectorCount: 40,
      stackCount: 1,
      textureSrc: "src/assets/Prototype_Textures/Dark/texture_02.png",
      phongProperties: { specular: 0x808080, shininess: 50 },
      shadow: true,
    };
  }

  /**
   * Establece la caja de colisión del proyectil
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
      this.dimensions.depth,
    );
    box.figure.scale.x = greatestRadius;
    box.figure.scale.y = greatestRadius;
    box.figure.scale.z = this.dimensions.height;

    this.boundingBox = box;
    this.figure.add(box.figure);
  };

}
