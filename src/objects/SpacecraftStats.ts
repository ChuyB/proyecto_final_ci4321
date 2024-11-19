import * as THREE from 'three';
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

class SpacecraftStats extends THREE.Object3D {
  private speedText!: THREE.Mesh;
  private accelerationText!: THREE.Mesh;
  private font!: Font;
  private backgroundSprite!: THREE.Sprite;
  private group: THREE.Group;

  /**
   * Creates an instance of SpacecraftStats.
   * @param speed - The initial speed of the spacecraft.
   * @param acceleration - The initial acceleration of the spacecraft.
   */
  constructor(private speed: number, private acceleration: number) {
    super();

    this.group = new THREE.Group();
    this.add(this.group);

    this.setupBackground();
    this.setupText();
  }

  /**
   * Sets up the background sprite for the stats display.
   */
  private setupBackground() {
    const textureLoader = new THREE.TextureLoader();
    const backgroundTexture = textureLoader.load('src/assets/spacecraft_stats/buttonStock1d.png'); // Adjust the path as necessary
    const backgroundMaterial = new THREE.SpriteMaterial({ map: backgroundTexture });
    this.backgroundSprite = new THREE.Sprite(backgroundMaterial);
    this.backgroundSprite.scale.set(250, 200, 1); // Adjust the size as necessary
    this.group.add(this.backgroundSprite);
  }

  /**
   * Sets up the text for displaying speed and acceleration.
   */
  private setupText() {
    const fontLoader = new FontLoader();
    fontLoader.load('src/assets/fonts/helvetiker_regular.typeface.json', (font) => {
      this.font = font;
      this.createText();
    });
  }

  /**
   * Creates the text meshes for speed and acceleration.
   */
  private createText() {
    const text_speed = `Velocidad: ${this.speed.toFixed(2)} km/s`;
    const speedGeometry = new TextGeometry(text_speed, {
      font: this.font,
      size: 10,
      height: 1,
    });
    this.speedText = new THREE.Mesh(speedGeometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    this.speedText.position.set(-3 * text_speed.length, 10, 0.1); // Adjust the position to be over the sprite
    this.group.add(this.speedText);

    const text_acceleration = `Aceleracion: ${this.acceleration.toFixed(2)} m/s²`;
    const accelerationGeometry = new TextGeometry(text_acceleration, {
      font: this.font,
      size: 10,
      height: 1,
    });
    this.accelerationText = new THREE.Mesh(accelerationGeometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    this.accelerationText.position.set(-3 * text_acceleration.length, -10, 0.1); // Adjust the position to be over the sprite
    this.group.add(this.accelerationText);
  }

  /**
   * Updates the stats with new speed and acceleration values.
   * @param speed - The new speed of the spacecraft.
   * @param acceleration - The new acceleration of the spacecraft.
   */
  public updateStats(speed: number, acceleration: number) {
    this.speed = speed;
    this.acceleration = acceleration;

    this.group.remove(this.speedText);
    this.group.remove(this.accelerationText);

    this.createText();
  }

  /**
   * Sets the position of the stats display.
   * @param x - The X position.
   * @param y - The Y position.
   * @param z - The Z position.
   */
  public setPosition(x: number, y: number, z: number) {
    this.group.position.set(x, y, z);
  }
}

export default SpacecraftStats;