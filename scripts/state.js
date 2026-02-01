/**
 * PROGGY - Game State
 * Central state management
 */

const GameState = {
  // Game status: 'title', 'levelselect', 'editing', 'paused', 'success', 'gameover'
  status: 'title',

  // Theme
  isDark: false,

  // Level progression
  currentLevel: 1,
  highestLevel: 1,
  levelData: {},
  currentLevelData: null,  // Store the current level to prevent regeneration

  // Editor state
  cursorLine: 0,
  scrollOffset: 0,
  focusArea: 'code',  // 'code' or 'grid'
  editMode: 'browse', // 'browse', 'line', 'param'

  // Code (20 lines)
  code: [],

  // Simulation state (set by Simulation module)
  simulation: null,
  history: [],
  historyIndex: 0,

  // Visual state
  shakeTimer: 0,
  errorMessage: '',
  errorTimer: 0,
  pulseEffect: null,
  defendEffect: null,

  // Crank simulation
  crankAngle: 0,

  // Level select
  levelSelectRow: 0,
  levelSelectCol: 0,

  // Random mode (secret)
  randomMode: false,
  crankAccumulator: 0,

  // Input tracking
  keys: {},

  /**
   * Initialize state from localStorage
   */
  init() {
    // Load theme preference
    const savedTheme = localStorage.getItem('proggy-theme');
    if (savedTheme === 'dark') {
      this.isDark = true;
    } else if (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.isDark = true;
    }

    // Load progress
    const savedProgress = localStorage.getItem('proggy-progress');
    if (savedProgress) {
      try {
        const data = JSON.parse(savedProgress);
        this.highestLevel = data.highestLevel || 1;
        this.levelData = data.levelData || {};
      } catch (e) {
        console.warn('Failed to load progress:', e);
      }
    }

    // Initialize empty code
    this.resetCode();
  },

  /**
   * Reset code to empty lines
   */
  resetCode() {
    this.code = [];
    for (let i = 0; i < Config.CODE_LINES; i++) {
      this.code.push({ cmd: 0, param: 0, indent: 0 });
    }
  },

  /**
   * Load saved code for a level
   */
  loadLevelCode(levelId) {
    if (this.levelData[levelId] && this.levelData[levelId].code) {
      this.code = JSON.parse(JSON.stringify(this.levelData[levelId].code));
    } else {
      this.resetCode();
    }
  },

  /**
   * Save code for current level
   */
  saveLevelCode(levelId, ticks, lines) {
    if (!this.levelData[levelId]) {
      this.levelData[levelId] = {};
    }
    this.levelData[levelId].code = JSON.parse(JSON.stringify(this.code));

    // Only update best scores if they're better
    const existing = this.levelData[levelId];
    if (!existing.ticks || ticks < existing.ticks) {
      existing.ticks = ticks;
    }
    if (!existing.lines || lines < existing.lines) {
      existing.lines = lines;
    }

    this.saveProgress();
  },

  /**
   * Unlock next level
   */
  unlockNextLevel(levelId) {
    if (levelId >= this.highestLevel && levelId < Config.TOTAL_LEVELS) {
      this.highestLevel = levelId + 1;
      this.saveProgress();
    }
  },

  /**
   * Save progress to localStorage
   */
  saveProgress() {
    const data = {
      highestLevel: this.highestLevel,
      levelData: this.levelData
    };
    localStorage.setItem('proggy-progress', JSON.stringify(data));
  },

  /**
   * Count non-empty lines
   */
  countLines() {
    let count = 0;
    for (const line of this.code) {
      if (line.cmd !== 0) count++;
    }
    return count;
  },

  /**
   * Reset for new game
   */
  reset() {
    this.cursorLine = 0;
    this.scrollOffset = 0;
    this.focusArea = 'code';
    this.editMode = 'browse';
    this.simulation = null;
    this.history = [];
    this.historyIndex = 0;
    this.shakeTimer = 0;
    this.errorMessage = '';
    this.errorTimer = 0;
    this.pulseEffect = null;
    this.defendEffect = null;
    this.crankAngle = 0;
  }
};
