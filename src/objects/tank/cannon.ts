import * as THREE from "three";

/**
 * Class representing a cannon.
 */
export default class Cannon {
  public figure: THREE.Mesh;

  /**
   * Creates an instance of Cannon.
   */
  constructor() {
    this.figure = this.createCannon();
  }

  /**
   * Creates the cannon geometry and mesh.
   * @returns {THREE.Mesh} - The mesh representing the cannon.
   */
  private createCannon(): THREE.Mesh {
    const radius = 2.5;  // Radius of the cannon
    const length = 20;  // Length of the cannon
    const radialSegments = 32;  // Number of segments to make it look smooth
    const vertices = [];
    const indices = [];

    // Create vertices for the top and bottom circles
    for (let i = 0; i <= radialSegments; i++) {
      const angle = (i / radialSegments) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Top circle
      vertices.push(x, length / 2, z);
      // Bottom circle
      vertices.push(x, -length / 2, z);
    }

    // Create indices for the sides
    for (let i = 0; i < radialSegments; i++) {
      const top1 = i * 2;
      const bottom1 = top1 + 1;
      const top2 = top1 + 2;
      const bottom2 = bottom1 + 2;

      indices.push(top1, bottom1, top2);
      indices.push(top2, bottom1, bottom2);
    }

    // Create indices for the top and bottom faces
    for (let i = 1; i < radialSegments - 1; i++) {
      indices.push(0, i * 2, (i + 1) * 2); // Top face
      indices.push(1, (i + 1) * 2 + 1, i * 2 + 1); // Bottom face
    }

    const positions = new Float32Array(vertices.flat());
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      color: 0x2A2A2f,  // Dark grey
      roughness: 0.4,
      metalness: 0.2,
      side: THREE.DoubleSide
    });

    const cannon = new THREE.Mesh(geometry, material);
    cannon.castShadow = true;
    cannon.receiveShadow = true;

    // Make a group to change the pivot point of the cannon
    const group = new THREE.Mesh();
    cannon.position.z = length / 2;
    group.add(cannon);

    return group;
  }
}
