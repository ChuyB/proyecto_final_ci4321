import * as THREE from "three";
import Primitive from "./Primitive";

interface SphereInterface {
  radius?: number;
  sectorCount?: number;
  stackCount?: number;
  textureSrc?: string;
  phongPorperties?: { color?: number; specular: number; shininess: number };
  shadow?: boolean;
  material?: THREE.Material;
}

export default class Sphere extends Primitive {
  figure: THREE.Mesh;

  constructor(options?: SphereInterface) {
    super();
    const defaultOptions = this.setDefaults();
    const {
      radius,
      sectorCount,
      stackCount,
      textureSrc,
      phongProperties,
      shadow,
      material,
    } = {
      ...defaultOptions,
      ...options,
    };

    this.dimensions = {
      height: radius,
      width: radius,
      depth: radius,
    };

    const geometry = this.createGeometry(radius, sectorCount, stackCount);
    const nMaterial = material
      ? material
      : this.createMaterial(textureSrc, phongProperties);

    const mesh = new THREE.Mesh(geometry, nMaterial);

    mesh.receiveShadow = shadow;
    mesh.castShadow = shadow;
    this.figure = mesh;
  }

  private setDefaults() {
    return {
      radius: 10,
      sectorCount: 32,
      stackCount: 16,
      phongProperties: { color: 0xe0e0e0, specular: 0xffffff, shininess: 30 },
      shadow: true,
    };
  }

  private createGeometry(
    radius: number,
    sectorCount: number,
    stackCount: number,
  ) {
    const vertices = [];
    const indices = [];
    const uv = [];

    let x, y, z, xy, s, t: number;
    let sectorStep = (2 * Math.PI) / sectorCount;
    let stackStep = Math.PI / stackCount;
    let sectorAngle, stackAngle: number;

    // Genera los vértices y los UVs
    for (let i = 0; i <= stackCount; i++) {
      stackAngle = Math.PI / 2 - i * stackStep;
      xy = radius * Math.cos(stackAngle);
      z = radius * Math.sin(stackAngle);

      for (let j = 0; j <= sectorCount; j++) {
        sectorAngle = j * sectorStep;

        x = xy * Math.cos(sectorAngle);
        y = xy * Math.sin(sectorAngle);
        vertices.push(x, y, z);

        s = j / sectorCount;
        t = i / stackCount;
        uv.push(s, t);
      }
    }

    // Genera los índices
    let k1, k2: number;
    for (let i = 0; i < stackCount; i++) {
      k1 = i * (sectorCount + 1);
      k2 = k1 + sectorCount + 1;

      for (let j = 0; j < sectorCount; j++, k1++, k2++) {
        if (i != 0) {
          indices.push(k1, k2, k1 + 1);
        }

        if (i != stackCount - 1) {
          indices.push(k1 + 1, k2, k2 + 1);
        }
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

  private createMaterial(
    textureSrc: string | undefined,
    phongProperties: { color?: number; specular: number; shininess: number },
  ) {
    const texture = new THREE.TextureLoader().load(textureSrc || "");
    const material =
      textureSrc === "" || textureSrc === undefined
        ? new THREE.MeshPhongMaterial(phongProperties)
        : new THREE.MeshPhongMaterial({ map: texture, ...phongProperties });

    return material;
  }
}
