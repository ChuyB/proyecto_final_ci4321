import * as THREE from 'three';

/**
 * Class representing a sprite font for rendering text using a texture atlas.
 */
class SpriteFont {
  private charWidth: number;
  private charHeight: number;
  private charMap: { [key: string]: [number, number] };
  private textureSize: number = 640;
  private texture: THREE.Texture | null = null;

  /**
   * Creates an instance of SpriteFont.
   */
  constructor() {
    this.charWidth = 64;
    this.charHeight = 64;
    // Character map and their positions in the sprite
    this.charMap = {
      // First row - Special characters
      ' ': [0, 0], '!': [1, 0], '"': [2, 0], '#': [3, 0],
      '$': [4, 0], '%': [5, 0], '&': [6, 0], '\'': [7, 0],
      '(': [8, 0], ')': [9, 0],
      
      // Second row - Numbers and symbols
      '*': [0, 1], '+': [1, 1], ',': [2, 1], '-': [3, 1],
      '.': [4, 1], '/': [5, 1], '0': [6, 1], '1': [7, 1],
      '2': [8, 1], '3': [9, 1],
      
      // Third row - Numbers and symbols
      '4': [0, 2], '5': [1, 2], '6': [2, 2], '7': [3, 2],
      '8': [4, 2], '9': [5, 2], ':': [6, 2], ';': [7, 2],
      '<': [8, 2], '=': [9, 2],
      
      // Fourth row - Uppercase letters first part
      '>': [0, 3], '?': [1, 3], '@': [2, 3], 'A': [3, 3],
      'B': [4, 3], 'C': [5, 3], 'D': [6, 3], 'E': [7, 3],
      'F': [8, 3], 'G': [9, 3], 

      // Fifth row - Uppercase letters second part
      'H': [0, 4], 'I': [1, 4], 'J': [2, 4], 'K': [3, 4],
      'L': [4, 4], 'M': [5, 4], 'N': [6, 4], 'O': [7, 4],
      'P': [8, 4], 'Q': [9, 4],
      
      // Sixth row - Uppercase letters third part
      'R': [0, 5], 'S': [1, 5], 'T': [2, 5], 'U': [3, 5],
      'V': [4, 5], 'W': [5, 5], 'X': [6, 5], 'Y': [7, 5],
      'Z': [8, 5], '[': [9, 5],
      
      // Seventh row - Lowercase letters first part
      '\\': [0, 6], ']': [1, 6], '^': [2, 6], '_': [3, 6],
      '`': [4, 6], 'a': [5, 6], 'b': [6, 6], 'c': [7, 6],
      'd': [8, 6], 'e': [9, 6],

      // Eighth row - Lowercase letters second part
      'f': [0, 7], 'g': [1, 7], 'h': [2, 7], 'i': [3, 7],
      'j': [4, 7], 'k': [5, 7], 'l': [6, 7], 'm': [7, 7],
      'n': [8, 7], 'o': [9, 7],
      
      // Ninth row - Lowercase letters third part
      'p': [0, 8], 'q': [1, 8], 'r': [2, 8], 's': [3, 8],
      't': [4, 8], 'u': [5, 8], 'v': [6, 8], 'w': [7, 8],
      'x': [8, 8], 'y': [9, 8],
      
      // Tenth row - Lowercase letters fourth part and additional characters
      'z': [0, 9], '{': [1, 9], '|': [2, 9], '}': [3, 9], 
      '~': [4, 9], '²': [5, 9], 'ó': [6, 9]
    };
  }

  /**
   * Initializes the sprite font by loading the texture.
   * @returns A promise that resolves when the texture is loaded.
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        './src/assets/atlas/all_64x64.png', 
        (loadedTexture) => {
          loadedTexture.magFilter = THREE.NearestFilter;
          loadedTexture.minFilter = THREE.NearestFilter;
          this.texture = loadedTexture;
          console.log('Loaded font texture', this.texture);
          resolve();
        },
        undefined,
        (error) => {
          console.error('Error loading font texture:', error);
          reject(error);
        }
      );
    });
  }

  /**
   * Creates a text mesh using the sprite font.
   * @param text - The text to render.
   * @param options - Options for rendering the text.
   * @param options.color - The color of the text.
   * @param options.fontSize - The size of the text.
   * @param options.spacing - The spacing between characters.
   * @returns A THREE.Group containing the text mesh, or null if the texture is not loaded.
   */
  createText(text: string, options: {
    color?: number;
    fontSize?: number;
    spacing?: number;
  } = {}): THREE.Group | null {
    if (!this.texture) {
      console.error('Texture not loaded. Call init() first.');
      return null;
    }

    const {
      color = 0xffffff, // Default text color is white
      fontSize = 1, // Default font size
      spacing = 0.85 // Default spacing between characters
    } = options;

    const group = new THREE.Group(); // Create a new group to hold the text meshes
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        textureMap: { value: this.texture }, // Use the loaded texture
        color: { value: new THREE.Color(color) } // Set the text color
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `, // Vertex shader to pass UV coordinates to the fragment shader
      fragmentShader: `
        uniform sampler2D textureMap;
        uniform vec3 color;
        varying vec2 vUv;
        void main() {
          vec4 texColor = texture2D(textureMap, vUv);
          gl_FragColor = vec4(color, 1.0) * texColor.a;
        }
      `, // Fragment shader to apply the texture and color
      transparent: true // Enable transparency
    });
    
    let xOffset = 0; // Initialize the horizontal offset for character positioning
    const characterSize = fontSize; // Set the size of each character
    const charSpacing = characterSize * spacing; // Calculate the spacing between characters
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (!this.charMap[char]) {
        console.warn(`Character not found in map: "${char}"`);
        continue;
      }
    
      const [x, y] = this.charMap[char]; // Get the character's position in the texture atlas
    
      const uvOffsetX = (x * this.charWidth) / this.textureSize; // Calculate the UV offset X
      const uvOffsetY = 1 - ((y + 1) * this.charHeight) / this.textureSize; // Calculate the UV offset Y
      const uvSizeX = this.charWidth / this.textureSize; // Calculate the UV size X
      const uvSizeY = this.charHeight / this.textureSize; // Calculate the UV size Y
    
      const geometry = new THREE.PlaneGeometry(characterSize, characterSize); // Create a plane geometry for the character
      
      const uvs = geometry.attributes.uv; // Get the UV attribute of the geometry
      uvs.array[0] = uvOffsetX; // Set UV coordinates
      uvs.array[1] = uvOffsetY + uvSizeY;
      uvs.array[2] = uvOffsetX + uvSizeX;
      uvs.array[3] = uvOffsetY + uvSizeY;
      uvs.array[4] = uvOffsetX;
      uvs.array[5] = uvOffsetY;
      uvs.array[6] = uvOffsetX + uvSizeX;
      uvs.array[7] = uvOffsetY;
    
      const meshMaterial = material.clone(); // Clone the material for each character
      const mesh = new THREE.Mesh(geometry, meshMaterial); // Create a mesh for the character
      mesh.position.x = xOffset; // Set the position of the character mesh
      group.add(mesh); // Add the character mesh to the group
    
      xOffset += charSpacing; // Update the horizontal offset for the next character
    }
    
    const width = xOffset - charSpacing; // Calculate the total width of the text
    group.position.x = -width / 2; // Center the text group
    
    return group; // Return the group containing the text meshes
  }
}

export default SpriteFont;