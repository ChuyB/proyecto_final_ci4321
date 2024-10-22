import * as THREE from "three";
import { Scene } from "three";

export default class Box {
  public figure: THREE.Mesh;
  constructor(scene: Scene,
    size = 10,
    textureSrc = "src/assets/Prototype_Textures/Orange/texture_13.png",
    phongProperties = { specular: 0xFF6865, shininess: 30 }
  ) {
    const cube = this.createBox(scene, size, textureSrc, phongProperties);
    this.figure = cube;
  }

  private createBox(
    scene: Scene,
    size: number,
    textureSrc: string,
    phongProperties: { specular: number, shininess: number },
  ) {
    const geometry = new THREE.BufferGeometry();
    const vertexArray = [
      // Frente
      -1.0,-1.0, 1.0,
       1.0,-1.0, 1.0,
       1.0, 1.0, 1.0,
       1.0, 1.0, 1.0,
      -1.0, 1.0, 1.0,
      -1.0,-1.0, 1.0,

      // Izquierda
      -1.0,-1.0,-1.0,
      -1.0,-1.0, 1.0,
      -1.0, 1.0, 1.0,
      -1.0, 1.0, 1.0,
      -1.0, 1.0,-1.0,
      -1.0,-1.0,-1.0,

      // Atrás
       1.0,-1.0,-1.0,
      -1.0,-1.0,-1.0,
      -1.0, 1.0,-1.0,
      -1.0, 1.0,-1.0,
       1.0, 1.0,-1.0,
       1.0,-1.0,-1.0,

      // Derecha
       1.0,-1.0, 1.0,
       1.0,-1.0,-1.0,
       1.0, 1.0,-1.0,
       1.0, 1.0,-1.0,
       1.0, 1.0, 1.0,
       1.0,-1.0, 1.0,
      
      //Arriba
      -1.0, 1.0, 1.0,
       1.0, 1.0, 1.0,
       1.0, 1.0,-1.0,
       1.0, 1.0,-1.0,
      -1.0, 1.0,-1.0,
      -1.0, 1.0, 1.0,

      // Debajo
      -1.0,-1.0,-1.0,
       1.0,-1.0,-1.0,
       1.0,-1.0, 1.0,
       1.0,-1.0, 1.0,
      -1.0,-1.0, 1.0,
      -1.0,-1.0,-1.0,
    ];

    const uvArray = [
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,

      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,

      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,

      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,

      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,

      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,
    ]
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertexArray.map(x => x * size), 3),
    );
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvArray, 2));
    geometry.computeVertexNormals();

    const texture = new THREE.TextureLoader().load(textureSrc);
    const material = new THREE.MeshPhongMaterial({ map: texture, ...phongProperties });

    const cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    scene.add(cube);
    return cube;
  }
}
