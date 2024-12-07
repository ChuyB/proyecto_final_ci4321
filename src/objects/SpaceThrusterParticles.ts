import * as THREE from "three";

class SpaceThrusterParticles  {
  private particles: THREE.InstancedMesh;
  private maxParticles: number = 600;
  private velocities: THREE.Vector3[] = [];
  private lifetimes: number[] = [];
  private time: number[] = [];
  private sizes: number[] = [];
  private opacities: number[] = [];
  private acceleration: THREE.Vector3;

  constructor(scene: THREE.Scene, texture: THREE.Texture) {
    const geometry = new THREE.SphereGeometry(0.1, 8, 8); // 3D particles
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });

    this.particles = new THREE.InstancedMesh(geometry, material, this.maxParticles);

    // Initialize particle data
    for (let i = 0; i < this.maxParticles; i++) {
      const position = new THREE.Vector3(0, 0, 0);
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 3, // Reduced initial velocity in X
        (Math.random() - 0.5) * 3, // Reduced initial velocity in Y
        -Math.random() * 1.5 - 1 // Initial velocity in Z
      );
      this.velocities.push(velocity);
      this.lifetimes.push(Math.random() * 1 + 0.5);
      this.time.push(0);
      this.sizes.push(Math.random() * 0.2 + 0.1);
      this.opacities.push(1);

      const dummy = new THREE.Object3D();
      dummy.position.copy(position);
      dummy.scale.set(this.sizes[i], this.sizes[i], this.sizes[i]);
      dummy.updateMatrix();
      this.particles.setMatrixAt(i, dummy.matrix);
    }

    // Set a constant acceleration to curve the particles' trajectory
    this.acceleration = new THREE.Vector3(0.05, 0, 0); // Adjust the X component for a curved trajectory

    scene.add(this.particles);
  }

  update(delta: number) {
    const dummy = new THREE.Object3D();

    for (let i = 0; i < this.maxParticles; i++) {
      this.time[i] += delta;

      // Reset particle if lifetime exceeded
      if (this.time[i] > this.lifetimes[i]) {
        this.time[i] = 0;
        this.lifetimes[i] = Math.random() * 1 + 0.5;
        this.velocities[i].set(
          (Math.random() - 0.5) * 3, // Reduced initial velocity in X
          (Math.random() - 0.5) * 3, // Reduced initial velocity in Y
          -Math.random() * 1.5 - 1 // Initial velocity in Z
        );
        dummy.position.set(0, 0, 0);
        this.sizes[i] = Math.random() * 0.2 + 0.1;
        this.opacities[i] = 1;
      }

      // Apply the constant acceleration to the particle's velocity
      this.velocities[i].add(this.acceleration.clone().multiplyScalar(delta));

      dummy.position.add(this.velocities[i].clone().multiplyScalar(delta));
      dummy.scale.set(this.sizes[i], this.sizes[i], this.sizes[i]);
      this.opacities[i] -= delta / this.lifetimes[i];
      dummy.updateMatrix();
      this.particles.setMatrixAt(i, dummy.matrix);
    }

    this.particles.instanceMatrix.needsUpdate = true;
  }
}