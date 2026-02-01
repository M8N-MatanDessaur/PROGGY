/**
 * PROGGY - Input Handler
 * Keyboard, mouse, and touch input (Random mode only)
 */

const Input = {
  /**
   * Initialize input handlers
   */
  init() {
    // Keyboard
    document.addEventListener('keydown', (e) => this.onKeyDown(e));
    document.addEventListener('keyup', (e) => this.onKeyUp(e));

    // Mouse wheel for crank simulation
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
      canvas.addEventListener('wheel', (e) => this.onWheel(e));
    }

    // Touch/drag for mobile crank
    if (canvas) {
      let touchStartY = 0;
      canvas.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        Audio.init();
      });
      canvas.addEventListener('touchmove', (e) => {
        const deltaY = e.touches[0].clientY - touchStartY;
        if (Math.abs(deltaY) > 20) {
          if (deltaY > 0) {
            this.handleCrankForward();
          } else {
            this.handleCrankBackward();
          }
          touchStartY = e.touches[0].clientY;
        }
      });
    }
  },

  /**
   * Handle key down
   */
  onKeyDown(e) {
    GameState.keys[e.key] = true;

    // Prevent default for game keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter', 'Escape'].includes(e.key)) {
      e.preventDefault();
    }

    // Initialize audio on first key press
    Audio.init();

    switch (GameState.status) {
      case 'title':
        this.handleTitleInput(e);
        break;
      case 'editing':
        this.handleEditingInput(e);
        break;
      case 'paused':
        this.handlePausedInput(e);
        break;
      case 'success':
        this.handleSuccessInput(e);
        break;
      case 'gameover':
        this.handleGameOverInput(e);
        break;
    }
  },

  /**
   * Handle key up
   */
  onKeyUp(e) {
    GameState.keys[e.key] = false;
  },

  /**
   * Handle mouse wheel
   */
  onWheel(e) {
    e.preventDefault();

    if (GameState.status === 'editing') {
      if (GameState.focusArea === 'code') {
        if (GameState.editMode === 'browse') {
          if (e.deltaY > 0) {
            Editor.cursorDown();
          } else {
            Editor.cursorUp();
          }
        } else if (GameState.editMode === 'line') {
          if (e.deltaY > 0) {
            Editor.cycleCommandForward();
          } else {
            Editor.cycleCommandBackward();
          }
        } else if (GameState.editMode === 'param') {
          if (e.deltaY > 0) {
            Editor.cycleParamForward();
          } else {
            Editor.cycleParamBackward();
          }
        }
      } else if (GameState.focusArea === 'grid') {
        if (e.deltaY > 0) {
          this.handleCrankForward();
        } else {
          this.handleCrankBackward();
        }
      }
    }
  },

  /**
   * Title screen input
   */
  handleTitleInput(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      Game.startRandomLevel();
    } else if (e.key === 't' || e.key === 'T') {
      Theme.toggle();
    }
  },

  /**
   * Editing screen input
   */
  handleEditingInput(e) {
    if (GameState.focusArea === 'code') {
      this.handleCodeInput(e);
    } else {
      this.handleGridInput(e);
    }
  },

  /**
   * Code editor input
   */
  handleCodeInput(e) {
    switch (GameState.editMode) {
      case 'browse':
        switch (e.key) {
          case 'ArrowUp':
            Editor.cursorUp();
            break;
          case 'ArrowDown':
            Editor.cursorDown();
            break;
          case 'ArrowLeft':
            Editor.decreaseIndent();
            break;
          case 'ArrowRight':
            if (Editor.switchToGrid()) {
              // Start simulation
            }
            break;
          case 'Enter':
          case ' ':
            Editor.enterLineEdit();
            break;
          case 'Escape':
            Game.pause();
            break;
        }
        break;

      case 'line':
        switch (e.key) {
          case 'ArrowUp':
            Editor.cycleCommandBackward();
            break;
          case 'ArrowDown':
            Editor.cycleCommandForward();
            break;
          case 'ArrowLeft':
            Editor.decreaseIndent();
            break;
          case 'ArrowRight':
            Editor.increaseIndent();
            break;
          case 'Enter':
          case ' ':
            const line = GameState.code[GameState.cursorLine];
            const cmd = Config.COMMANDS[line.cmd];
            if (cmd.hasParam) {
              Editor.enterParamEdit();
            } else {
              Editor.exitToBrowse();
            }
            break;
          case 'Escape':
            Editor.exitToBrowse();
            break;
        }
        break;

      case 'param':
        switch (e.key) {
          case 'ArrowUp':
            Editor.cycleParamBackward();
            break;
          case 'ArrowDown':
            Editor.cycleParamForward();
            break;
          case 'Enter':
          case ' ':
          case 'Escape':
            Editor.exitToBrowse();
            break;
        }
        break;
    }
  },

  /**
   * Grid (simulation) input
   */
  handleGridInput(e) {
    switch (e.key) {
      case 'ArrowLeft':
      case 'Escape':
        Editor.switchToCode();
        break;
      case ' ':
      case 'Enter':
        if (!GameState.simulation.done) {
          Simulation.tick();
          Audio.play('step');
          UI.update();

          if (GameState.simulation.won) {
            Game.handleSuccess();
          } else if (GameState.simulation.lost) {
            Game.handleGameOver();
          }
        }
        break;
    }
  },

  /**
   * Handle crank forward (scrub forward in time)
   */
  handleCrankForward() {
    if (GameState.focusArea !== 'grid') return;

    const sim = GameState.simulation;
    if (!sim) return;

    if (GameState.historyIndex < GameState.history.length - 1) {
      // Scrub through existing history
      Simulation.scrubTo(GameState.historyIndex + 1);
      Audio.play('step');
    } else if (!sim.done) {
      // Execute next tick with code
      Simulation.tick();
      Audio.play('step');

      if (sim.won) {
        Game.handleSuccess();
      } else if (sim.lost) {
        Game.handleGameOver();
      }
    } else {
      // Simulation done (no code or program ended) - use preview tick
      Simulation.previewTick();
      Audio.play('step');

      // Check if player died during preview
      if (sim.lost) {
        Game.handleGameOver();
      }
    }

    UI.update();
  },

  /**
   * Handle crank backward (scrub backward in time)
   */
  handleCrankBackward() {
    if (GameState.focusArea !== 'grid') return;

    if (GameState.historyIndex > 0) {
      Simulation.scrubTo(GameState.historyIndex - 1);
      Audio.play('step');
      UI.update();
    }
  },

  /**
   * Paused input
   */
  handlePausedInput(e) {
    switch (e.key) {
      case ' ':
      case 'Enter':
        Game.resume();
        break;
      case 'Escape':
        // Generate new random level
        Game.startRandomLevel();
        break;
    }
  },

  /**
   * Success input
   */
  handleSuccessInput(e) {
    switch (e.key) {
      case ' ':
      case 'Enter':
        Game.startRandomLevel();
        break;
      case 'Escape':
        Game.goToTitle();
        break;
    }
  },

  /**
   * Game over input
   */
  handleGameOverInput(e) {
    switch (e.key) {
      case ' ':
      case 'Enter':
        // Return to editing
        GameState.status = 'editing';
        GameState.focusArea = 'code';
        Editor.resetSimulation();
        UI.showOverlay('none');
        Audio.play('click');
        break;
      case 'Escape':
        // New random level
        Game.startRandomLevel();
        break;
    }
  },

  /**
   * Mobile button handlers
   */
  handleUp() {
    this.onKeyDown({ key: 'ArrowUp', preventDefault: () => {} });
  },

  handleDown() {
    this.onKeyDown({ key: 'ArrowDown', preventDefault: () => {} });
  },

  handleLeft() {
    this.onKeyDown({ key: 'ArrowLeft', preventDefault: () => {} });
  },

  handleRight() {
    this.onKeyDown({ key: 'ArrowRight', preventDefault: () => {} });
  },

  handleEnter() {
    this.onKeyDown({ key: 'Enter', preventDefault: () => {} });
  }
};
