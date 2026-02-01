/**
 * PROGGY - Level Definitions
 * 20 hand-crafted puzzle levels + random generator
 */

const Levels = {
  /**
   * All level definitions
   * Grid: 0=empty, 1=wall, 2=soft enemy, 3=hard enemy, 4=start, 9=exit
   */
  data: [
    // Level 1: First Step
    {
      id: 1,
      name: 'First Step',
      pulses: 0,
      defends: 0,
      grid: [
        '11111111',
        '10000001',
        '10000001',
        '10000001',
        '14000091',
        '10000001',
        '10000001',
        '10000001',
        '10000001',
        '11111111'
      ]
    },
    // Level 2: Turn Right
    {
      id: 2,
      name: 'Turn Right',
      pulses: 0,
      defends: 0,
      grid: [
        '11111111',
        '10000001',
        '10000001',
        '10000091',
        '10000011',
        '10000011',
        '14000011',
        '10000011',
        '10000001',
        '11111111'
      ]
    },
    // Level 3: L-Shape
    {
      id: 3,
      name: 'L-Shape',
      pulses: 0,
      defends: 0,
      grid: [
        '11111111',
        '10000001',
        '10111101',
        '10100001',
        '10100091',
        '10111111',
        '14000001',
        '11110001',
        '10000001',
        '11111111'
      ]
    },
    // Level 4: Three Steps
    {
      id: 4,
      name: 'Three Steps',
      pulses: 0,
      defends: 0,
      grid: [
        '11111111',
        '10000001',
        '10111111',
        '10000001',
        '11111101',
        '10000001',
        '10111111',
        '14000091',
        '10000001',
        '11111111'
      ]
    },
    // Level 5: Spiral
    {
      id: 5,
      name: 'Spiral',
      pulses: 0,
      defends: 0,
      grid: [
        '11111111',
        '14000001',
        '11111101',
        '10000001',
        '10111101',
        '10100001',
        '10100001',
        '10111101',
        '10000091',
        '11111111'
      ]
    },
    // Level 6: Wall Follower
    {
      id: 6,
      name: 'Wall Follower',
      pulses: 0,
      defends: 0,
      grid: [
        '11111111',
        '10000001',
        '10111001',
        '10101001',
        '10101001',
        '14101091',
        '10101001',
        '10100001',
        '10000001',
        '11111111'
      ]
    },
    // Level 7: First Blood
    {
      id: 7,
      name: 'First Blood',
      pulses: 1,
      defends: 0,
      grid: [
        '11111111',
        '10000001',
        '10000001',
        '10000001',
        '14020091',
        '10000001',
        '10000001',
        '10000001',
        '10000001',
        '11111111'
      ]
    },
    // Level 8: Cluster
    {
      id: 8,
      name: 'Cluster',
      pulses: 1,
      defends: 0,
      grid: [
        '11111111',
        '10000001',
        '10020001',
        '10000001',
        '14020091',
        '10000001',
        '10020001',
        '10000001',
        '10000001',
        '11111111'
      ]
    },
    // Level 9: Hard Pass
    {
      id: 9,
      name: 'Hard Pass',
      pulses: 0,
      defends: 0,
      grid: [
        '11111111',
        '10000001',
        '10000001',
        '10000001',
        '14030091',
        '10000001',
        '10000001',
        '10000001',
        '10000001',
        '11111111'
      ]
    },
    // Level 10: Choose Wisely
    {
      id: 10,
      name: 'Choose Wisely',
      pulses: 2,
      defends: 2,
      grid: [
        '11111111',
        '10000001',
        '10200301',
        '10111101',
        '14000001',
        '10111101',
        '10200301',
        '10000091',
        '10000001',
        '11111111'
      ]
    },
    // Level 11: Zigzag
    {
      id: 11,
      name: 'Zigzag',
      pulses: 0,
      defends: 0,
      grid: [
        '11111111',
        '14000011',
        '11110011',
        '10000011',
        '10111111',
        '10000011',
        '11110011',
        '10000011',
        '10000091',
        '11111111'
      ]
    },
    // Level 12: Guard Patrol
    {
      id: 12,
      name: 'Guard Patrol',
      pulses: 2,
      defends: 0,
      grid: [
        '11111111',
        '10000001',
        '10200201',
        '10111101',
        '14000001',
        '10111101',
        '10200201',
        '10000091',
        '10000001',
        '11111111'
      ]
    },
    // Level 13: Timing
    {
      id: 13,
      name: 'Timing',
      pulses: 0,
      defends: 2,
      grid: [
        '11111111',
        '10000001',
        '10030001',
        '10111101',
        '14000001',
        '10111101',
        '10030001',
        '10000091',
        '10000001',
        '11111111'
      ]
    },
    // Level 14: Maze Runner
    {
      id: 14,
      name: 'Maze Runner',
      pulses: 0,
      defends: 0,
      grid: [
        '11111111',
        '14010001',
        '10010101',
        '10010101',
        '10010101',
        '10010101',
        '10010101',
        '10000101',
        '10000091',
        '11111111'
      ]
    },
    // Level 15: Double Trouble
    {
      id: 15,
      name: 'Double Trouble',
      pulses: 2,
      defends: 2,
      grid: [
        '11111111',
        '10000001',
        '10230001',
        '10111101',
        '14000001',
        '10111101',
        '10032001',
        '10000091',
        '10000001',
        '11111111'
      ]
    },
    // Level 16: The Gauntlet
    {
      id: 16,
      name: 'The Gauntlet',
      pulses: 3,
      defends: 1,
      grid: [
        '11111111',
        '14020001',
        '11110201',
        '10000201',
        '10203001',
        '10201111',
        '10200001',
        '10200001',
        '10000091',
        '11111111'
      ]
    },
    // Level 17: Crossroads
    {
      id: 17,
      name: 'Crossroads',
      pulses: 1,
      defends: 1,
      grid: [
        '11111111',
        '10001001',
        '10001001',
        '10001001',
        '14020091',
        '10031001',
        '10001001',
        '10001001',
        '10000001',
        '11111111'
      ]
    },
    // Level 18: Patience
    {
      id: 18,
      name: 'Patience',
      pulses: 0,
      defends: 4,
      grid: [
        '11111111',
        '14000001',
        '10300301',
        '10111101',
        '10000001',
        '10111101',
        '10300301',
        '10000091',
        '10000001',
        '11111111'
      ]
    },
    // Level 19: Labyrinth
    {
      id: 19,
      name: 'Labyrinth',
      pulses: 2,
      defends: 2,
      grid: [
        '11111111',
        '14010001',
        '10010101',
        '10210101',
        '10010301',
        '10012101',
        '10010101',
        '10030101',
        '10000091',
        '11111111'
      ]
    },
    // Level 20: Final Challenge
    {
      id: 20,
      name: 'Final Challenge',
      pulses: 3,
      defends: 3,
      grid: [
        '11111111',
        '14020301',
        '10111101',
        '10200001',
        '10113101',
        '10002001',
        '10111101',
        '10302001',
        '10000091',
        '11111111'
      ]
    }
  ],

  /**
   * Get level by ID
   */
  get(id) {
    return this.data.find(l => l.id === id) || this.data[0];
  },

  /**
   * Parse grid string into game objects
   */
  parse(level) {
    const result = {
      id: level.id,
      name: level.name,
      pulses: level.pulses,
      defends: level.defends,
      walls: [],
      enemies: [],
      start: { x: 0, y: 0, dir: 1 },  // Default facing right
      exit: { x: 0, y: 0 }
    };

    for (let y = 0; y < level.grid.length; y++) {
      const row = level.grid[y];
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        switch (cell) {
          case '1':
            result.walls.push({ x, y });
            break;
          case '2':
            result.enemies.push({ type: 'soft', x, y, dir: 1, alive: true });
            break;
          case '3':
            result.enemies.push({ type: 'hard', x, y, dir: 1, alive: true });
            break;
          case '4':
            result.start = { x, y, dir: 1 };
            break;
          case '9':
            result.exit = { x, y };
            break;
        }
      }
    }

    // Determine patrol axis for soft enemies
    result.enemies.forEach(enemy => {
      if (enemy.type === 'soft') {
        enemy.patrolAxis = this.determinePatrolAxis(result.walls, enemy.x, enemy.y);
        enemy.patrolDir = 1;
        enemy.originX = enemy.x;
        enemy.originY = enemy.y;
      }
    });

    return result;
  },

  /**
   * Determine patrol axis based on surrounding walls
   */
  determinePatrolAxis(walls, x, y) {
    const hasWallUp = walls.some(w => w.x === x && w.y === y - 1);
    const hasWallDown = walls.some(w => w.x === x && w.y === y + 1);
    const hasWallLeft = walls.some(w => w.x === x - 1 && w.y === y);
    const hasWallRight = walls.some(w => w.x === x + 1 && w.y === y);

    if (hasWallUp || hasWallDown) {
      return 'horizontal';
    }
    if (hasWallLeft || hasWallRight) {
      return 'vertical';
    }
    return 'horizontal';  // Default
  },

  /**
   * Generate a random level
   */
  generateRandom() {
    const grid = [];

    // Initialize with walls around edges
    for (let y = 0; y < Config.GRID_ROWS; y++) {
      let row = '';
      for (let x = 0; x < Config.GRID_COLS; x++) {
        if (x === 0 || x === Config.GRID_COLS - 1 || y === 0 || y === Config.GRID_ROWS - 1) {
          row += '1';
        } else {
          row += '0';
        }
      }
      grid.push(row);
    }

    // Random walk to create path
    let cx = 1;
    let cy = Config.GRID_ROWS - 2;
    const path = [{ x: cx, y: cy }];
    const steps = 25 + Math.floor(Math.random() * 20);

    for (let i = 0; i < steps; i++) {
      const dirs = [];
      if (cx > 1) dirs.push({ dx: -1, dy: 0 });
      if (cx < Config.GRID_COLS - 2) dirs.push({ dx: 1, dy: 0 });
      if (cy > 1) dirs.push({ dx: 0, dy: -1 });
      if (cy < Config.GRID_ROWS - 2) dirs.push({ dx: 0, dy: 1 });

      if (dirs.length === 0) break;

      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      cx += dir.dx;
      cy += dir.dy;
      path.push({ x: cx, y: cy });
    }

    // Add some branches
    const branches = 3 + Math.floor(Math.random() * 5);
    for (let b = 0; b < branches; b++) {
      const startIdx = Math.floor(Math.random() * path.length);
      let bx = path[startIdx].x;
      let by = path[startIdx].y;
      const branchLen = 3 + Math.floor(Math.random() * 5);

      for (let i = 0; i < branchLen; i++) {
        const dirs = [];
        if (bx > 1) dirs.push({ dx: -1, dy: 0 });
        if (bx < Config.GRID_COLS - 2) dirs.push({ dx: 1, dy: 0 });
        if (by > 1) dirs.push({ dx: 0, dy: -1 });
        if (by < Config.GRID_ROWS - 2) dirs.push({ dx: 0, dy: 1 });

        if (dirs.length === 0) break;

        const dir = dirs[Math.floor(Math.random() * dirs.length)];
        bx += dir.dx;
        by += dir.dy;
        path.push({ x: bx, y: by });
      }
    }

    // Fill grid with walls, then carve path
    for (let y = 1; y < Config.GRID_ROWS - 1; y++) {
      let row = '1';
      for (let x = 1; x < Config.GRID_COLS - 1; x++) {
        if (path.some(p => p.x === x && p.y === y)) {
          row += '0';
        } else {
          row += '1';
        }
      }
      row += '1';
      grid[y] = row;
    }

    // Place start
    const startPos = path[0];
    grid[startPos.y] = grid[startPos.y].substring(0, startPos.x) + '4' + grid[startPos.y].substring(startPos.x + 1);

    // Place exit (far from start)
    let exitPos = path[path.length - 1];
    let maxDist = 0;
    for (const p of path) {
      const dist = Math.abs(p.x - startPos.x) + Math.abs(p.y - startPos.y);
      if (dist > maxDist) {
        maxDist = dist;
        exitPos = p;
      }
    }
    if (exitPos.x === startPos.x && exitPos.y === startPos.y) {
      exitPos = path[Math.floor(path.length / 2)];
    }
    grid[exitPos.y] = grid[exitPos.y].substring(0, exitPos.x) + '9' + grid[exitPos.y].substring(exitPos.x + 1);

    // Place enemies
    const enemyCount = 1 + Math.floor(Math.random() * 3);
    let hardCount = 0;
    const usedPositions = [startPos, exitPos];

    for (let e = 0; e < enemyCount; e++) {
      // Find valid position
      const candidates = path.filter(p => {
        if (p.x === startPos.x && p.y === startPos.y) return false;
        if (p.x === exitPos.x && p.y === exitPos.y) return false;
        if (usedPositions.some(u => Math.abs(u.x - p.x) + Math.abs(u.y - p.y) < 3)) return false;
        return true;
      });

      if (candidates.length === 0) continue;

      const pos = candidates[Math.floor(Math.random() * candidates.length)];
      usedPositions.push(pos);

      // Determine enemy type
      let enemyType = '2';  // soft
      if (hardCount < 2 && Math.random() < 0.3) {
        enemyType = '3';  // hard
        hardCount++;
      }

      grid[pos.y] = grid[pos.y].substring(0, pos.x) + enemyType + grid[pos.y].substring(pos.x + 1);
    }

    // Count enemies to determine resources
    let softEnemies = 0;
    let hardEnemies = 0;
    for (const row of grid) {
      for (const cell of row) {
        if (cell === '2') softEnemies++;
        if (cell === '3') hardEnemies++;
      }
    }

    return {
      id: 0,
      name: 'Random',
      pulses: softEnemies,
      defends: hardEnemies * 2,
      grid: grid
    };
  }
};
