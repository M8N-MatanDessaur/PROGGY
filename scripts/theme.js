/**
 * PROGGY - Theme System
 * Light/dark mode management
 */

const Theme = {
  /**
   * Get current ink color
   */
  getINK() {
    return GameState.isDark ? '#f4f1eb' : '#1a1a1a';
  },

  /**
   * Get current background color
   */
  getBG() {
    return GameState.isDark ? '#1a1a1a' : '#f4f1eb';
  },

  /**
   * Get muted color
   */
  getMUTED() {
    return '#888';
  },

  /**
   * Get faint color
   */
  getFAINT() {
    return GameState.isDark ? '#333' : '#ddd';
  },

  /**
   * Get secondary faint color
   */
  getFAINT2() {
    return GameState.isDark ? '#2a2a2a' : '#e5e5e5';
  },

  /**
   * Apply current theme to document
   */
  apply() {
    document.documentElement.setAttribute(
      'data-theme',
      GameState.isDark ? 'dark' : 'light'
    );

    // Update theme-color meta tag
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', this.getBG());
    }
  },

  /**
   * Toggle between light and dark themes
   */
  toggle() {
    GameState.isDark = !GameState.isDark;
    localStorage.setItem('proggy-theme', GameState.isDark ? 'dark' : 'light');
    this.apply();
    Audio.play('click');
  }
};
