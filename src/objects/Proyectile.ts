import Cylinder from "./primitives/Cylinder";

export default class Proyectile extends Cylinder {
  constructor(options?: any) {
    super(options);
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
}
