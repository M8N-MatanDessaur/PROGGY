/**
 * PROGGY - Configuration
 * Game constants and command definitions
 */

const Config = {
  // Canvas dimensions (larger for better spacing)
  CANVAS_WIDTH: 520,
  CANVAS_HEIGHT: 280,

  // Grid settings
  GRID_COLS: 8,
  GRID_ROWS: 10,
  TILE_SIZE: 24,

  // Editor settings
  CODE_LINES: 20,
  VISIBLE_LINES: 9,
  EDITOR_WIDTH: 240,
  EDITOR_PADDING: 20,
  GRID_OFFSET_X: 290,
  GRID_PADDING_TOP: 20,
  CONTENT_HEIGHT: 240,

  // Mobile layout settings (stacked: grid on top, editor below)
  MOBILE_BREAKPOINT: 900,
  MOBILE_CANVAS_WIDTH: 320,
  MOBILE_CANVAS_HEIGHT: 560,
  MOBILE_TILE_SIZE: 32,
  MOBILE_GRID_PADDING: 16,
  MOBILE_EDITOR_HEIGHT: 200,
  MOBILE_VISIBLE_LINES: 8,
  MOBILE_EDITOR_PADDING: 16,

  // Sprite settings
  SPRITE_SIZE: 8,
  SPRITE_SCALE: 2,

  // Commands
  COMMANDS: [
    { id: 0, name: '---', hasParam: false, isTick: false },
    { id: 1, name: 'MOVE', hasParam: false, isTick: true },
    { id: 2, name: 'R-TURN', hasParam: false, isTick: true },
    { id: 3, name: 'L-TURN', hasParam: false, isTick: true },
    { id: 4, name: 'WAIT', hasParam: false, isTick: true },
    { id: 5, name: 'PULSE', hasParam: false, isTick: true },
    { id: 6, name: 'DEFEND', hasParam: false, isTick: true },
    { id: 7, name: 'FOR', hasParam: true, paramType: 'number', minParam: 1, maxParam: 10, isTick: false },
    { id: 8, name: 'WHILE', hasParam: true, paramType: 'condition', isTick: false },
    { id: 9, name: 'IF', hasParam: true, paramType: 'condition', isTick: false }
  ],

  // Conditions for WHILE/IF
  CONDITIONS: [
    { id: 0, name: 'BLOCKED', forWhile: true, forIf: true },
    { id: 1, name: '!BLOCKED', forWhile: true, forIf: true },
    { id: 2, name: 'U-WALL', forWhile: true, forIf: true },
    { id: 3, name: 'D-WALL', forWhile: true, forIf: true },
    { id: 4, name: 'L-WALL', forWhile: true, forIf: true },
    { id: 5, name: 'R-WALL', forWhile: true, forIf: true },
    { id: 6, name: '!U-WALL', forWhile: true, forIf: true },
    { id: 7, name: '!D-WALL', forWhile: true, forIf: true },
    { id: 8, name: '!L-WALL', forWhile: true, forIf: true },
    { id: 9, name: '!R-WALL', forWhile: true, forIf: true },
    { id: 10, name: 'ENEMY', forWhile: true, forIf: true },
    { id: 11, name: '!ENEMY', forWhile: true, forIf: true },
    { id: 12, name: 'TRUE', forWhile: true, forIf: false }
  ],

  // Directions (0=up, 1=right, 2=down, 3=left)
  DIRECTIONS: [
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 }
  ],

  // Animation
  FRAME_RATE: 30,
  SPRITE_FRAMES: 4,
  ANIM_TICK_DIVISOR: 4,

  // Effects
  PULSE_EXPAND_RATE: 4,
  PULSE_MAX_SIZE: 20,
  SHAKE_AMPLITUDE: 5,
  SHAKE_DURATION: 12,

  // Error display
  ERROR_DISPLAY_TIME: 90,

  // Crank simulation
  CRANK_SENSITIVITY: 90,

  // Level count
  TOTAL_LEVELS: 20,

  // Check if mobile layout should be used
  isMobile: function() {
    return window.innerWidth <= this.MOBILE_BREAKPOINT;
  },

  // Get current layout values based on screen size
  getLayout: function() {
    if (this.isMobile()) {
      var tileSize = this.MOBILE_TILE_SIZE;
      var gridWidth = this.GRID_COLS * tileSize;
      var gridHeight = this.GRID_ROWS * tileSize;
      var padding = this.MOBILE_GRID_PADDING;
      var centerX = (this.MOBILE_CANVAS_WIDTH - gridWidth) / 2;
      return {
        canvasWidth: this.MOBILE_CANVAS_WIDTH,
        canvasHeight: this.MOBILE_CANVAS_HEIGHT,
        tileSize: tileSize,
        gridOffsetX: centerX,
        gridOffsetY: padding,
        gridWidth: gridWidth,
        gridHeight: gridHeight,
        editorOffsetX: centerX,
        editorOffsetY: padding + gridHeight + 16,
        editorWidth: gridWidth,
        editorHeight: this.MOBILE_EDITOR_HEIGHT,
        editorPadding: this.MOBILE_EDITOR_PADDING,
        visibleLines: this.MOBILE_VISIBLE_LINES,
        isMobile: true
      };
    } else {
      return {
        canvasWidth: this.CANVAS_WIDTH,
        canvasHeight: this.CANVAS_HEIGHT,
        tileSize: this.TILE_SIZE,
        gridOffsetX: this.GRID_OFFSET_X,
        gridOffsetY: this.GRID_PADDING_TOP,
        gridWidth: this.GRID_COLS * this.TILE_SIZE,
        gridHeight: this.GRID_ROWS * this.TILE_SIZE,
        editorOffsetX: this.EDITOR_PADDING,
        editorOffsetY: this.EDITOR_PADDING,
        editorWidth: this.EDITOR_WIDTH - this.EDITOR_PADDING * 2,
        editorHeight: this.CONTENT_HEIGHT,
        editorPadding: this.EDITOR_PADDING,
        visibleLines: this.VISIBLE_LINES,
        isMobile: false
      };
    }
  }
};

Object.freeze(Config.COMMANDS);
Object.freeze(Config.CONDITIONS);
Object.freeze(Config.DIRECTIONS);
