/**
 * main.js
 * エントリポイント
 * 各クラスをインスタンス化してコールバックで繋ぐ「配線係」
 * ビジネスロジックは持たない
 */

import { GyroscopeSensor }     from './GyroscopeSensor.js';
import { MotionSensor }        from './MotionSensor.js';
import { RotationIntegrator }  from './RotationIntegrator.js';
import { CameraController }    from './CameraController.js';
import { UIManager }           from './UIManager.js';

// --- インスタンス化 ---

const camera   = new CameraController(document.getElementById('sensor-camera'));
const rotation = new RotationIntegrator();

let currentSensor = null; // GyroscopeSensor | MotionSensor | null
let selectedType  = null; // 'gyro' | 'orientation' | null

// --- センサーインスタンスのファクトリ ---

function createGyroscope() {
  return new GyroscopeSensor({
    onReading: (raw) => {
      const angle = rotation.update(raw);
      ui.setAngle(angle);
      camera.setRotation(angle);
    },
    onError: (e) => ui.setStatus(`Gyroscope error: ${e.message}`, 'error'),
  });
}

function createMotionSensor() {
  return new MotionSensor({
    onOrientation: (deg) => {
      const angle = rotation.setFromOrientation(deg);
      ui.setAngle(angle);
      camera.setRotation(angle);
    },
  });
}

// --- UIManager（コールバックで main.js と通信） ---

const ui = new UIManager({
  onSelectSensor: (type) => {
    selectedType = type;
    ui.setSelectedSensor(type);
    ui.setStatus(`Sensor selected: ${type}`);
  },

  onRequestPermission: async () => {
    const granted = await MotionSensor.requestPermission();
    ui.setStatus(
      granted ? 'Permission granted ✓' : 'Permission denied ✗',
      granted ? 'success' : 'error',
    );
  },

  onStart: () => {
    if (!selectedType) return;
    currentSensor = selectedType === 'gyro'
      ? createGyroscope()
      : createMotionSensor();
    currentSensor.start();
    ui.setRunning(true);
    ui.setStatus(
      selectedType === 'gyro'
        ? 'Gyroscope running ✓'
        : 'Device Orientation running ✓',
      'success',
    );
  },

  onStop: () => {
    currentSensor?.stop();
    currentSensor = null;
    ui.setRunning(false);
    ui.setStatus('Stopped');
  },

  onReset: () => {
    rotation.reset();
    camera.reset();
    ui.setAngle({ x: 0, y: 0, z: 0 });
  },
});

// --- API 対応状況を初期表示 ---

ui.setApiSupport({
  Gyroscope:    GyroscopeSensor.isSupported(),
  DeviceOrient: MotionSensor.isSupported(),
  Permission:   typeof DeviceOrientationEvent?.requestPermission === 'function',
});
