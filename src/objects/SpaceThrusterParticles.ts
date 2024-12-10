import * as THREE from "three";

class SpaceThrusterParticles {
  public particles: THREE.InstancedMesh;
  public maxParticles: number = 900;
  private velocities: THREE.Vector3[] = [];
  private lifetimes: number[] = [];
  private time: number[] = [];
  private sizes: number[] = [];
  private opacities: number[] = [];
  private emitterPosition: THREE.Vector3;
  private camera: THREE.Camera;

  constructor(scene: THREE.Scene, texture: THREE.Texture, camera: THREE.Camera) {
    const geometry = new THREE.SphereGeometry(0.1, 8, 8); // 3D particles
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });

    this.camera = camera;
    this.particles = new THREE.InstancedMesh(geometry, material, this.maxParticles);
    this.emitterPosition = new THREE.Vector3(0, 0, -2);

    // Initialize particle data
    for (let i = 0; i < this.maxParticles; i++) {
      this.velocities.push(new THREE.Vector3());
      this.lifetimes.push(Math.random() * 0.1 + 0.5);
      this.time.push(0);
      this.sizes.push(Math.random() * 3 + 0.1);
      this.opacities.push(1);

      const dummy = new THREE.Mesh(geometry, material);
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 0.5; // Adjust the radius as needed
      dummy.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        -10
      );
      dummy.scale.set(this.sizes[i], this.sizes[i], this.sizes[i]);
      dummy.updateMatrix();
      this.particles.setMatrixAt(i, dummy.matrix);
    }

    scene.add(this.particles);
  }

  setEmitterPosition(position: THREE.Vector3) {
    this.emitterPosition.copy(position);
  }

  setInitialPositionAndDirection(index: number, position: THREE.Vector3, direction: THREE.Vector3) {
    const dummy = new THREE.Mesh(this.particles.geometry, this.particles.material);
    dummy.position.copy(position).add(this.emitterPosition);
    this.velocities[index].copy(direction);
    dummy.scale.set(this.sizes[index], this.sizes[index], this.sizes[index]);
    dummy.updateMatrix();
    this.particles.setMatrixAt(index, dummy.matrix);
  }

  update(delta: number, position: THREE.Vector3, direction: THREE.Vector3) {
      const dummy = new THREE.Object3D();
  
      // Ajusta la posición del emisor para que esté justo detrás del cohete
      this.setEmitterPosition(position.clone().sub(direction.clone().multiplyScalar(2)));
  
      for (let i = 0; i < this.maxParticles; i++) {
          this.time[i] += delta;
  
          // Reset particle if lifetime exceeded
          if (this.time[i] > this.lifetimes[i]) {
              this.time[i] = 0;
              this.lifetimes[i] = 0.5 + Math.random() * 0.5;
              dummy.position.copy(this.emitterPosition);
              this.sizes[i] = Math.random() * 2 + 0.5;
              this.opacities[i] = 1;
  
              // Inicializa la velocidad en la dirección opuesta al cohete con una componente aleatoria
              this.velocities[i] = direction.clone().multiplyScalar(-1).add(new THREE.Vector3(
                  (Math.random() - 0.5) * 10, // Componente aleatoria en X
                  (Math.random() - 0.5) * 10, // Componente aleatoria en Y
                  (Math.random() - 0.5) * 10  // Componente aleatoria en Z
              ));
          }
  
          // Añade una aceleración para que las partículas se desaceleren
          this.velocities[i].add(direction.clone().multiplyScalar((Math.random() - 0.5) * 3 + 30));
  
          // Añade una componente aleatoria a la velocidad en cada actualización
          this.velocities[i].add(new THREE.Vector3(
              (Math.random() - 0.5) * 20 + 1, // Componente aleatoria en X
              (Math.random() - 0.5) * 20 + 1, // Componente aleatoria en Y
              (Math.random() - 0.5) * 20 + 1  // Componente aleatoria en Z
          ));
  
          // Actualiza la posición de la partícula
          dummy.position.copy(this.emitterPosition).add(new THREE.Vector3(
            0,
            -3,
            0
        )).add(this.velocities[i].clone().multiplyScalar(delta));
  
          // Actualiza la escala y la opacidad de la partícula
          dummy.scale.set(this.sizes[i], this.sizes[i], this.sizes[i]);
          this.opacities[i] = 1;
          (this.particles.material as THREE.Material).opacity = this.opacities[i];
          dummy.updateMatrix();
  
          // Copia la posición y la matriz de transformación a la instancia de la partícula
          this.particles.setMatrixAt(i, dummy.matrix);
      }
  
      // Asegúrate de que las partículas se rendericen correctamente
      this.particles.instanceMatrix.needsUpdate = true;
      this.particles.renderOrder = 999; // Ajusta el orden de renderizado
      (this.particles.material as THREE.Material).depthTest = false; // Deshabilita el depth test
  }
}

export default SpaceThrusterParticles;