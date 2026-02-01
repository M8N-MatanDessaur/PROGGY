/**
 * PROGGY - Renderer
 * Canvas drawing for game and editor with sprite support
 */

const Renderer = {
  canvas: null,
  ctx: null,

  // Sprite images
  sprites: {
    player: null,
    softEnemy: null,
    hardEnemy: null
  },
  spritesLoaded: false,

  /**
   * Initialize canvas and load sprites
   */
  init() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    // Disable image smoothing for crisp pixel art
    this.ctx.imageSmoothingEnabled = false;

    // Load sprite images
    this.loadSprites();
  },

  /**
   * Load sprite images from assets
   */
  loadSprites() {
    let loaded = 0;
    const total = 3;

    const onLoad = () => {
      loaded++;
      if (loaded === total) {
        this.spritesLoaded = true;
      }
    };

    this.sprites.player = new Image();
    this.sprites.player.onload = onLoad;
    this.sprites.player.src = 'assets/player-table-8-8.png';

    this.sprites.softEnemy = new Image();
    this.sprites.softEnemy.onload = onLoad;
    this.sprites.softEnemy.src = 'assets/softEnemy-table-8-8.png';

    this.sprites.hardEnemy = new Image();
    this.sprites.hardEnemy.onload = onLoad;
    this.sprites.hardEnemy.src = 'assets/hardEnemy-table-8-8.png';
  },

  /**
   * Draw a sprite frame
   * Sprites are black on transparent - in light mode they show as black
   * In dark mode we need to invert them to show as white
   */
  drawSprite(sprite, frameIndex, x, y, flipH = false) {
    if (!sprite || !sprite.complete) return;

    const ctx = this.ctx;
    const size = Config.SPRITE_SIZE;
    const scale = Config.SPRITE_SCALE;
    const drawSize = size * scale;

    ctx.save();

    if (flipH) {
      ctx.translate(x + drawSize, y);
      ctx.scale(-1, 1);
      x = 0;
      y = 0;
    }

    // Apply light mode inversion - sprites are white, need to be black in light mode
    if (!GameState.isDark) {
      ctx.filter = 'invert(1)';
    }

    ctx.drawImage(
      sprite,
      frameIndex * size, 0,
      size, size,
      flipH ? 0 : x, flipH ? 0 : y,
      drawSize, drawSize
    );

    ctx.filter = 'none';
    ctx.restore();
  },

  /**
   * Draw pulse icon (X in square)
   */
  drawPulseIcon(x, y, size) {
    const ctx = this.ctx;
    const half = size / 2;

    ctx.strokeStyle = Theme.getINK();
    ctx.lineWidth = 2;

    // Square
    ctx.strokeRect(x - half, y - half, size, size);

    // X inside
    const inset = size * 0.2;
    ctx.beginPath();
    ctx.moveTo(x - half + inset, y - half + inset);
    ctx.lineTo(x + half - inset, y + half - inset);
    ctx.moveTo(x + half - inset, y - half + inset);
    ctx.lineTo(x - half + inset, y + half - inset);
    ctx.stroke();
  },

  /**
   * Draw death icon (X in circle - filled circle with X cutout)
   */
  drawDeathIcon(x, y, radius) {
    const ctx = this.ctx;

    // Filled circle
    ctx.fillStyle = Theme.getINK();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // X in contrasting color
    ctx.strokeStyle = Theme.getBG();
    ctx.lineWidth = 2;
    const inset = radius * 0.4;
    ctx.beginPath();
    ctx.moveTo(x - inset, y - inset);
    ctx.lineTo(x + inset, y + inset);
    ctx.moveTo(x + inset, y - inset);
    ctx.lineTo(x - inset, y + inset);
    ctx.stroke();
  },

  /**
   * Main draw function
   */
  draw() {
    const ctx = this.ctx;
    const canvas = this.canvas;

    // Apply shake effect
    let shakeX = 0, shakeY = 0;
    if (GameState.shakeTimer > 0) {
      shakeX = (Math.random() - 0.5) * Config.SHAKE_AMPLITUDE * 2;
      shakeY = (Math.random() - 0.5) * Config.SHAKE_AMPLITUDE * 2;
      GameState.shakeTimer--;
    }

    ctx.save();
    ctx.translate(shakeX, shakeY);

    // Clear background
    ctx.fillStyle = Theme.getBG();
    ctx.fillRect(-10, -10, canvas.width + 20, canvas.height + 20);

    // Draw based on game state
    // Title is handled by HTML overlay, so we just draw the game content
    if (GameState.status !== 'title') {
      this.drawEditor();
      this.drawGrid();
      this.drawHUD();
    }

    ctx.restore();

    // Draw particles (not affected by shake)
    Particles.draw(ctx);

    // Update effects
    this.updateEffects();
  },

  /**
   * Draw code editor panel
   */
  drawEditor() {
    const ctx = this.ctx;
    const code = GameState.code;
    const isFocused = GameState.focusArea === 'code';
    const padding = Config.EDITOR_PADDING;
    const editorHeight = Config.CONTENT_HEIGHT;

    // Editor background
    ctx.fillStyle = Theme.getBG();
    ctx.fillRect(padding, padding, Config.EDITOR_WIDTH - padding * 2, editorHeight);

    // Border
    ctx.strokeStyle = Theme.getINK();
    ctx.lineWidth = isFocused ? 3 : 1;
    ctx.strokeRect(padding, padding, Config.EDITOR_WIDTH - padding * 2, editorHeight);

    // Draw visible lines
    const startLine = GameState.scrollOffset;
    const lineHeight = 24;
    const paddingTop = padding + 12;  // Adjusted for better fit

    for (let i = 0; i < Config.VISIBLE_LINES; i++) {
      const lineIdx = startLine + i;
      if (lineIdx >= Config.CODE_LINES) break;

      const y = paddingTop + i * lineHeight;
      const line = code[lineIdx];
      const cmd = Config.COMMANDS[line.cmd];

      // Highlight current executing line
      const sim = GameState.simulation;
      if (sim && sim.executingLine === lineIdx && GameState.focusArea === 'grid') {
        ctx.fillStyle = Theme.getINK();
        ctx.fillRect(padding + 2, y - 2, Config.EDITOR_WIDTH - padding * 2 - 4, lineHeight);
        ctx.fillStyle = Theme.getBG();
      } else {
        ctx.fillStyle = Theme.getINK();
      }

      // Line number
      ctx.font = '400 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(String(lineIdx + 1).padStart(2, '0'), padding + 22, y + 12);

      // Indent visualization
      const indentWidth = 12;
      const indentX = padding + 28 + line.indent * indentWidth;

      // Cursor highlight
      if (isFocused && lineIdx === GameState.cursorLine) {
        const highlightColor = Theme.getINK();
        ctx.fillStyle = highlightColor;

        if (GameState.editMode === 'browse') {
          ctx.globalAlpha = 0.15;
          ctx.fillRect(padding + 26, y - 2, Config.EDITOR_WIDTH - padding * 2 - 28, lineHeight);
          ctx.globalAlpha = 1;
        } else if (GameState.editMode === 'line') {
          ctx.globalAlpha = 0.25;
          ctx.fillRect(indentX, y - 2, 60, lineHeight);
          ctx.globalAlpha = 1;
        } else if (GameState.editMode === 'param') {
          ctx.globalAlpha = 0.25;
          ctx.fillRect(indentX + 62, y - 2, 70, lineHeight);
          ctx.globalAlpha = 1;
        }
        ctx.fillStyle = Theme.getINK();
      }

      // Command text
      ctx.textAlign = 'left';
      ctx.font = cmd.id === 0 ? '400 11px "JetBrains Mono", monospace' : '700 11px "JetBrains Mono", monospace';

      if (sim && sim.executingLine === lineIdx && GameState.focusArea === 'grid') {
        ctx.fillStyle = Theme.getBG();
      }

      ctx.fillText(cmd.name, indentX + 2, y + 12);

      if (cmd.hasParam) {
        ctx.font = '400 11px "JetBrains Mono", monospace';
        const paramText = Editor.getParamDisplay(lineIdx);
        ctx.fillText(paramText, indentX + 64, y + 12);
      }

      // Loop iteration indicator
      if (sim && sim.stack.length > 0) {
        for (const block of sim.stack) {
          if (block.startLine === lineIdx && block.type === 'FOR') {
            ctx.font = '400 9px "JetBrains Mono", monospace';
            ctx.fillStyle = Theme.getMUTED();
            ctx.fillText(`[${block.iteration + 1}/${block.count}]`, indentX + 120, y + 12);
            break;
          }
        }
      }
    }

    // Scroll indicator
    if (Config.CODE_LINES > Config.VISIBLE_LINES) {
      const scrollY = (GameState.scrollOffset / (Config.CODE_LINES - Config.VISIBLE_LINES)) *
                      (editorHeight - 40) + padding + 20;
      ctx.fillStyle = Theme.getMUTED();
      ctx.fillRect(Config.EDITOR_WIDTH - padding - 4, scrollY - 10, 4, 20);
    }

    // Error message
    if (GameState.errorTimer > 0) {
      ctx.fillStyle = Theme.getINK();
      ctx.fillRect(padding, padding + editorHeight - 24, Config.EDITOR_WIDTH - padding * 2, 24);
      ctx.fillStyle = Theme.getBG();
      ctx.font = '700 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(GameState.errorMessage, Config.EDITOR_WIDTH / 2, padding + editorHeight - 8);
      GameState.errorTimer--;
    }
  },

  /**
   * Draw game grid
   */
  drawGrid() {
    const ctx = this.ctx;
    const sim = GameState.simulation;
    const isFocused = GameState.focusArea === 'grid';
    const offsetX = Config.GRID_OFFSET_X;
    const offsetY = Config.GRID_PADDING_TOP;
    const gridWidth = Config.GRID_COLS * Config.TILE_SIZE;
    const gridHeight = Config.GRID_ROWS * Config.TILE_SIZE;

    if (!sim) {
      ctx.strokeStyle = Theme.getFAINT();
      ctx.lineWidth = 1;
      ctx.strokeRect(offsetX, offsetY, gridWidth, gridHeight);
      return;
    }

    const level = sim.level;

    // Grid border
    ctx.strokeStyle = Theme.getINK();
    ctx.lineWidth = isFocused ? 3 : 1;
    ctx.strokeRect(offsetX, offsetY, gridWidth, gridHeight);

    // Grid lines
    ctx.strokeStyle = Theme.getFAINT();
    ctx.lineWidth = 1;
    for (let x = 1; x < Config.GRID_COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(offsetX + x * Config.TILE_SIZE, offsetY);
      ctx.lineTo(offsetX + x * Config.TILE_SIZE, offsetY + gridHeight);
      ctx.stroke();
    }
    for (let y = 1; y < Config.GRID_ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY + y * Config.TILE_SIZE);
      ctx.lineTo(offsetX + gridWidth, offsetY + y * Config.TILE_SIZE);
      ctx.stroke();
    }

    // Walls
    ctx.fillStyle = Theme.getINK();
    for (const wall of level.walls) {
      ctx.fillRect(
        offsetX + wall.x * Config.TILE_SIZE,
        offsetY + wall.y * Config.TILE_SIZE,
        Config.TILE_SIZE,
        Config.TILE_SIZE
      );
    }

    // Exit (door icon)
    const exit = level.exit;
    const exitX = offsetX + exit.x * Config.TILE_SIZE + 4;
    const exitY = offsetY + exit.y * Config.TILE_SIZE + 2;
    const doorW = Config.TILE_SIZE - 8;
    const doorH = Config.TILE_SIZE - 4;

    ctx.strokeStyle = Theme.getINK();
    ctx.fillStyle = Theme.getINK();
    ctx.lineWidth = 2;

    // Door frame
    ctx.strokeRect(exitX, exitY, doorW, doorH);

    // Door handle (small circle on right side)
    ctx.beginPath();
    ctx.arc(exitX + doorW - 4, exitY + doorH / 2, 2, 0, Math.PI * 2);
    ctx.fill();

    // Hard enemy pulse indicators (X in square)
    if (sim.tick % 2 === 0) {
      for (const enemy of sim.enemies) {
        if (!enemy.alive || enemy.type !== 'hard') continue;

        const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
        for (const [dx, dy] of dirs) {
          const px = enemy.x + dx;
          const py = enemy.y + dy;
          if (px >= 0 && px < Config.GRID_COLS && py >= 0 && py < Config.GRID_ROWS) {
            if (!level.walls.some(w => w.x === px && w.y === py)) {
              const cx = offsetX + px * Config.TILE_SIZE + Config.TILE_SIZE / 2;
              const cy = offsetY + py * Config.TILE_SIZE + Config.TILE_SIZE / 2;
              this.drawPulseIcon(cx, cy, 14);
            }
          }
        }
      }
    }

    // Enemies
    // Animation: 4 frames (0-3), oscillate for walking effect
    const spriteSize = Config.SPRITE_SIZE * Config.SPRITE_SCALE;
    const walkFrames = [0, 1, 0, 1];  // Oscillate between first two frames
    const animIndex = sim.tick % 4;

    for (const enemy of sim.enemies) {
      if (!enemy.alive) continue;

      const ex = offsetX + enemy.x * Config.TILE_SIZE + (Config.TILE_SIZE - spriteSize) / 2;
      const ey = offsetY + enemy.y * Config.TILE_SIZE + (Config.TILE_SIZE - spriteSize) / 2;
      const frame = walkFrames[animIndex];
      const flipH = enemy.patrolDir < 0;

      if (enemy.type === 'soft') {
        if (this.spritesLoaded) {
          this.drawSprite(this.sprites.softEnemy, frame, ex, ey, flipH);
        } else {
          ctx.strokeStyle = Theme.getINK();
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(ex + spriteSize / 2, ey + spriteSize / 2, 6, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else {
        if (this.spritesLoaded) {
          this.drawSprite(this.sprites.hardEnemy, frame, ex, ey, false);
        } else {
          ctx.fillStyle = Theme.getINK();
          ctx.beginPath();
          ctx.arc(ex + spriteSize / 2, ey + spriteSize / 2, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Player
    const px = offsetX + sim.player.x * Config.TILE_SIZE + (Config.TILE_SIZE - spriteSize) / 2;
    const py = offsetY + sim.player.y * Config.TILE_SIZE + (Config.TILE_SIZE - spriteSize) / 2;
    const playerCenterX = px + spriteSize / 2;
    const playerCenterY = py + spriteSize / 2;

    if (sim.player.alive) {
      // Defend effect
      if (sim.playerDefendActive || (GameState.defendEffect && GameState.defendEffect.timer > 0)) {
        ctx.strokeStyle = Theme.getINK();
        ctx.lineWidth = 2;
        const blink = Math.floor(Date.now() / 100) % 2;
        if (blink) {
          ctx.strokeRect(px - 2, py - 2, spriteSize + 4, spriteSize + 4);
        }
      }

      // Player sprite or fallback
      // Frame 0 = idle, Frames 1,2 = walk (oscillate)
      const playerWalkFrames = [1, 2, 1, 2];
      const playerFrame = sim.playerMoved ? playerWalkFrames[animIndex] : 0;
      const flipH = sim.player.dir === 3;

      if (this.spritesLoaded) {
        this.drawSprite(this.sprites.player, playerFrame, px, py, flipH);
      } else {
        ctx.fillStyle = Theme.getINK();
        ctx.save();
        ctx.translate(playerCenterX, playerCenterY);
        ctx.rotate(sim.player.dir * Math.PI / 2);
        ctx.fillRect(-6, -6, 12, 12);
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(-4, -6);
        ctx.lineTo(4, -6);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    } else {
      // Player is dead - draw death icon (X in circle)
      this.drawDeathIcon(playerCenterX, playerCenterY, 10);
    }

    // Pulse effect (X in square, expanding)
    if (GameState.pulseEffect) {
      const pe = GameState.pulseEffect;
      const pcx = offsetX + pe.x * Config.TILE_SIZE + Config.TILE_SIZE / 2;
      const pcy = offsetY + pe.y * Config.TILE_SIZE + Config.TILE_SIZE / 2;

      this.drawPulseIcon(pcx, pcy, pe.size);

      pe.size += Config.PULSE_EXPAND_RATE;
      if (pe.size >= pe.maxSize) {
        GameState.pulseEffect = null;
      }
    }
  },

  /**
   * Draw HUD (minimal - stats are in side panels)
   */
  drawHUD() {
    // HUD elements moved to side panels - keeping this minimal
    // Could add additional in-canvas feedback here if needed
  },

  /**
   * Update visual effects
   */
  updateEffects() {
    if (GameState.defendEffect && GameState.defendEffect.timer > 0) {
      GameState.defendEffect.timer--;
      if (GameState.defendEffect.timer <= 0) {
        GameState.defendEffect = null;
      }
    }
    Particles.update();
  }
};
