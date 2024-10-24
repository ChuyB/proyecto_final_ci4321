import * as THREE from "three";
import Body from "./body";
import Turret from "./turret";
import Cannon from "./cannon";
import Wheel from "./wheel";
import Proyectile from "./../Proyectile"

/**
 * Class representing a tank.
 */
export default class Tank {
  public body: THREE.Mesh;
  public turret: THREE.Mesh;
  public cannon: THREE.Mesh;
  public wheels: THREE.Mesh[] = [];
  private direction: number = 0;
  private projectiles: Proyectile[] = [];
  private lastShootTime: number = 0;
  private shootCooldown: number = 1000;
  private scene: THREE.Scene;

  /**
   * Creates an instance of Tank.
   * @param {THREE.Scene} scene - The scene to which the tank will be added.
   */
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.body = new Body(scene).figure;
    this.turret = new Turret().figure;
    this.cannon = new Cannon().figure;
    this.createWheels();

    // Position the turret on top of the body
    this.turret.position.set(0, 8, 0);
    this.body.add(this.turret);

    // Position the cannon on the turret
    this.cannon.position.set(0, 5, 10);
    this.turret.add(this.cannon);

    // Add wheels to the body
    this.wheels.forEach(wheel => this.body.add(wheel));

    // Add the complete tank to the scene
    scene.add(this.body);
  }

  /**
   * Creates the wheels of the tank and positions them.
   */
  private createWheels() {
    // Define the positions for the wheels
    const wheelPositions = [
      [0, 2, 16],  // Front axle
      [0, 2, 0],   // Middle axle
      [0, 2, -16]  // Rear axle
    ];

    // Create and position each wheel
    wheelPositions.forEach(pos => {
      const wheel = new Wheel().figure;
      wheel.position.set(pos[0], pos[1], pos[2]);
      this.wheels.push(wheel);
    });
  }

  /**
   * Moves the tank in the direction it's facing.
   * @param {number} speed - The speed at which the tank moves.
   */
  public move(speed: number) {
    this.body.position.x -= Math.sin(this.direction) * speed;
    this.body.position.z -= Math.cos(this.direction) * speed;
    
    // Rotate wheels
    this.wheels.forEach(wheel => {
      wheel.rotation.x += speed * 0.1;
    });
  }

  /**
   * Rotates the tank.
   * @param {number} angle - The angle by which to rotate the tank.
   */
  public rotateTank(angle: number) {
    this.direction += angle;
    this.body.rotation.y = this.direction;
  }

  /**
   * Rotates the turret.
   * @param {number} angle - The angle by which to rotate the turret.
   */
  public rotateTurret(angle: number) {
    this.turret.rotation.y += angle;
  }

  /**
   * Elevates the cannon.
   * @param {number} angle - The angle by which to elevate the cannon.
   */
  public elevateCannon(angle: number) {
    const newAngle = this.cannon.rotation.x + 10;
    // Limit cannon elevation between -15 and 30 degrees
    if (newAngle >= -Math.PI / 12 && newAngle <= Math.PI / 6) {
      this.cannon.rotation.x = newAngle;
    }
  }

  public shoot(initialVelocity: number = 30) {
    const currentTime = Date.now();
    if (currentTime - this.lastShootTime < this.shootCooldown) {
      return;
    }

    const projectile = new Proyectile();

    const cannonWorldPosition = new THREE.Vector3();
    this.cannon.getWorldPosition(cannonWorldPosition)

    const totalRotationY = this.direction + this.turret.rotation.y;

    projectile.shoot(
      cannonWorldPosition,
      totalRotationY,
      this.cannon.rotation.x,
      initialVelocity
    );

    this.projectiles.push(projectile);
    this.scene.add(projectile.figure)
    this.lastShootTime = currentTime;
  }

  public update(deltaTime: number) {
    this.projectiles = this.projectiles.filter(projectile => {
      const isActive = projectile.update(deltaTime);
      if(!isActive) {
        this.scene.remove(projectile.figure);
      }
      return isActive
    });
  }
}
