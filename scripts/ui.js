/**
 * PROGGY - UI System
 * DOM updates and overlay management
 */

const UI = {
  // Cached DOM elements
  elements: {},

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      // Desktop stats
      tickDisplay: document.getElementById('tickDisplay'),
      linesDisplay: document.getElementById('linesDisplay'),
      pulsesDisplay: document.getElementById('pulsesDisplay'),
      defendsDisplay: document.getElementById('defendsDisplay'),

      // Mobile stats
      mobileTickDisplay: document.getElementById('mobileTickDisplay'),
      mobilePulsesDisplay: document.getElementById('mobilePulsesDisplay'),
      mobileDefendsDisplay: document.getElementById('mobileDefendsDisplay'),

      // Overlays
      startScreen: document.getElementById('startScreen'),
      pauseScreen: document.getElementById('pauseScreen'),
      successScreen: document.getElementById('successScreen'),
      gameOverScreen: document.getElementById('gameOverScreen'),

      // Success stats
      successTicks: document.getElementById('successTicks'),
      successLines: document.getElementById('successLines'),

      // Buttons
      startBtn: document.getElementById('startBtn'),
      nextBtn: document.getElementById('nextBtn'),

      // Theme toggles
      themeToggle: document.getElementById('themeToggle'),
      modalThemeToggle: document.getElementById('modalThemeToggle'),

      // Mobile controls
      mobileUp: document.getElementById('mobileUp'),
      mobileDown: document.getElementById('mobileDown'),
      mobileEnter: document.getElementById('mobileEnter'),
      mobileLeft: document.getElementById('mobileLeft'),
      mobileRight: document.getElementById('mobileRight'),
      mobileInfoBtn: document.getElementById('mobileInfoBtn'),
      infoModal: document.getElementById('infoModal'),
      modalClose: document.getElementById('modalClose'),

      // Canvas
      canvas: document.getElementById('gameCanvas'),
      canvasWrapper: document.querySelector('.canvas-wrapper')
    };
  },

  /**
   * Initialize UI
   */
  init() {
    this.cacheElements();
    this.bindEvents();
    this.showOverlay('start');
    this.update();
  },

  /**
   * Bind UI events
   */
  bindEvents() {
    const el = this.elements;

    // Start button
    if (el.startBtn) {
      el.startBtn.addEventListener('click', () => {
        Audio.init();
        Game.startRandomLevel();
      });
    }

    // Next level button
    if (el.nextBtn) {
      el.nextBtn.addEventListener('click', () => {
        Game.startRandomLevel();
      });
    }

    // Theme toggles
    if (el.themeToggle) {
      el.themeToggle.addEventListener('click', () => Theme.toggle());
    }
    if (el.modalThemeToggle) {
      el.modalThemeToggle.addEventListener('click', () => Theme.toggle());
    }

    // Mobile info modal
    if (el.mobileInfoBtn) {
      el.mobileInfoBtn.addEventListener('click', () => {
        el.infoModal.classList.add('active');
      });
    }
    if (el.modalClose) {
      el.modalClose.addEventListener('click', () => {
        el.infoModal.classList.remove('active');
      });
    }

    // Mobile controls
    if (el.mobileUp) {
      el.mobileUp.addEventListener('touchstart', (e) => {
        e.preventDefault();
        Input.handleUp();
      });
    }
    if (el.mobileDown) {
      el.mobileDown.addEventListener('touchstart', (e) => {
        e.preventDefault();
        Input.handleDown();
      });
    }
    if (el.mobileEnter) {
      el.mobileEnter.addEventListener('touchstart', (e) => {
        e.preventDefault();
        Input.handleEnter();
      });
    }
    if (el.mobileLeft) {
      el.mobileLeft.addEventListener('touchstart', (e) => {
        e.preventDefault();
        Input.handleLeft();
      });
    }
    if (el.mobileRight) {
      el.mobileRight.addEventListener('touchstart', (e) => {
        e.preventDefault();
        Input.handleRight();
      });
    }
  },

  /**
   * Show a specific overlay
   */
  showOverlay(type) {
    const el = this.elements;

    // Hide all overlays first
    if (el.startScreen) el.startScreen.style.display = 'none';
    if (el.pauseScreen) el.pauseScreen.style.display = 'none';
    if (el.successScreen) el.successScreen.style.display = 'none';
    if (el.gameOverScreen) el.gameOverScreen.style.display = 'none';

    // Show the requested overlay
    switch (type) {
      case 'start':
        if (el.startScreen) el.startScreen.style.display = 'flex';
        break;
      case 'pause':
        if (el.pauseScreen) el.pauseScreen.style.display = 'flex';
        break;
      case 'success':
        if (el.successScreen) {
          el.successScreen.style.display = 'flex';
          // Update stats
          if (el.successTicks && GameState.simulation) {
            el.successTicks.textContent = GameState.simulation.tick;
          }
          if (el.successLines) {
            el.successLines.textContent = GameState.countLines();
          }
        }
        break;
      case 'gameover':
        if (el.gameOverScreen) el.gameOverScreen.style.display = 'flex';
        break;
      case 'none':
        // All overlays hidden
        break;
    }
  },

  /**
   * Update all UI elements
   */
  update() {
    const el = this.elements;
    const sim = GameState.simulation;

    // Tick display
    const tick = sim ? sim.tick : 0;
    if (el.tickDisplay) el.tickDisplay.textContent = tick;
    if (el.mobileTickDisplay) el.mobileTickDisplay.textContent = tick;

    // Lines display
    const lines = GameState.countLines();
    if (el.linesDisplay) el.linesDisplay.textContent = lines;

    // Pulses/Defends display
    const pulses = sim ? sim.player.pulses : 0;
    const defends = sim ? sim.player.defends : 0;
    if (el.pulsesDisplay) el.pulsesDisplay.textContent = pulses;
    if (el.defendsDisplay) el.defendsDisplay.textContent = defends;
    if (el.mobilePulsesDisplay) el.mobilePulsesDisplay.textContent = pulses;
    if (el.mobileDefendsDisplay) el.mobileDefendsDisplay.textContent = defends;
  },

  /**
   * Show shake effect on canvas
   */
  shake() {
    const el = this.elements;
    if (el.canvasWrapper) {
      el.canvasWrapper.classList.add('shake');
      setTimeout(() => {
        el.canvasWrapper.classList.remove('shake');
      }, 400);
    }
  }
};
