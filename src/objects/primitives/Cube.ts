import * as THREE from "three";

interface CubeInterface {
  size?: number;
  textureSrc?: string;
  phongProperties?: { specular: number; shininess: number };
}

/**
 * Clase que genera un cubo
 */
export default class Cube {
  figure: THREE.Mesh;

  /**
   * Constructor de la clase
   */
  constructor(options?: CubeInterface) {
    const defaultOptions = this.setDefaults();
    const { size, textureSrc, phongProperties } = {
      ...defaultOptions,
      ...options,
    };
    const geometry = this.createGeometry(size);
    const material = this.createMaterial(textureSrc, phongProperties);
    const mesh = new THREE.Mesh(geometry, material);

    mesh.receiveShadow = true;
    mesh.castShadow = true;
    this.figure = mesh;
  }

  /**
   * Crea la geometría de la figura
   */
  protected createGeometry(
    size: number,
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

    return geometry;
  }

  /**
   * Crea un material con textura para la figura
   */
  protected createMaterial(
    textureSrc: string,
    phongProperties: { specular: number; shininess: number },
  ) {
    const texture = new THREE.TextureLoader().load(textureSrc);
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      ...phongProperties,
    });

    return material;
  }

  /**
   * Establece los valores por defecto de la figura
   */
  protected setDefaults() {
    return {
      size: 1,
      textureSrc: "src/assets/Prototype_Textures/Dark/texture_02.png",
      phongProperties: { specular: 0xffffff, shininess: 50 },
    };
  }

  addToScene(scene: THREE.Scene) {
    scene.add(this.figure);
  }
}

