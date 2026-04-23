/**
 * MotionSensor.js
 * DeviceOrientationEvent の薄いラッパー
 * - alpha / beta / gamma を { x, y, z } に読み替えてコールバックへ渡す
 * - iOS の requestPermission を担当
 * devicemotion（加速度）は扱わない
 */

export class MotionSensor {
  /**
   * @param {{ onOrientation: Function }} callbacks
   *   onOrientation({ x: beta, y: gamma, z: alpha })
   */
  constructor({ onOrientation }) {
    this._onOrientation = onOrientation;
    this._handler = this._handleOrientation.bind(this);
    this._running = false;
  }

  /**
   * iOS 13+ で必要な権限リクエスト
   * 他のブラウザでは即 true を返す
   * @returns {Promise<boolean>}
   */
  static async requestPermission() {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        const result = await DeviceOrientationEvent.requestPermission();
        return result === 'granted';
      } catch {
        return false;
      }
    }
    return true; // Android / desktop は権限不要
  }

  /**
   * センサー対応確認
   * @returns {boolean}
   */
  static isSupported() {
    return typeof DeviceOrientationEvent !== 'undefined';
  }

  start() {
    if (this._running) return;
    window.addEventListener('deviceorientation', this._handler);
    this._running = true;
  }

  stop() {
    window.removeEventListener('deviceorientation', this._handler);
    this._running = false;
  }

  get running() { return this._running; }

  // --- private ---

  _handleOrientation(event) {
    this._onOrientation({
      x: event.beta  ?? 0, // Pitch (-180〜180)
      y: event.gamma ?? 0, // Roll  (-90〜90)
      z: event.alpha ?? 0, // Yaw   (0〜360)
    });
  }
}
