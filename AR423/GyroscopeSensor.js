/**
 * GyroscopeSensor.js
 * Generic Sensor API の Gyroscope ラッパー
 * - x/y/z (rad/s) をそのままコールバックへ渡す
 * - rad→deg 変換・積分は RotationIntegrator に委ねる
 */

import { SENSOR } from './config.js';

export class GyroscopeSensor {
  /**
   * @param {{ onReading: Function, onError?: Function }} callbacks
   *   onReading({ x, y, z })  単位: rad/s
   *   onError(error)
   */
  constructor({ onReading, onError }) {
    this._onReading = onReading;
    this._onError   = onError ?? ((e) => console.error('GyroscopeSensor:', e));
    this._sensor    = null;
    this._running   = false;
  }

  /**
   * Gyroscope API の対応確認
   * @returns {boolean}
   */
  static isSupported() {
    return typeof Gyroscope !== 'undefined';
  }

  start() {
    if (this._running) return;
    if (!GyroscopeSensor.isSupported()) {
      this._onError(new Error('Gyroscope is not supported on this device'));
      return;
    }

    try {
      this._sensor = new Gyroscope({ frequency: SENSOR.GYROSCOPE_FREQUENCY });

      this._sensor.addEventListener('reading', () => {
        this._onReading({
          x: this._sensor.x,
          y: this._sensor.y,
          z: this._sensor.z,
        });
      });

      this._sensor.addEventListener('error', (event) => {
        this._onError(event.error);
      });

      this._sensor.start();
      this._running = true;
    } catch (e) {
      this._onError(e);
    }
  }

  stop() {
    this._sensor?.stop();
    this._sensor = null;
    this._running = false;
  }

  get running() { return this._running; }
}は
