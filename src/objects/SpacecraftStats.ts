import * as THREE from 'three';
import SpriteFont from '../utils/SpriteFont';

class SpacecraftStats extends THREE.Object3D {
  private speedText!: THREE.Group;
  private accelerationText!: THREE.Group;
  private backgroundSprite!: THREE.Sprite;
  private group: THREE.Group;
  private spriteFont: SpriteFont;
  private isInitialized: boolean = false;

  /**
   * Creates an instance of SpacecraftStats.
   * @param speed - The initial speed of the spacecraft.
   * @param acceleration - The initial acceleration of the spacecraft.
   */
  constructor(private speed: number, private acceleration: number) {
    super();
    
    this.group = new THREE.Group(); // Create a group to hold all elements
    this.add(this.group); // Add the group to the object
    
    this.spriteFont = new SpriteFont(); // Initialize the sprite font
  }

  /**
   * Initialize the component. Must be called after construction.
   */
  async init(): Promise<void> {
    try {
      // Initialize the sprite font first
      await this.spriteFont.init();
      
      // Then load the background
      await this.setupBackground();
      
      // Finally create the text
      this.createText();
      
      this.isInitialized = true; // Mark as initialized
    } catch (error) {
      console.error('Error initializing SpacecraftStats:', error);
    }
  }

  /**
   * Sets up the background sprite for the stats display.
   */
  private async setupBackground(): Promise<void> {
    return new Promise((resolve) => {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        '/src/assets/spacecraft_stats/buttonStock1d.png', // Path to the background texture
        (backgroundTexture) => {
          const backgroundMaterial = new THREE.SpriteMaterial({ map: backgroundTexture });
          this.backgroundSprite = new THREE.Sprite(backgroundMaterial);
          this.backgroundSprite.scale.set(250, 200, 1); // Set the scale of the background sprite
          this.group.add(this.backgroundSprite); // Add the background sprite to the group
          resolve();
        },
        undefined,
        (error) => {
          console.error('Error loading background texture:', error);
          resolve(); // Resolve anyway to avoid blocking
        }
      );
    });
  }

  /**
   * Creates the text displays.
   */
  private createText() {
    // Remove existing text
    if (this.speedText) this.group.remove(this.speedText);
    if (this.accelerationText) this.group.remove(this.accelerationText);

    // Create speed text
    const speedString = `Velocidad: ${this.speed.toFixed(2)} km/s`;
    const newSpeedText = this.spriteFont.createText(speedString, {
      color: 0xffffff, // White color
      fontSize: 8.5, // Font size
      spacing: 0.85 // Spacing between characters
    });

    if (newSpeedText) {
      this.speedText = newSpeedText;
      this.speedText.position.set(-speedString.length * 3.5, 10, 0.1); // Set position of the speed text
      this.group.add(this.speedText); // Add speed text to the group
    }

    // Create acceleration text
    const accelerationString = `Aceleración: ${this.acceleration.toFixed(2)} km/s²`;
    const newAccelText = this.spriteFont.createText(accelerationString, {
      color: 0xffffff, // White color
      fontSize: 8.5, // Font size
      spacing: 0.85 // Spacing between characters
    });

    if (newAccelText) {
      this.accelerationText = newAccelText;
      this.accelerationText.position.set(-accelerationString.length * 3.5, -10, 0.1); // Set position of the acceleration text
      this.group.add(this.accelerationText); // Add acceleration text to the group
    }
  }

  /**
   * Updates the stats with new values.
   * @param speed - The new speed of the spacecraft.
   * @param acceleration - The new acceleration of the spacecraft.
   */
  public updateStats(speed: number, acceleration: number) {
    this.speed = speed;
    this.acceleration = acceleration;
    if (this.isInitialized) {
      this.createText(); // Update the text if initialized
    }
  }

  /**
   * Sets the position of the stats display.
   * @param x - The X position.
   * @param y - The Y position.
   * @param z - The Z position.
   */
  public setPosition(x: number, y: number, z: number) {
    this.group.position.set(x, y, z); // Set the position of the group
  }
}

export default SpacecraftStats;