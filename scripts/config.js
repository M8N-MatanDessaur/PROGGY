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
  VISIBLE_LINES: 9,  // Fits within content height with line spacing
  EDITOR_WIDTH: 240,  // Wider to accommodate indentation
  EDITOR_PADDING: 20,
  GRID_OFFSET_X: 290,  // Shifted right to make room for wider editor
  GRID_PADDING_TOP: 20,
  CONTENT_HEIGHT: 240,  // Same height for editor and grid (10 rows × 24px)

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
    { dx: 0, dy: -1 },  // Up
    { dx: 1, dy: 0 },   // Right
    { dx: 0, dy: 1 },   // Down
    { dx: -1, dy: 0 }   // Left
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
  CRANK_SENSITIVITY: 90,  // degrees per tick

  // Level count
  TOTAL_LEVELS: 20
};

Object.freeze(Config);
Object.freeze(Config.COMMANDS);
Object.freeze(Config.CONDITIONS);
Object.freeze(Config.DIRECTIONS);
