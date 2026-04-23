/**
 * RotationIntegrator.js
 * 角速度 (rad/s) を受け取り、角度 (deg) に積分する
 * センサーの種類を一切知らない純粋計算クラス
 */

import { ROTATION, CAMERA } from './config.js';

export class RotationIntegrator {
  constructor() {
    this.angle = { ...CAMERA.DEFAULT_ROTATION };
  }

  /**
   * 角速度を積分して現在の角度を返す
   * @param {{ x: number, y: number, z: number }} radPerSec - 角速度 (rad/s)
   * @param {number} deltaTime - 経過時間 (s)。省略時は 1/60 固定
   * @returns {{ x: number, y: number, z: number }} 角度 (deg)
   */
  update(radPerSec, deltaTime = ROTATION.DEFAULT_DELTA_TIME) {
    const toDeg = 180 / Math.PI;
    this.angle.x += radPerSec.x * toDeg * deltaTime;
    this.angle.y += radPerSec.y * toDeg * deltaTime;
    this.angle.z += radPerSec.z * toDeg * deltaTime;
    this._normalize();
    return { ...this.angle };
  }

  /**
   * DeviceOrientation から直接角度をセットする場合（積分不要なルート）
   * @param {{ x: number, y: number, z: number }} deg - 角度 (deg)
   * @returns {{ x: number, y: number, z: number }}
   */
  setFromOrientation(deg) {
    this.angle.x = deg.x ?? 0;
    this.angle.y = deg.y ?? 0;
    this.angle.z = deg.z ?? 0;
    return { ...this.angle };
  }

  reset() {
    this.angle = { ...CAMERA.DEFAULT_ROTATION };
  }

  // -180〜180 に収める
  _normalize() {
    for (const axis of ['x', 'y', 'z']) {
      while (this.angle[axis] >  180) this.angle[axis] -= 360;
      while (this.angle[axis] < -180) this.angle[axis] += 360;
    }
  }
}
