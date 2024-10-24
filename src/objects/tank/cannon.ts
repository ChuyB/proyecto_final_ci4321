import * as THREE from "three";
import Cylinder from "../primitives/Cylinder";

/**
 * Class representing a cannon.
 */
export default class Cannon {
  public figure: THREE.Mesh;
  public head: THREE.Mesh;

  /**
   * Creates an instance of Cannon.
   */
  constructor() {
    this.head = new THREE.Mesh();
    this.figure = this.createCannon();
  }

  /**
   * Creates the cannon geometry and mesh.
   * @returns {THREE.Mesh} - The mesh representing the cannon.
   */
  private createCannon(): THREE.Mesh {
    const radius = 2.5; // Radius of the cannon
    const length = 23; // Length of the cannon
    const radialSegments = 32; // Number of segments to make it look smooth
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
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      color: 0x2a2a2f, // Dark grey
      roughness: 0.4,
      metalness: 0.2,
      side: THREE.DoubleSide,
    });

    const cannon = new THREE.Mesh(geometry, material);
    cannon.castShadow = true;
    cannon.receiveShadow = true;

    // Rotate the cannon to be horizontal
    cannon.rotation.x = Math.PI / 2;

    // Make a group to change the pivot point of the cannon
    const group = new THREE.Mesh();
    cannon.position.z = length / 2;
    group.add(cannon);

    // Create the head of the cannon
    const headMaterial = new THREE.MeshPhongMaterial({
      color: 0x2f2f2f, // Dark grey
      specular: 0x808080,
      shininess: 50,
    })
    const head = new Cylinder({
      baseRadius: 2.6,
      topRadius: 2.6,
      height: 5,
      material: headMaterial,
    }).figure;
    head.position.z = length; // Position the head at the end of the cannon

    // Add the head to the group
    this.head = head;
    group.add(head);

    return group;
  }
}
