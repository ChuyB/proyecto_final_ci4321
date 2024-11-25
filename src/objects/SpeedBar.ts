import * as THREE from 'three';

/**
 * Class representing a speed bar in a 3D scene.
 */
export default class SpeedBar {
    private speed: number;
    private targetSpeed: number;
    private container: THREE.Group;
    private textures: { [key: string]: THREE.Texture };
    private background: THREE.Sprite;
    private positiveBar: THREE.Sprite;
    private negativeBar: THREE.Sprite;

    /**
     * Creates an instance of SpeedBar.
     * @param scene - The scene to which the speed bar will be added.
     * @param camera - The camera to which the speed bar will be relative.
     */
    constructor(scene: THREE.Scene) {
        this.speed = 0;
        this.targetSpeed = 0;
        this.container = new THREE.Group();
        scene.add(this.container);
        this.textures = this.loadTextures();
        this.background = this.createBackground(this.textures.background);
        this.positiveBar = this.createBar(this.textures.positive);
        this.negativeBar = this.createBar(this.textures.negative);
        this.initializeBars();
        this.addMetalBorders();
        this.container.position.set(0, 0, 0);

        // Añadir listener para las teclas 'r' y 'f'
        window.addEventListener('keydown', (event) => {
            if (event.key === 'r') {
                this.increaseSpeed();
            } else if (event.key === 'f') {
                this.decreaseSpeed();
            }
        });
    }

    /**
     * Loads the textures used in the speed bar.
     * @returns An object containing the loaded textures.
     */
    private loadTextures(): { [key: string]: THREE.Texture } {
        const textureLoader = new THREE.TextureLoader();
        return {
            background: textureLoader.load('./src/assets/velocity_bar/Glass2.png'),
            positive: textureLoader.load('./src/assets/velocity_bar/Mana.png'),
            negative: textureLoader.load('./src/assets/velocity_bar/Health2.png'),
            metal: textureLoader.load('./src/assets/velocity_bar/Metal.png')
        };
    }

    /**
     * Creates the background sprite for the speed bar.
     * @returns The created background sprite.
     */
    private createBackground(texture: THREE.Texture): THREE.Sprite {
        const backgroundMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        const background = new THREE.Sprite(backgroundMaterial);
        background.scale.set(40, 400, 1);
        this.container.add(background);
        return background;
    }

    /**
     * Creates a bar sprite with the given texture.
     * @param texture - The texture to be used for the bar.
     * @returns The created bar sprite.
     */
    private createBar(texture: THREE.Texture): THREE.Sprite {
        const barMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        const bar = new THREE.Sprite(barMaterial);
        bar.visible = false;
        bar.scale.set(20, 100, 1);
        this.container.add(bar);
        return bar;
    }

    /**
     * Initializes the visibility of the positive and negative bars.
     */
    private initializeBars(): void {
        this.positiveBar.visible = false;
        this.negativeBar.visible = false;
    }

    /**
     * Adds metal borders to the speed bar.
     */
    private addMetalBorders(): void {
        const topMetal = this.createMetalBorder();
        topMetal.position.set(0, 0, 0.1);
        this.container.add(topMetal);
    }

    /**
     * Creates a metal border sprite.
     * @returns The created metal border sprite.
     */
    private createMetalBorder(): THREE.Sprite {
        const metalMaterial = new THREE.SpriteMaterial({
            map: this.textures.metal,
            transparent: true
        });
        const metal = new THREE.Sprite(metalMaterial);
        metal.scale.set(30, 30, 1);
        return metal;
    }

    /**
     * Sets the target speed and starts the interpolation process.
     * @param newSpeed - The new speed value.
     */
    setTargetSpeed(newSpeed: number): void {
        this.targetSpeed = Math.max(-3, Math.min(3, Math.round(newSpeed)));
    }

    /**
     * Updates the speed and adjusts the visibility and size of the bars accordingly.
     * This method should be called in the animation loop.
     */
    update(): void {
        this.speed = THREE.MathUtils.lerp(this.speed, this.targetSpeed, 0.1);
        this.positiveBar.visible = false;
        this.negativeBar.visible = false;

        if (Math.abs(this.speed) < 0.01) {
            this.speed = 0;
            return;
        }

        const height = Math.abs(this.speed) / 3 * 190;

        if (this.speed > 0) {
            this.updateBar(this.positiveBar, height, height / 2);
        } else {
            this.updateBar(this.negativeBar, height, -height / 2);
        }

        // Mantener la SpeedBar en la misma posición relativa a la cámara
    }

    /**
     * Increases the speed.
     */
    private increaseSpeed(): void {
        this.setTargetSpeed(this.targetSpeed + 1);
    }

    /**
     * Decreases the speed.
     */
    private decreaseSpeed(): void {
        this.setTargetSpeed(this.targetSpeed - 1);
    }

    /**
     * Updates the properties of a bar sprite.
     * @param bar - The bar sprite to be updated.
     * @param height - The new height of the bar.
     * @param positionY - The new Y position of the bar.
     */
    private updateBar(bar: THREE.Sprite, height: number, positionY: number): void {
        bar.visible = true;
        bar.scale.y = height;
        bar.position.y = positionY;
    }

    /**
     * Sets the position of the speed bar container.
     * @param x - The X position.
     * @param y - The Y position.
     * @param z - The Z position.
     */
    setPosition(x: number, y: number, z: number): void {
        this.container.position.set(x, y, z);
    }
}

