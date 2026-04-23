/**
 * main.js
 * エントリポイント + 実機デバッグ用ログ出力付き
 */

// --- デバッグ用ログ表示エリアの作成 ---
const debugEl = document.createElement('div');
debugEl.style = 'position:fixed; bottom:0; left:0; width:100%; height:120px; background:rgba(0,0,0,0.85); color:#0f0; font-family:monospace; font-size:10px; z-index:10001; pointer-events:none; padding:5px; overflow-y:auto; line-height:1.2; border-top:1px solid #0f0;';
document.body.appendChild(debugEl);

function log(msg) {
    const time = new Date().toLocaleTimeString().split(' ')[0];
    debugEl.innerHTML += `[${time}] ${msg}<br>`;
    debugEl.scrollTop = debugEl.scrollHeight;
    console.log(msg);
}

log("🚀 Script Start");

// 1. インポートのチェック
import { GyroscopeSensor }     from './GyroscopeSensor.js';
import { MotionSensor }        from './MotionSensor.js';
import { RotationIntegrator }  from './RotationIntegrator.js';
import { CameraController }    from './CameraController.js';
import { UIManager }           from './UIManager.js';

log("✅ Modules Imported");

// 2. DOM要素と初期化のチェック
let camera, rotation, ui;
try {
    const cameraEl = document.getElementById('sensor-camera');
    if (!cameraEl) throw new Error("A-Frame camera entity not found");
    
    camera = new CameraController(cameraEl);
    rotation = new RotationIntegrator();
    log("✅ Core Logic Ready");
} catch (e) {
    log(`❌ Init Error: ${e.message}`);
}

let currentSensor = null;
let selectedType  = null;

// --- センサーインスタンスのファクトリ ---
function createGyroscope() {
    log("Creating Gyroscope...");
    return new GyroscopeSensor({
        onReading: (raw) => {
            const angle = rotation.update(raw);
            ui.setAngle(angle);
            camera.setRotation(angle);
        },
        onError: (e) => {
            log(`❌ Gyro Error: ${e.message}`);
            ui.setStatus(`Gyro error: ${e.message}`, 'error');
        }
    });
}

function createMotionSensor() {
    log("Creating MotionSensor...");
    return new MotionSensor({
        onOrientation: (deg) => {
            const angle = rotation.setFromOrientation(deg);
            ui.setAngle(angle);
            camera.setRotation(angle);
        },
    });
}

// --- UIManager ---
try {
    ui = new UIManager({
        onSelectSensor: (type) => {
            log(`Selection: ${type}`);
            selectedType = type;
            ui.setSelectedSensor(type);
            ui.setStatus(`Sensor selected: ${type}`);
        },

        onRequestPermission: async () => {
            log("Attempting RequestPermission...");
            try {
                const granted = await MotionSensor.requestPermission();
                log(`Permission Result: ${granted}`);
                ui.setStatus(
                    granted ? 'Permission granted ✓' : 'Permission denied ✗',
                    granted ? 'success' : 'error'
                );
            } catch (e) {
                log(`❌ Permission Error: ${e.message}`);
            }
        },

        onStart: () => {
            log(`Start clicked: ${selectedType}`);
            if (!selectedType) return;
            try {
                currentSensor = selectedType === 'gyro' ? createGyroscope() : createMotionSensor();
                currentSensor.start();
                ui.setRunning(true);
                ui.setStatus(`${selectedType} running`, 'success');
                log("▶️ Sensor Started");
            } catch (e) {
                log(`❌ Start Error: ${e.message}`);
            }
        },

        onStop: () => {
            log("⏹️ Stop clicked");
            currentSensor?.stop();
            currentSensor = null;
            ui.setRunning(false);
            ui.setStatus('Stopped');
        },

        onReset: () => {
            log("🔄 Reset clicked");
            rotation.reset();
            camera.reset();
            ui.setAngle({ x: 0, y: 0, z: 0 });
        },
    });
    log("✅ UI Manager Ready");
} catch (e) {
    log(`❌ UI Init Error: ${e.message}`);
}

// --- API 対応状況の初期表示 ---
try {
    const support = {
        Gyroscope: typeof Gyroscope !== 'undefined',
        DeviceOrient: typeof DeviceOrientationEvent !== 'undefined',
        Permission: false
    };

    if (support.DeviceOrient && typeof DeviceOrientationEvent.requestPermission === 'function') {
        support.Permission = true;
    }

    ui.setApiSupport(support);
    log("📊 API Support list updated");
} catch (e) {
    log(`❌ Support Check Error: ${e.message}`);
}
