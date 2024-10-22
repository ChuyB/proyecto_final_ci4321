import Cube from "./primitives/Cube";

export default class Box extends Cube {
  constructor(options?: any) {
    super(options);
  }

  protected setDefaults() {
    return {
      size: 10,
      textureSrc: "src/assets/Prototype_Textures/Dark/texture_13.png",
      phongProperties: { specular: 0x808080, shininess: 50 },
    };
  }
}
