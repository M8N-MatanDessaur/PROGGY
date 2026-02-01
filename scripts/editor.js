/**
 * PROGGY - Code Editor
 * Line-by-line code editing with commands and parameters
 */

const Editor = {
  /**
   * Move cursor up
   */
  cursorUp() {
    if (GameState.cursorLine > 0) {
      GameState.cursorLine--;
      this.updateScroll();
      Audio.play('click');
    }
  },

  /**
   * Move cursor down
   */
  cursorDown() {
    if (GameState.cursorLine < Config.CODE_LINES - 1) {
      GameState.cursorLine++;
      this.updateScroll();
      Audio.play('click');
    }
  },

  /**
   * Update scroll offset to keep cursor visible
   */
  updateScroll() {
    const line = GameState.cursorLine;
    const layout = Config.getLayout();
    const visibleLines = layout.visibleLines;
    const visibleStart = GameState.scrollOffset;
    const visibleEnd = visibleStart + visibleLines - 1;

    if (line < visibleStart) {
      GameState.scrollOffset = line;
    } else if (line > visibleEnd) {
      GameState.scrollOffset = line - visibleLines + 1;
    }
  },

  /**
   * Enter line edit mode
   */
  enterLineEdit() {
    GameState.editMode = 'line';
    Audio.play('click');
  },

  /**
   * Exit to browse mode
   */
  exitToBrowse() {
    GameState.editMode = 'browse';
    Audio.play('click');
  },

  /**
   * Enter parameter edit mode
   */
  enterParamEdit() {
    const line = GameState.code[GameState.cursorLine];
    const cmd = Config.COMMANDS[line.cmd];
    if (cmd.hasParam) {
      GameState.editMode = 'param';
      Audio.play('click');
    }
  },

  /**
   * Cycle command forward
   */
  cycleCommandForward() {
    const line = GameState.code[GameState.cursorLine];
    line.cmd = (line.cmd + 1) % Config.COMMANDS.length;

    // Reset param when changing command
    const cmd = Config.COMMANDS[line.cmd];
    if (cmd.hasParam) {
      line.param = 0;
    } else {
      line.param = 0;
    }
    Audio.play('click');
  },

  /**
   * Cycle command backward
   */
  cycleCommandBackward() {
    const line = GameState.code[GameState.cursorLine];
    line.cmd = (line.cmd - 1 + Config.COMMANDS.length) % Config.COMMANDS.length;

    // Reset param when changing command
    const cmd = Config.COMMANDS[line.cmd];
    if (cmd.hasParam) {
      line.param = 0;
    } else {
      line.param = 0;
    }
    Audio.play('click');
  },

  /**
   * Cycle parameter forward
   */
  cycleParamForward() {
    const line = GameState.code[GameState.cursorLine];
    const cmd = Config.COMMANDS[line.cmd];

    if (cmd.paramType === 'number') {
      const max = cmd.maxParam - cmd.minParam;
      line.param = (line.param + 1) % (max + 1);
    } else if (cmd.paramType === 'condition') {
      // Filter conditions based on command type
      const validConditions = Config.CONDITIONS.filter(c =>
        cmd.id === 8 ? c.forWhile : c.forIf
      );
      const currentIdx = validConditions.findIndex(c => c.id === line.param);
      const nextIdx = (currentIdx + 1) % validConditions.length;
      line.param = validConditions[nextIdx].id;
    }
    Audio.play('click');
  },

  /**
   * Cycle parameter backward
   */
  cycleParamBackward() {
    const line = GameState.code[GameState.cursorLine];
    const cmd = Config.COMMANDS[line.cmd];

    if (cmd.paramType === 'number') {
      const max = cmd.maxParam - cmd.minParam;
      line.param = (line.param - 1 + max + 1) % (max + 1);
    } else if (cmd.paramType === 'condition') {
      // Filter conditions based on command type
      const validConditions = Config.CONDITIONS.filter(c =>
        cmd.id === 8 ? c.forWhile : c.forIf
      );
      const currentIdx = validConditions.findIndex(c => c.id === line.param);
      const prevIdx = (currentIdx - 1 + validConditions.length) % validConditions.length;
      line.param = validConditions[prevIdx].id;
    }
    Audio.play('click');
  },

  /**
   * Increase indent
   */
  increaseIndent() {
    const line = GameState.code[GameState.cursorLine];
    if (line.indent < 4) {  // Max indent of 4
      line.indent++;
      Audio.play('click');
    }
  },

  /**
   * Decrease indent or clear line
   */
  decreaseIndent() {
    const line = GameState.code[GameState.cursorLine];
    if (line.indent > 0) {
      line.indent--;
      Audio.play('click');
    } else {
      // Clear line
      line.cmd = 0;
      line.param = 0;
      Audio.play('click');
    }
  },

  /**
   * Get display text for a command line
   */
  getLineDisplay(lineIndex) {
    const line = GameState.code[lineIndex];
    const cmd = Config.COMMANDS[line.cmd];

    if (cmd.id === 0) {
      return '---';
    }

    let text = cmd.name;

    if (cmd.hasParam) {
      if (cmd.paramType === 'number') {
        text += ' ' + (line.param + cmd.minParam);
      } else if (cmd.paramType === 'condition') {
        const condition = Config.CONDITIONS[line.param];
        text += ' ' + (condition ? condition.name : '?');
      }
    }

    return text;
  },

  /**
   * Get the parameter display for current edit
   */
  getParamDisplay(lineIndex) {
    const line = GameState.code[lineIndex];
    const cmd = Config.COMMANDS[line.cmd];

    if (!cmd.hasParam) return '';

    if (cmd.paramType === 'number') {
      return String(line.param + cmd.minParam);
    } else if (cmd.paramType === 'condition') {
      const condition = Config.CONDITIONS[line.param];
      return condition ? condition.name : '?';
    }

    return '';
  },

  /**
   * Switch focus to grid (start simulation)
   */
  switchToGrid() {
    // Validate code first
    const errors = Simulation.validateCode();
    if (errors.length > 0) {
      GameState.errorMessage = errors[0].message;
      GameState.errorTimer = Config.ERROR_DISPLAY_TIME;
      Audio.play('error');
      return false;
    }

    GameState.focusArea = 'grid';
    GameState.editMode = 'browse';

    // Reset simulation to start of current level (use stored level data)
    if (GameState.currentLevelData) {
      Simulation.init(GameState.currentLevelData);
    }

    Audio.play('start');
    return true;
  },

  /**
   * Switch focus back to code
   */
  switchToCode() {
    GameState.focusArea = 'code';
    Audio.play('click');
  },

  /**
   * Reset simulation to beginning (same level)
   */
  resetSimulation() {
    // Use stored level data, don't generate new one
    if (GameState.currentLevelData) {
      Simulation.init(GameState.currentLevelData);
    }
    GameState.focusArea = 'code';
  }
};
