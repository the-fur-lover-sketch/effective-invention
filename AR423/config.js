/**
 * config.js
 * アプリ全体で使う定数・デフォルト値
 * 数値を変えたいときはここだけ触る
 */

export const SENSOR = {
  GYROSCOPE_FREQUENCY: 60,   // Hz
};

export const ROTATION = {
  DEFAULT_DELTA_TIME: 1 / 60, // Gyroscope用固定値 (s)
};

export const POSITION = {
  DEADZONE:      0.5,   // m/s² — これ未満の加速度は無視
  ACCEL_SCALE:   1.0,   // 加速度の感度倍率
  VELOCITY_DECAY: 0.9,  // フレームごとの速度減衰（ドリフト抑制）
  LIMIT:         10,    // 移動できる最大距離 (m)
  MIN_Z:         0.5,   // カメラのZ最小値
  DEFAULT_Z:     3.0,   // 初期Z位置
};

export const CAMERA = {
  DEFAULT_POSITION: { x: 0, y: 0, z: POSITION.DEFAULT_Z },
  DEFAULT_ROTATION: { x: 0, y: 0, z: 0 },
};
