import * as THREE from "three";

/**
 * Class representing a wheel.
 */
export default class Wheel {
  public figure: THREE.Mesh;

  /**
   * Creates an instance of Wheel.
   */
  constructor() {
    this.figure = this.createWheel();
  }

  /**
   * Creates the wheel geometry and mesh.
   * @returns {THREE.Mesh} - The mesh representing the wheel.
   */
  private createWheel(): THREE.Mesh {
    const geometry = new THREE.BufferGeometry();
    const radius = 4;  // Radius of the wheel
    const length = 33;  // Length of the wheel
    const radialSegments = 40;  // Number of segments to make it look smooth
    const vertices = [];
    const indices = [];

    // Create vertices for the top and bottom circles
    for (let i = 0; i <= radialSegments; i++) {
      const angle = (i / radialSegments) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      vertices.push(x, length / 2, z);  // Top circle
      vertices.push(x, -length / 2, z); // Bottom circle
    }

    // Create indices for the sides
    for (let i = 0; i < radialSegments; i++) {
      const top1 = i * 2;
      const bottom1 = top1 + 1;
      const top2 = (i + 1) * 2;
      const bottom2 = (i + 1) * 2 + 1;

      // Create two triangles for each segment
      indices.push(top1, bottom1, top2);
      indices.push(bottom1, bottom2, top2);
    }

    // Create indices for the top cap
    const centerTop = vertices.length / 3;
    vertices.push(0, length / 2, 0); // Center of the top circle

    for (let i = 0; i < radialSegments; i++) {
      const v1 = i * 2;
      const v2 = ((i + 1) % radialSegments) * 2;
      indices.push(centerTop, v1, v2);
    }

    // Create indices for the bottom cap
    const centerBottom = vertices.length / 3;
    vertices.push(0, -length / 2, 0); // Center of the bottom circle

    for (let i = 0; i < radialSegments; i++) {
      const v1 = i * 2 + 1;
      const v2 = ((i + 1) % radialSegments) * 2 + 1;
      indices.push(centerBottom, v2, v1);
    }

    const positions = new Float32Array(vertices);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      color: 0x1A1A1A,
      roughness: 0.2,
      metalness: 0.2,
      side: THREE.DoubleSide // Ensures both sides of the faces are visible
    });

    const wheel = new THREE.Mesh(geometry, material);
    wheel.castShadow = true;
    wheel.receiveShadow = true;
    wheel.rotation.z = Math.PI / 2;

    return wheel;
  }
}