/**
 * CameraController.js
 * A-Frame カメラエンティティへの薄いラッパー
 * position / rotation の setAttribute だけに責務を限定する
 * A-Frame への依存はこのファイルだけに閉じ込める
 */

import { CAMERA } from './config.js';

export class CameraController {
  /**
   * @param {HTMLElement} el - A-Frame の camera エンティティ
   */
  constructor(el) {
    this._el = el;
    this._position = { ...CAMERA.DEFAULT_POSITION };
    this._rotation = { ...CAMERA.DEFAULT_ROTATION };
    this._apply();
  }

  /**
   * 回転をセットする
   * @param {{ x: number, y: number, z: number }} deg - 角度 (deg)
   */
  setRotation({ x, y, z }) {
    this._rotation = { x, y, z };
    this._applyRotation();
  }

  /**
   * カメラをデフォルト状態に戻す
   */
  reset() {
    this._position = { ...CAMERA.DEFAULT_POSITION };
    this._rotation = { ...CAMERA.DEFAULT_ROTATION };
    this._apply();
  }

  get position() { return { ...this._position }; }
  get rotation() { return { ...this._rotation }; }

  // --- private ---

  _apply() {
    this._applyPosition();
    this._applyRotation();
  }

  _applyPosition() {
    const { x, y, z } = this._position;
    this._el.setAttribute('position', `${x} ${y} ${z}`);
  }

  _applyRotation() {
    const { x, y, z } = this._rotation;
    this._el.setAttribute('rotation', `${x} ${y} ${z}`);
  }
}
