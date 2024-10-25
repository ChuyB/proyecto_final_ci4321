import * as THREE from "three";
import Box from "./Box";
import Cylinder from "./primitives/Cylinder";

export default class Projectile extends Cylinder {
  private velocity_vector: THREE.Vector3;
  private gravity: number = 9.8;
  private isActive: boolean = false;
  private initialPosition: THREE.Vector3;
  private isLinearShoot: boolean = false;

  constructor(isLinearShoot: boolean, options?: any) {
    super(options);
    this.setBoundingBox();
    this.velocity_vector = new THREE.Vector3();
    this.initialPosition = new THREE.Vector3();
    this.isLinearShoot = isLinearShoot;
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

  public shoot(
    position: THREE.Vector3,
    direction: number,
    angle: number,
    initialVelocity: number,
  ) {
    this.isActive = true;
    this.figure.position.copy(position);
    this.initialPosition.copy(position);

    this.velocity_vector.set(
      Math.sin(direction) * initialVelocity,
      Math.sin(angle) * -initialVelocity,
      Math.cos(direction) * initialVelocity,
    );
  }

  public update(deltaTime: number): boolean {
    if (!this.isActive) return false;

    if (deltaTime) {
      // Actualizar posición
      this.figure.position.x += this.velocity_vector.x * deltaTime;
      this.figure.position.y += this.velocity_vector.y * deltaTime;
      this.figure.position.z += this.velocity_vector.z * deltaTime;

      // Aplicar gravedad
      if (!this.isLinearShoot) {
        this.velocity_vector.y -= this.gravity * deltaTime;
      }

      // Orientar el proyectil
      const targetPosition = this.figure.position
        .clone()
        .add(this.velocity_vector);
      this.figure.lookAt(targetPosition);

      // Verificar si el proyectil ha caído por debajo del suelo
      if (this.figure.position.y < 0) {
        this.isActive = false;
        this.figure.position.y = 0;
        return false;
      }

      // Verficar si el proyectil sobrepasa el techo
      if (this.figure.position.y > 100) {
        this.isActive = false;
        this.figure.position.y = 100;
        return false;
      }

      return true;
    }

    return false;
  }

  public reset() {
    this.isActive = false;
    this.figure.position.copy(this.initialPosition);
    this.velocity_vector.set(0, 0, 0);
  }
}
