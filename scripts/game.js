/**
 * PROGGY - Main Game Controller
 * Game initialization and main loop (Random mode only)
 */

const Game = {
  /**
   * Initialize the game
   */
  init() {
    // Initialize state from localStorage
    GameState.init();

    // Always use random mode for web version
    GameState.randomMode = true;

    // Apply theme
    Theme.apply();

    // Initialize renderer
    Renderer.init();

    // Initialize UI
    UI.init();

    // Initialize input handlers
    Input.init();

    // Start game loop
    this.loop();

    console.log('PROGGY Web Version initialized (Random Mode)');
  },

  /**
   * Start a new random level
   */
  startRandomLevel() {
    GameState.reset();
    GameState.resetCode();
    GameState.status = 'editing';

    // Generate random level and store it
    const level = Levels.generateRandom();
    GameState.currentLevelData = level;
    Simulation.init(level);

    // Hide overlays, show game
    UI.showOverlay('none');

    // Start background music
    Audio.startMusic();

    UI.update();
  },

  /**
   * Handle level success
   */
  handleSuccess() {
    GameState.status = 'success';
    UI.showOverlay('success');
    Audio.play('levelup');
  },

  /**
   * Handle game over
   */
  handleGameOver() {
    GameState.status = 'gameover';
    UI.showOverlay('gameover');
  },

  /**
   * Pause game
   */
  pause() {
    GameState.status = 'paused';
    UI.showOverlay('pause');
    Audio.play('click');
  },

  /**
   * Resume game
   */
  resume() {
    GameState.status = 'editing';
    UI.showOverlay('none');
    Audio.play('click');
  },

  /**
   * Go to title
   */
  goToTitle() {
    GameState.status = 'title';
    Audio.stopMusic();
    UI.showOverlay('start');
    Audio.play('click');
  },

  /**
   * Main game loop
   */
  loop() {
    // Update
    this.update();

    // Render
    Renderer.draw();

    // Schedule next frame
    requestAnimationFrame(() => this.loop());
  },

  /**
   * Update game state
   */
  update() {
    // Update UI stats periodically
    if (GameState.status === 'editing' || GameState.status === 'success' || GameState.status === 'gameover') {
      UI.update();
    }
  }
};

// Start game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  Game.init();
});
