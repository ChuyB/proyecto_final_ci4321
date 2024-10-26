import * as THREE from "three";

/**
 * Class representing a turret.
 */
export default class Turret {
  public figure: THREE.Mesh;

  /**
   * Creates an instance of Turret.
   */
  constructor() {
    this.figure = this.createTurret();
  }

  /**
   * Creates the turret geometry and mesh.
   * @returns {THREE.Mesh} - The mesh representing the turret.
   */
  private createTurret(): THREE.Mesh {
    const geometry = new THREE.BufferGeometry();
    const radius = 10;  // Radius of the dome
    const widthSegments = 32;  // Number of segments around the circumference
    const heightSegments = 16;  // Number of segments from top to bottom
    const vertices = [];
    const indices = [];

    // Create vertices for the dome
    for (let y = 0; y <= heightSegments; y++) {
      const theta = (y / heightSegments) * (Math.PI / 2); // Only half sphere
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let x = 0; x <= widthSegments; x++) {
        const phi = (x / widthSegments) * (Math.PI * 2);
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const vx = radius * cosPhi * sinTheta;
        const vy = radius * cosTheta;
        const vz = radius * sinPhi * sinTheta;

        vertices.push(vx, vy, vz);
      }
    }

    // Create indices for the dome
    for (let y = 0; y < heightSegments; y++) {
      for (let x = 0; x < widthSegments; x++) {
        const a = x + (widthSegments + 1) * y;
        const b = x + (widthSegments + 1) * (y + 1);
        const c = (x + 1) + (widthSegments + 1) * (y + 1);
        const d = (x + 1) + (widthSegments + 1) * y;

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    const positions = new Float32Array(vertices.flat());
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({ 
        color: 0x4a5f33,  // Military green
        roughness: 0.4,
        metalness: 1,
        side: THREE.DoubleSide
    });

    const turret = new THREE.Mesh(geometry, material);
    turret.receiveShadow = true;
    turret.castShadow = true;
    return turret;
  }
}
