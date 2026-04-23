/**
 * UIManager.js
 * DOM操作をすべてここに集約する
 * - ボタン・スライダーのイベント登録
 * - センサー値・ステータスの表示更新
 * センサーや計算クラスを直接知らない。コールバック経由で main.js と通信する
 */

export class UIManager {
  /**
   * @param {{
   *   onSelectSensor: Function,  // ('gyro' | 'orientation')
   *   onRequestPermission: Function,
   *   onStart: Function,
   *   onStop: Function,
   *   onReset: Function,
   * }} callbacks
   */
  constructor(callbacks) {
    this._cb = callbacks;
    this._els = {
      btnGyro:        document.getElementById('btn-gyro'),
      btnOrientation: document.getElementById('btn-orientation'),
      btnPermission:  document.getElementById('btn-permission'),
      btnStart:       document.getElementById('btn-start'),
      btnStop:        document.getElementById('btn-stop'),
      sensorStatus:   document.getElementById('sensor-status'),
      angleDisplay:   document.getElementById('angle-display'),
      apiSupport:     document.getElementById('api-support'),
    };
    this._bindEvents();
  }

  // --- 外部から呼ぶ表示更新 ---

  /**
   * ステータスメッセージを更新
   * @param {string} message
   * @param {'default'|'success'|'error'} type
   */
  setStatus(message, type = 'default') {
    const el = this._els.sensorStatus;
    el.textContent = message;
    el.className = 'status' + (type !== 'default' ? ` ${type}` : '');
  }

  /**
   * 角度表示を更新
   * @param {{ x: number, y: number, z: number }} angle - deg
   */
  setAngle({ x, y, z }) {
    this._els.angleDisplay.innerHTML =
      `<div style="font-size:10px;margin-bottom:3px">Current Angle:</div>` +
      `<div>X: ${x.toFixed(2)}° | Y: ${y.toFixed(2)}° | Z: ${z.toFixed(2)}°</div>`;
  }

  /**
   * API対応状況を表示
   * @param {{ [name: string]: boolean }} support
   */
  setApiSupport(support) {
    this._els.apiSupport.innerHTML = Object.entries(support)
      .map(([name, ok]) => `${name}: ${ok ? '✓' : '✗'}`)
      .join('<br>');
  }

  /**
   * 開始・停止ボタンの活性状態を切り替える
   * @param {boolean} running
   */
  setRunning(running) {
    this._els.btnStart.disabled =  running;
    this._els.btnStop.disabled  = !running;
  }

  /**
   * センサー選択ボタンのハイライトを切り替える
   * @param {'gyro'|'orientation'|null} type
   */
  setSelectedSensor(type) {
    this._els.btnGyro.style.opacity        = type === 'gyro'        ? '1' : '0.5';
    this._els.btnOrientation.style.opacity = type === 'orientation' ? '1' : '0.5';
    this._els.btnStart.disabled = !type;
  }

  // --- private ---

  _bindEvents() {
    this._els.btnGyro.addEventListener('click', () => {
      this._cb.onSelectSensor('gyro');
    });
    this._els.btnOrientation.addEventListener('click', () => {
      this._cb.onSelectSensor('orientation');
    });
    this._els.btnPermission.addEventListener('click', () => {
      this._cb.onRequestPermission();
    });
    this._els.btnStart.addEventListener('click', () => {
      this._cb.onStart();
    });
    this._els.btnStop.addEventListener('click', () => {
      this._cb.onStop();
    });
    document.getElementById('btn-reset')
      ?.addEventListener('click', () => this._cb.onReset());
  }
}
