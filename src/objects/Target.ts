import * as THREE from "three";
import Cylinder from "./primitives/Cylinder";

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
}
