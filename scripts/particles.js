/**
 * PROGGY - Particle System
 * Visual effects for game events
 */

const Particles = {
  particles: [],

  /**
   * Spawn particles at a position
   */
  spawn(x, y, type) {
    const count = type === 'kill' ? 8 : 4;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
      const speed = 2 + Math.random() * 3;

      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 2,
        life: 1,
        decay: 0.03 + Math.random() * 0.02,
        type: type
      });
    }
  },

  /**
   * Update all particles
   */
  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Friction
      p.vx *= 0.95;
      p.vy *= 0.95;

      // Decay
      p.life -= p.decay;

      // Remove dead particles
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  },

  /**
   * Draw all particles
   */
  draw(ctx) {
    for (const p of this.particles) {
      ctx.fillStyle = Theme.getINK();
      ctx.globalAlpha = p.life;
      ctx.fillRect(
        p.x - p.size / 2,
        p.y - p.size / 2,
        p.size,
        p.size
      );
    }
    ctx.globalAlpha = 1;
  },

  /**
   * Clear all particles
   */
  clear() {
    this.particles = [];
  }
};
