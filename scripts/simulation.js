/**
 * PROGGY - Simulation Engine
 * Tick-based game simulation with history
 */

const Simulation = {
  /**
   * Initialize simulation for a level
   */
  init(level) {
    const parsed = Levels.parse(level);

    GameState.simulation = {
      level: parsed,
      player: {
        x: parsed.start.x,
        y: parsed.start.y,
        dir: parsed.start.dir,
        alive: true,
        pulses: parsed.pulses,
        defends: parsed.defends
      },
      enemies: JSON.parse(JSON.stringify(parsed.enemies)),
      ip: 0,  // instruction pointer
      executingLine: -1,
      stack: [],  // FOR/WHILE/IF context stack
      tick: 0,
      won: false,
      lost: false,
      done: false,
      hardEnemyPulseActive: false,
      playerPulseActive: false,
      playerDefendActive: false,
      playerMoved: false,  // Track if player moved this tick (for animation)
      animFrame: 0
    };

    GameState.history = [this.cloneState()];
    GameState.historyIndex = 0;
  },

  /**
   * Clone current simulation state
   */
  cloneState() {
    const sim = GameState.simulation;
    return {
      player: JSON.parse(JSON.stringify(sim.player)),
      enemies: JSON.parse(JSON.stringify(sim.enemies)),
      ip: sim.ip,
      executingLine: sim.executingLine,
      stack: JSON.parse(JSON.stringify(sim.stack)),
      tick: sim.tick,
      won: sim.won,
      lost: sim.lost,
      done: sim.done,
      hardEnemyPulseActive: sim.hardEnemyPulseActive,
      playerPulseActive: sim.playerPulseActive,
      playerDefendActive: sim.playerDefendActive,
      playerMoved: sim.playerMoved,
      animFrame: sim.animFrame
    };
  },

  /**
   * Restore state from history
   */
  restoreState(state) {
    const sim = GameState.simulation;
    sim.player = JSON.parse(JSON.stringify(state.player));
    sim.enemies = JSON.parse(JSON.stringify(state.enemies));
    sim.ip = state.ip;
    sim.executingLine = state.executingLine;
    sim.stack = JSON.parse(JSON.stringify(state.stack));
    sim.tick = state.tick;
    sim.won = state.won;
    sim.lost = state.lost;
    sim.done = state.done;
    sim.hardEnemyPulseActive = state.hardEnemyPulseActive;
    sim.playerPulseActive = state.playerPulseActive;
    sim.playerDefendActive = state.playerDefendActive;
    sim.playerMoved = state.playerMoved;
    sim.animFrame = state.animFrame;
  },

  /**
   * Execute one tick
   */
  tick() {
    const sim = GameState.simulation;
    if (sim.done) return;

    // Reset per-tick flags
    sim.hardEnemyPulseActive = false;
    sim.playerPulseActive = false;
    sim.playerDefendActive = false;
    sim.playerMoved = false;

    // Process control flow until we hit an action command
    const actionCmd = this.processControlFlow();
    if (actionCmd === null) {
      // Program ended
      sim.done = true;
      return;
    }

    // Execute action command
    this.executeAction(actionCmd);

    // Increment tick
    sim.tick++;
    sim.animFrame = (sim.animFrame + 1) % Config.SPRITE_FRAMES;

    // Move enemies
    this.moveEnemies();

    // Check hard enemy pulses
    this.checkHardEnemyPulse();

    // Check collision
    this.checkCollision();

    // Check win
    this.checkWin();

    // Save state to history
    GameState.history = GameState.history.slice(0, GameState.historyIndex + 1);
    GameState.history.push(this.cloneState());
    GameState.historyIndex = GameState.history.length - 1;
  },

  /**
   * Preview tick - advance time to see enemy movement without executing code
   * Used for scrubbing/previewing before writing code
   */
  previewTick() {
    const sim = GameState.simulation;
    if (!sim) return;

    // Reset per-tick flags
    sim.hardEnemyPulseActive = false;
    sim.playerPulseActive = false;
    sim.playerDefendActive = false;
    sim.playerMoved = false;

    // Increment tick
    sim.tick++;
    sim.animFrame = (sim.animFrame + 1) % Config.SPRITE_FRAMES;

    // Move enemies
    this.moveEnemies();

    // Check hard enemy pulses
    this.checkHardEnemyPulse();

    // Check collision with enemies
    this.checkCollision();

    // Save state to history
    GameState.history = GameState.history.slice(0, GameState.historyIndex + 1);
    GameState.history.push(this.cloneState());
    GameState.historyIndex = GameState.history.length - 1;
  },

  /**
   * Process control flow (FOR/WHILE/IF) until action command found
   */
  processControlFlow() {
    const sim = GameState.simulation;
    const code = GameState.code;
    let iterations = 0;
    const maxIterations = 1000;  // Prevent infinite loops

    while (iterations < maxIterations) {
      iterations++;

      // Check if we've reached the end
      if (sim.ip >= Config.CODE_LINES) {
        return null;
      }

      const line = code[sim.ip];
      const cmd = Config.COMMANDS[line.cmd];
      sim.executingLine = sim.ip;

      // NOP - skip
      if (cmd.id === 0) {
        sim.ip++;
        continue;
      }

      // Check if we're at the end of a block
      if (sim.stack.length > 0) {
        const topBlock = sim.stack[sim.stack.length - 1];

        // Check if current line is outside block (lower indent)
        if (line.indent <= topBlock.indent && sim.ip > topBlock.startLine) {
          // End of block
          if (topBlock.type === 'FOR') {
            topBlock.iteration++;
            if (topBlock.iteration < topBlock.count) {
              // Loop again
              sim.ip = topBlock.bodyStart;
              continue;
            } else {
              // FOR complete
              sim.stack.pop();
              continue;
            }
          } else if (topBlock.type === 'WHILE') {
            // Re-evaluate condition
            if (this.evaluateCondition(topBlock.condition)) {
              sim.ip = topBlock.bodyStart;
              continue;
            } else {
              sim.stack.pop();
              continue;
            }
          } else if (topBlock.type === 'IF') {
            // IF complete
            sim.stack.pop();
            continue;
          }
        }
      }

      // FOR
      if (cmd.id === 7) {
        const count = line.param + 1;  // param is 0-indexed
        const bodyStart = this.findBlockBody(sim.ip);
        if (bodyStart === -1) {
          sim.ip++;
          continue;
        }
        sim.stack.push({
          type: 'FOR',
          startLine: sim.ip,
          bodyStart: bodyStart,
          indent: line.indent,
          count: count,
          iteration: 0
        });
        sim.ip = bodyStart;
        continue;
      }

      // WHILE
      if (cmd.id === 8) {
        const condition = Config.CONDITIONS[line.param];
        if (!this.evaluateCondition(condition)) {
          // Skip block
          sim.ip = this.findBlockEnd(sim.ip);
          continue;
        }
        const bodyStart = this.findBlockBody(sim.ip);
        if (bodyStart === -1) {
          sim.ip++;
          continue;
        }
        sim.stack.push({
          type: 'WHILE',
          startLine: sim.ip,
          bodyStart: bodyStart,
          indent: line.indent,
          condition: condition
        });
        sim.ip = bodyStart;
        continue;
      }

      // IF
      if (cmd.id === 9) {
        const condition = Config.CONDITIONS[line.param];
        if (!this.evaluateCondition(condition)) {
          // Skip block
          sim.ip = this.findBlockEnd(sim.ip);
          continue;
        }
        const bodyStart = this.findBlockBody(sim.ip);
        if (bodyStart === -1) {
          sim.ip++;
          continue;
        }
        sim.stack.push({
          type: 'IF',
          startLine: sim.ip,
          bodyStart: bodyStart,
          indent: line.indent
        });
        sim.ip = bodyStart;
        continue;
      }

      // Action command found
      if (cmd.isTick) {
        return { line: sim.ip, cmd: cmd, codeLine: line };
      }

      sim.ip++;
    }

    // Max iterations reached - likely infinite loop
    return null;
  },

  /**
   * Find the first line of a block body (higher indent)
   */
  findBlockBody(startLine) {
    const code = GameState.code;
    const startIndent = code[startLine].indent;

    for (let i = startLine + 1; i < Config.CODE_LINES; i++) {
      if (code[i].cmd === 0) continue;  // Skip NOPs
      if (code[i].indent > startIndent) {
        return i;
      }
      return -1;  // Next non-NOP line is not indented
    }
    return -1;
  },

  /**
   * Find the end of a block (equal or lower indent)
   */
  findBlockEnd(startLine) {
    const code = GameState.code;
    const startIndent = code[startLine].indent;

    for (let i = startLine + 1; i < Config.CODE_LINES; i++) {
      if (code[i].cmd === 0) continue;
      if (code[i].indent <= startIndent) {
        return i;
      }
    }
    return Config.CODE_LINES;
  },

  /**
   * Evaluate a condition
   */
  evaluateCondition(condition) {
    const sim = GameState.simulation;
    const player = sim.player;
    const level = sim.level;

    // Helper to check if wall at position
    const hasWall = (x, y) => {
      if (x < 0 || x >= Config.GRID_COLS || y < 0 || y >= Config.GRID_ROWS) return true;
      return level.walls.some(w => w.x === x && w.y === y);
    };

    // Helper to check for enemy at position
    const hasEnemy = (x, y) => {
      return sim.enemies.some(e => e.alive && e.x === x && e.y === y);
    };

    // Get direction vectors
    const dir = Config.DIRECTIONS[player.dir];
    const aheadX = player.x + dir.dx;
    const aheadY = player.y + dir.dy;

    switch (condition.name) {
      case 'BLOCKED':
        return hasWall(aheadX, aheadY);
      case '!BLOCKED':
        return !hasWall(aheadX, aheadY);
      case 'U-WALL':
        return hasWall(player.x, player.y - 1);
      case 'D-WALL':
        return hasWall(player.x, player.y + 1);
      case 'L-WALL':
        return hasWall(player.x - 1, player.y);
      case 'R-WALL':
        return hasWall(player.x + 1, player.y);
      case '!U-WALL':
        return !hasWall(player.x, player.y - 1);
      case '!D-WALL':
        return !hasWall(player.x, player.y + 1);
      case '!L-WALL':
        return !hasWall(player.x - 1, player.y);
      case '!R-WALL':
        return !hasWall(player.x + 1, player.y);
      case 'ENEMY':
        return hasEnemy(player.x, player.y - 1) ||
               hasEnemy(player.x, player.y + 1) ||
               hasEnemy(player.x - 1, player.y) ||
               hasEnemy(player.x + 1, player.y);
      case '!ENEMY':
        return !(hasEnemy(player.x, player.y - 1) ||
                 hasEnemy(player.x, player.y + 1) ||
                 hasEnemy(player.x - 1, player.y) ||
                 hasEnemy(player.x + 1, player.y));
      case 'TRUE':
        return true;
      default:
        return false;
    }
  },

  /**
   * Execute an action command
   */
  executeAction(action) {
    const sim = GameState.simulation;
    const player = sim.player;
    const cmd = action.cmd;

    switch (cmd.id) {
      case 1:  // MOVE
        const dir = Config.DIRECTIONS[player.dir];
        const newX = player.x + dir.dx;
        const newY = player.y + dir.dy;

        // Check wall collision
        const hasWall = sim.level.walls.some(w => w.x === newX && w.y === newY);
        if (!hasWall && newX >= 0 && newX < Config.GRID_COLS && newY >= 0 && newY < Config.GRID_ROWS) {
          player.x = newX;
          player.y = newY;
          sim.playerMoved = true;
          Audio.play('move');
        }
        break;

      case 2:  // R-TURN
        player.dir = (player.dir + 1) % 4;
        Audio.play('turn');
        break;

      case 3:  // L-TURN
        player.dir = (player.dir + 3) % 4;
        Audio.play('turn');
        break;

      case 4:  // WAIT
        // Do nothing
        break;

      case 5:  // PULSE
        if (player.pulses > 0) {
          player.pulses--;
          sim.playerPulseActive = true;
          this.killAdjacentEnemies();
          Audio.play('pulse');

          // Visual effect
          GameState.pulseEffect = {
            x: player.x,
            y: player.y,
            size: 0,
            maxSize: Config.PULSE_MAX_SIZE
          };
          GameState.shakeTimer = Config.SHAKE_DURATION;
        }
        break;

      case 6:  // DEFEND
        if (player.defends > 0) {
          player.defends--;
          sim.playerDefendActive = true;
          Audio.play('defend');

          // Visual effect
          GameState.defendEffect = {
            timer: 20
          };
        }
        break;
    }

    // Advance instruction pointer
    sim.ip++;
  },

  /**
   * Kill soft enemies in cardinal directions
   */
  killAdjacentEnemies() {
    const sim = GameState.simulation;
    const player = sim.player;
    let killed = false;

    for (const enemy of sim.enemies) {
      if (!enemy.alive || enemy.type !== 'soft') continue;

      const dx = Math.abs(enemy.x - player.x);
      const dy = Math.abs(enemy.y - player.y);

      // Adjacent in cardinal direction
      if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        enemy.alive = false;
        killed = true;
      }
    }

    if (killed) {
      Audio.play('kill');
      Particles.spawn(player.x * Config.TILE_SIZE + Config.GRID_OFFSET_X + Config.TILE_SIZE / 2,
                      player.y * Config.TILE_SIZE + Config.TILE_SIZE / 2,
                      'kill');
    }
  },

  /**
   * Move enemies according to their patrol patterns
   */
  moveEnemies() {
    const sim = GameState.simulation;

    for (const enemy of sim.enemies) {
      if (!enemy.alive) continue;

      if (enemy.type === 'soft') {
        this.moveSoftEnemy(enemy);
      }
    }
  },

  /**
   * Move a soft enemy (patrol pattern)
   */
  moveSoftEnemy(enemy) {
    const sim = GameState.simulation;
    const level = sim.level;

    // Determine next position based on patrol axis
    let nextX = enemy.x;
    let nextY = enemy.y;

    if (enemy.patrolAxis === 'horizontal') {
      nextX += enemy.patrolDir;
    } else {
      nextY += enemy.patrolDir;
    }

    // Check if next position is blocked
    const hasWall = level.walls.some(w => w.x === nextX && w.y === nextY);
    const outOfBounds = nextX < 0 || nextX >= Config.GRID_COLS || nextY < 0 || nextY >= Config.GRID_ROWS;

    if (hasWall || outOfBounds) {
      // Reverse direction
      enemy.patrolDir = -enemy.patrolDir;
    } else {
      // Move
      enemy.x = nextX;
      enemy.y = nextY;
    }
  },

  /**
   * Check hard enemy pulse attacks
   */
  checkHardEnemyPulse() {
    const sim = GameState.simulation;
    const player = sim.player;

    // Hard enemies pulse every 2 ticks
    if (sim.tick % 2 !== 0) return;

    let anyHardEnemy = false;
    for (const enemy of sim.enemies) {
      if (!enemy.alive || enemy.type !== 'hard') continue;
      anyHardEnemy = true;
    }

    if (anyHardEnemy) {
      sim.hardEnemyPulseActive = true;
      Audio.play('pulse');
    }

    for (const enemy of sim.enemies) {
      if (!enemy.alive || enemy.type !== 'hard') continue;

      // Check if player is in cardinal direction
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;

      if ((Math.abs(dx) <= 1 && dy === 0) || (Math.abs(dy) <= 1 && dx === 0)) {
        if (!sim.playerDefendActive) {
          player.alive = false;
          sim.lost = true;
          sim.done = true;
          Audio.play('death');
          GameState.shakeTimer = Config.SHAKE_DURATION;
        }
      }
    }
  },

  /**
   * Check collision between player and enemies
   */
  checkCollision() {
    const sim = GameState.simulation;
    const player = sim.player;

    for (const enemy of sim.enemies) {
      if (!enemy.alive) continue;

      if (enemy.x === player.x && enemy.y === player.y) {
        player.alive = false;
        sim.lost = true;
        sim.done = true;
        Audio.play('death');
        GameState.shakeTimer = Config.SHAKE_DURATION;
        return;
      }
    }
  },

  /**
   * Check win condition
   */
  checkWin() {
    const sim = GameState.simulation;
    const player = sim.player;
    const exit = sim.level.exit;

    if (player.x === exit.x && player.y === exit.y) {
      sim.won = true;
      sim.done = true;
      Audio.play('success');
    }
  },

  /**
   * Scrub to a specific point in history
   */
  scrubTo(index) {
    if (index < 0) index = 0;
    if (index >= GameState.history.length) index = GameState.history.length - 1;

    GameState.historyIndex = index;
    this.restoreState(GameState.history[index]);
  },

  /**
   * Validate code for errors
   */
  validateCode() {
    const code = GameState.code;
    const errors = [];

    // Check for control structures without bodies
    for (let i = 0; i < Config.CODE_LINES; i++) {
      const line = code[i];
      const cmd = Config.COMMANDS[line.cmd];

      if (cmd.id >= 7 && cmd.id <= 9) {
        // FOR, WHILE, IF need body
        const bodyStart = this.findBlockBody(i);
        if (bodyStart === -1) {
          errors.push({
            line: i,
            message: `${cmd.name} needs a body (indent next line)`
          });
        }
      }

      // Check orphaned indented lines
      if (line.indent > 0 && line.cmd !== 0) {
        let hasParent = false;
        for (let j = i - 1; j >= 0; j--) {
          const parentLine = code[j];
          if (parentLine.cmd === 0) continue;
          if (parentLine.indent < line.indent) {
            const parentCmd = Config.COMMANDS[parentLine.cmd];
            if (parentCmd.id >= 7 && parentCmd.id <= 9) {
              hasParent = true;
            }
            break;
          }
        }
        if (!hasParent) {
          errors.push({
            line: i,
            message: 'Indented line has no parent block'
          });
        }
      }

      // Check IF with TRUE condition
      if (cmd.id === 9 && line.param === 12) {
        errors.push({
          line: i,
          message: 'IF cannot use TRUE condition'
        });
      }
    }

    return errors;
  }
};
