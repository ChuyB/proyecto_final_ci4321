import * as THREE from "three";
import Cylinder from "./primitives/Cylinder";
import Cube from "./primitives/Cube";

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
    this.setCollisionMesh();
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
   * Establece la malla de colisión de la diana
   */
  private setCollisionMesh = () => {
    const cube = new Cube({
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
    cube.figure.scale.x = greatestRadius;
    cube.figure.scale.y = greatestRadius;
    cube.figure.scale.z = this.dimensions.height;

    this.collider = cube;
    this.figure.add(cube.figure);
  };
}
