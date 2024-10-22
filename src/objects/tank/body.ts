import * as THREE from "three";

/**
 * Class representing the body of a tank.
 */
export default class Body {
  public figure: THREE.Mesh;

  /**
   * Creates an instance of Body.
   * @param {THREE.Scene} scene - The scene to which the body will be added.
   * @param {number} width - The width of the body.
   * @param {number} height - The height of the body.
   * @param {number} depth - The depth of the body.
   */
  constructor(scene: THREE.Scene, width = 28, height = 16, depth = 36) {
    this.figure = this.createBody(scene, width, height, depth);
  }

  /**
   * Creates the body of the tank.
   * @param {THREE.Scene} scene - The scene to which the body will be added.
   * @param {number} width - The width of the body.
   * @param {number} height - The height of the body.
   * @param {number} depth - The depth of the body.
   * @returns {THREE.Mesh} - The mesh representing the body of the tank.
   */
  private createBody(scene: THREE.Scene, width: number, height: number, depth: number): THREE.Mesh {
    const geometry = new THREE.BufferGeometry();
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const halfDepth = depth / 2;

    // Define the vertices for the body
    const vertexArray = [
      // Front face
      -halfWidth, -halfHeight, halfDepth,
      halfWidth, -halfHeight, halfDepth,
      halfWidth, halfHeight, halfDepth,
      -halfWidth, halfHeight, halfDepth,

      // Back face
      -halfWidth, -halfHeight, -halfDepth,
      -halfWidth, halfHeight, -halfDepth,
      halfWidth, halfHeight, -halfDepth,
      halfWidth, -halfHeight, -halfDepth,

      // Top face
      -halfWidth, halfHeight, -halfDepth,
      -halfWidth, halfHeight, halfDepth,
      halfWidth, halfHeight, halfDepth,
      halfWidth, halfHeight, -halfDepth,

      // Bottom face
      -halfWidth, -halfHeight, -halfDepth,
      halfWidth, -halfHeight, -halfDepth,
      halfWidth, -halfHeight, halfDepth,
      -halfWidth, -halfHeight, halfDepth,

      // Right face
      halfWidth, -halfHeight, -halfDepth,
      halfWidth, halfHeight, -halfDepth,
      halfWidth, halfHeight, halfDepth,
      halfWidth, -halfHeight, halfDepth,

      // Left face
      -halfWidth, -halfHeight, -halfDepth,
      -halfWidth, -halfHeight, halfDepth,
      -halfWidth, halfHeight, halfDepth,
      -halfWidth, halfHeight, -halfDepth,
    ];

    // Define the indices for the faces
    const indexArray = [
      // Front face
      0, 1, 2,    0, 2, 3,    
      // Back face
      4, 5, 6,    4, 6, 7,    
      // Top face
      8, 9, 10,   8, 10, 11,  
      // Bottom face
      12, 13, 14, 12, 14, 15, 
      // Right face
      16, 17, 18, 16, 18, 19, 
      // Left face
      20, 21, 22, 20, 22, 23, 
    ];

    // Set the position attribute and index for the geometry
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertexArray, 3)
    );
    geometry.setIndex(indexArray);
    geometry.computeVertexNormals();

    // Define the material for the body
    const material = new THREE.MeshStandardMaterial({
      color: 0x4a5f33,
      roughness: 0.5,
      metalness: 1,
      side: THREE.DoubleSide 
    });

    // Create the mesh for the body
    const body = new THREE.Mesh(geometry, material);
    body.castShadow = true;
    body.receiveShadow = true;
    scene.add(body);
    return body;
  }
}