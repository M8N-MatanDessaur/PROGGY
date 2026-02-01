/**
 * PROGGY - Audio System
 * Web Audio API synthesized sounds + MP3 playback
 */

const Audio = {
  ctx: null,
  initialized: false,

  // MP3 file players
  sounds: {
    startSound: null,
    track: null,
    pulse: null,
    enemyDeath: null
  },

  // Track if music is playing
  musicPlaying: false,

  /**
   * Initialize audio context (call on first user interaction)
   */
  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
      this._loadSounds();
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  },

  /**
   * Load MP3 sound files
   */
  _loadSounds() {
    this.sounds.startSound = new window.Audio('assets/startSound.mp3');
    this.sounds.startSound.volume = 0.5;

    this.sounds.track = new window.Audio('assets/track.mp3');
    this.sounds.track.volume = 0.3;
    this.sounds.track.loop = true;

    this.sounds.pulse = new window.Audio('assets/pulse.mp3');
    this.sounds.pulse.volume = 0.6;

    this.sounds.enemyDeath = new window.Audio('assets/enemyDeath.mp3');
    this.sounds.enemyDeath.volume = 0.5;
  },

  /**
   * Start background music
   */
  startMusic() {
    if (!this.initialized || this.musicPlaying) return;
    if (this.sounds.track) {
      this.sounds.track.currentTime = 0;
      this.sounds.track.play().catch(() => {});
      this.musicPlaying = true;
    }
  },

  /**
   * Stop background music
   */
  stopMusic() {
    if (this.sounds.track) {
      this.sounds.track.pause();
      this.sounds.track.currentTime = 0;
      this.musicPlaying = false;
    }
  },

  /**
   * Play a sound
   */
  play(type) {
    if (!this.ctx) return;

    // Resume context if suspended (browser policy)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    switch (type) {
      case 'click':
        this._playTone('square', 1200, 0.05, 0.1);
        break;

      case 'move':
        this._playTone('sine', 330, 0.1, 0.15);
        break;

      case 'turn':
        this._playTone('triangle', 440, 0.08, 0.12);
        break;

      case 'pulse':
        // Use MP3 if available - clone the audio for reliable playback
        if (this.sounds.pulse) {
          const pulseClone = this.sounds.pulse.cloneNode();
          pulseClone.volume = 0.6;
          pulseClone.play().catch(() => {});
        } else {
          this._playTone('sawtooth', 150, 0.15, 0.2);
        }
        break;

      case 'kill':
        // Use MP3 if available - clone for reliable playback
        if (this.sounds.enemyDeath) {
          const killClone = this.sounds.enemyDeath.cloneNode();
          killClone.volume = 0.5;
          killClone.play().catch(() => {});
        } else {
          this._playFrequencySlide('square', 80, 60, 0.2, 0.25);
        }
        break;

      case 'death':
        this._playNoise(100, 0.3);
        break;

      case 'success':
        this._playArpeggio([523, 659, 784], 'sine', 0.15, 0.1);
        break;

      case 'defend':
        this._playTone('square', 200, 0.08, 0.1);
        this._playTone('sawtooth', 300, 0.08, 0.1, 0.05);
        break;

      case 'start':
        // Just a simple click, track handles the music
        this._playTone('sine', 400, 0.1, 0.1);
        break;

      case 'error':
        this._playTone('sawtooth', 100, 0.15, 0.2);
        break;

      case 'levelup':
        this._playArpeggio([392, 494, 587, 784], 'triangle', 0.2, 0.1);
        break;

      case 'step':
        this._playTone('sine', 500, 0.03, 0.05);
        break;
    }
  },

  /**
   * Play a simple tone
   */
  _playTone(type, freq, duration, gain, delay = 0) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    const now = this.ctx.currentTime + delay;
    gainNode.gain.setValueAtTime(gain, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.start(now);
    osc.stop(now + duration);
  },

  /**
   * Play a frequency slide
   */
  _playFrequencySlide(type, startFreq, endFreq, duration, gain) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(endFreq, this.ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    const now = this.ctx.currentTime;
    gainNode.gain.setValueAtTime(gain, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.start(now);
    osc.stop(now + duration);
  },

  /**
   * Play an arpeggio (series of notes)
   */
  _playArpeggio(frequencies, type, duration, gain) {
    if (!this.ctx) return;

    frequencies.forEach((freq, i) => {
      this._playTone(type, freq, duration, gain, i * 0.08);
    });
  },

  /**
   * Play noise burst
   */
  _playNoise(freq, duration) {
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq, this.ctx.currentTime);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    noise.start();
    noise.stop(this.ctx.currentTime + duration);
  }
};
