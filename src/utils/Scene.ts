import * as THREE from "three";
import Box from "../objects/Box";
import Target from "../objects/Target";
import Tank from "../objects/tank/tank";
import Primitive from "../objects/primitives/Primitive";

export type SceneObject = Primitive | Tank;

export default class Scene extends THREE.Scene {
  // Objetos de la escena
  objects: SceneObject[];

  // Constructor de la clase
  constructor() {
    super();

    this.objects = [];

    this.addObjectsToScene();
    this.addSkybox();
    this.addGround();
    this.addLights();
  }

  /**
   * Llama al método update de los objetos de la escena
   */
  updateObjects = (time: number) => {
    this.objects.forEach((object) => {
      object.update(time);
    });
  };

  /**
   * Remueve objetos de la escena
   */
  removeObjectFromScene(object: SceneObject) {
    if (object instanceof Tank || object.figure === undefined) return;
    this.remove(object.figure);

    // Se busca el objeto en el array de objetos de la escena
    // y se elimina si no es un tanque
    const index = this.objects.findIndex((sceneObject) => {
      if (sceneObject instanceof Tank) return false;
      return sceneObject === object;
    });
    if (index !== -1) {
      this.objects.splice(index, 1);
    }
  }

  /**
   * Añade cajas, dianas y el tanque a la escena
   */
  private addObjectsToScene() {
    const boxes = this.addBoxes();
    const targets = this.addTargets();
    const tank = this.addTank();
    this.objects.push(...boxes, ...targets, tank);
  }

  /**
   * Añade un skybox a la escena
   */
  private addSkybox() {
    const textureDir = "src/assets/Daylight Box_Pieces";
    const textures: THREE.Texture[] = [];
    const sides = ["Right", "Left", "Top", "Bottom", "Front", "Back"];
    sides.forEach((side) => {
      const texture = new THREE.TextureLoader().load(
        `${textureDir}/Daylight Box_${side}.bmp`,
      );
      textures.push(texture);
    });

    const skyboxGeometry = new THREE.BoxGeometry(1600, 1600, 1600);
    const skyboxMaterials = textures.map(
      (texture) =>
        new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide }),
    );
    const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
    this.add(skybox);
  }

  /**
   * Añade el suelo de la escena
   */
  private addGround() {
    const groundGeometry = new THREE.PlaneGeometry(1600, 1600);
    const groundMaterial = new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load(
        "src/assets/Prototype_Textures/Dark/texture_05.png",
      ),
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.updateMatrix();
    ground.receiveShadow = true;
    this.add(ground);
  }

  /**
   * Añade la iluminación de la escena
   */
  private addLights() {
    // Iluminación
    // Luz direccional
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(200, 200, 200);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.top += 100;
    directionalLight.shadow.camera.left -= 100;
    directionalLight.shadow.camera.bottom -= 100;
    directionalLight.shadow.camera.right += 100;
    this.add(directionalLight);
    // Guías de la sombra
    // this.add(new THREE.CameraHelper(directionalLight.shadow.camera));

    // Luz ambiental
    const light = new THREE.AmbientLight(0xffffff);
    this.add(light);
  }

  /**
   * Añade cajas a la escena
   */
  private addBoxes() {
    const box0 = new Box();
    box0.addToScene(this);

    box0.figure.position.set(0, 10, 0);
    const box1 = new Box({
      size: 12,
      textureSrc: "src/assets/Prototype_Textures/Purple/texture_01.png",
      phongProperties: { specular: 0x808080, shininess: 50 },
    });
    box1.addToScene(this);
    box1.figure.position.set(50, 12, 5);

    const box2 = new Box({
      size: 5,
      textureSrc: "src/assets/Prototype_Textures/Red/texture_05.png",
      phongProperties: { specular: 0x808080, shininess: 50 },
    });
    box2.addToScene(this);
    box2.figure.position.set(20, 5, 30);

    return [box0, box1, box2];
  }

  /**
   * Añade dianas a la escena
   */
  private addTargets() {
    const target0 = new Target();
    target0.addToScene(this);
    target0.figure.position.set(-50, 15, 30);
    target0.figure.rotation.y = Math.PI / 2;

    const target1 = new Target({
      baseRadius: 10,
      topRadius: 10,
      textureSrc: "src/assets/Prototype_Textures/Orange/texture_06.png",
    });
    target1.addToScene(this);
    target1.figure.position.set(-45, 10, 75);
    target1.figure.rotation.y = Math.PI / 1.5;

    return [target0, target1];
  }

  /**
   * Añade un tanque a la escena
   */
  private addTank() {
    // Se añade un tanque a la escena
    const tank = new Tank(this);
    tank.body.position.set(0, 2, 50); // Posición inicial del tanque
    return tank;
  }
}
