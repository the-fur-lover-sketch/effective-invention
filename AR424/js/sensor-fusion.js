

/**
 * sensor-fusion.js
 * 姿勢（Rotation）の状態管理と、入力（スライダー/センサー）の統合を行う
 */


class SensorFusion {
    constructor() {
        //現在の姿勢（Degrees)
        this.rotation = { x: 0, y: 0, z: 0 };

        //HTMLのスライダー要素
        this.sliders = {
            x: document.getElementById('debug-x'),
            y: document.getElementById('debug-y'),
            z: document.getElementById('debug-z')
        };

        this.init();
    }

    init() {
        //スライダーのイベントリスナー
        const updateFromSliders = () => {
            this.rotation.x = parseFloat(this.sliders.x.value);
            this.rotation.y = parseFloat(this.sliders.y.value);
            this.rotation.z = parseFloat(this.sliders.z.value);

            // console.log("Updated from sliders:", this.rotation);
        };
        
        
        if (this.sliders.x) {
            this.sliders.x.addEventListener('input', updateFromSliders);
            this.sliders.y.addEventListener('input', updateFromSliders);
            this.sliders.z.addEventListener('input', updateFromSliders);
        }

        //TODO: ジャイロスコープのリスナーもここで設定する
    }

    /**
     * 最新の回転データを取得
     * @returns {Object} {x, y, z}
     */
    getRotation() {
        return this.rotation;
    }
}

//renderer.jsからアクセスできるようにする
window.sensorFusion = new SensorFusion();