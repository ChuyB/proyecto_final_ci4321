import * as THREE from "three";

interface CylinderInterface {
  baseRadius?: number;
  topRadius?: number;
  height?: number;
  sectorCount?: number;
  stackCount?: number;
  textureSrc?: string;
  phongProperties?: { specular: number; shininess: number };
  shadow?: boolean;
}

/**
 * Clase que genera un cilindro
 */
export default class Cylinder {
  figure: THREE.Mesh;

  constructor(options?: CylinderInterface) {
    const defaultOptions = this.setDefaults();
    const {
      baseRadius,
      topRadius,
      height,
      sectorCount,
      stackCount,
      textureSrc,
      phongProperties,
      shadow,
    } = {
      ...defaultOptions,
      ...options,
    };

    // Crea la geometría
    const geometry = this.createGeometry(
      baseRadius,
      topRadius,
      height,
      sectorCount,
      stackCount,
    );
    // Crea la textura
    const material = this.createMaterial(
      textureSrc,
      phongProperties.specular,
      phongProperties.shininess,
    );

    // Crea la figura
    const mesh = new THREE.Mesh(geometry, material);
    this.figure = mesh;

    // Añade sombras en caso de que se especifique
    mesh.castShadow = shadow;
    mesh.receiveShadow = shadow;
  }

  addToScene(scene: THREE.Scene) {
    scene.add(this.figure);
  }

  /**
   * Crea la geometría de la figura
   */
  protected createGeometry(
    baseRadius: number,
    topRadius: number,
    height: number,
    sectorCount: number,
    stackCount: number,
  ) {
    let x, y, z: number;
    const vertices = [];
    const indices = [];
    const uv = [];
    let sectorStep = (2 * Math.PI) / sectorCount;
    let sectorAngle, radius: number;

    // Calcula coordenadas de un círculo unitario
    // para evitar repetir cálculos de senos y cosenos
    const unitCircleVertices = [];
    for (let i = 0; i <= sectorCount; ++i) {
      sectorAngle = i * sectorStep;
      unitCircleVertices.push(Math.cos(sectorAngle));
      unitCircleVertices.push(Math.sin(sectorAngle));
      unitCircleVertices.push(0);
    }

    // Calcula los vértices de cada stack
    for (let i = 0; i <= stackCount; ++i) {
      z = -(height * 0.5) + (i / stackCount) * height;
      radius = baseRadius + (i / stackCount) * (topRadius - baseRadius);
      let t = 1 - i / stackCount;

      for (let j = 0, k = 0; j <= sectorCount; ++j, k += 3) {
        x = unitCircleVertices[k];
        y = unitCircleVertices[k + 1];
        vertices.push(x * radius, y * radius, z);
        uv.push(j / sectorCount, t);
      }
    }

    // Vértices de la base
    const baseVertexIndex = vertices.length / 3;
    z = -height * 0.5;
    vertices.push(0, 0, z);
    uv.push(0.5, 0.5);

    for (let i = 0, j = 0; i < sectorCount; ++i, j += 3) {
      x = unitCircleVertices[j];
      y = unitCircleVertices[j + 1];
      vertices.push(x * baseRadius, y * baseRadius, z);
      uv.push(-x * 0.5 + 0.5, -y * 0.5 + 0.5);
    }

    // Vértices de la tapa
    const topVertexIndex = vertices.length / 3;
    z = height * 0.5;
    vertices.push(0, 0, z);
    uv.push(0.5, 0.5);
    for (let i = 0, j = 0; i < sectorCount; ++i, j += 3) {
      x = unitCircleVertices[j];
      y = unitCircleVertices[j + 1];
      vertices.push(x * topRadius, y * topRadius, z);
      uv.push(x * 0.5 + 0.5, -y * 0.5 + 0.5);
    }

    // Cálculo de los índices para cada cara
    let k1, k2: number;

    // Índices de sectores
    for (let i = 0; i < stackCount; ++i) {
      k1 = i * (sectorCount + 1);
      k2 = k1 + sectorCount + 1;

      for (let j = 0; j < sectorCount; ++j, ++k1, ++k2) {
        // 2 Tríangulos por sector
        indices.push(k1, k1 + 1, k2);
        indices.push(k2, k1 + 1, k2 + 1);
      }
    }

    // Índices de la base
    for (let i = 0, k = baseVertexIndex + 1; i < sectorCount; ++i, ++k) {
      if (i < sectorCount - 1) {
        indices.push(baseVertexIndex, k + 1, k);
      } else {
        indices.push(baseVertexIndex, baseVertexIndex + 1, k);
      }
    }

    // Índices de la tapa
    for (let i = 0, k = topVertexIndex + 1; i < sectorCount; ++i, ++k) {
      if (i < sectorCount - 1) {
        indices.push(topVertexIndex, k, k + 1);
      } else {
        indices.push(topVertexIndex, k, topVertexIndex + 1);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3),
    );
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
  }

  /**
   * Crea un material con textura para la figura
   */
  protected createMaterial(
    textureSrc: string,
    specular: number,
    shininess: number,
  ) {
    const texture = new THREE.TextureLoader().load(textureSrc);

    const material = new THREE.MeshPhongMaterial({
      map: texture,
      specular: specular,
      shininess: shininess,
    });

    return material;
  }

  /**
   * Establece los valores por defecto de la figura
   */
  protected setDefaults() {
    return {
      baseRadius: 5,
      topRadius: 5,
      height: 30,
      sectorCount: 50,
      stackCount: 1,
      textureSrc: "src/assets/Prototype_Textures/Dark/texture_09.png",
      phongProperties: { specular: 0x808080, shininess: 50 },
      shadow: true,
    };
  }
}
