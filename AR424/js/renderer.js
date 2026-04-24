//AR424/js/renderer.js
document.addEventListener('DOMContentLoaded', () => {
  const statusEl = document.getElementById('status');
  const makerCountEl = document.getElementById('marker-count');
  console.log("initializing AR");

  // マーカーマップ読み込みテスト
  fetch('markers/cctag-markers.json')
    .then(response => response.json())
    .then(data => {
      console.log("MarkersMap Loaded:", data);
      statusEl.innerText = "Markers Loaded, Ready for Camera";
      initApp();
    })
    .catch(err => {
      console.error("Failed to load markerMaps:", err);
      statusEl.innerText = "Error loading config.";
    });

  function initApp() {
    console.log("App ready");
    
    // A-Frameのカメラエンティティを取得
    const cameraEl = document.querySelector('#main-camera');

    //描画ループ
    function render() {
      console.log("Current Rot:", rotation.y);
      //1, sensor-fusion.jsから回転データを取得
      if (window.sensorFusion) {
        const rotation = window.sensorFusion.getRotation();
        console.log(rotation.x)
        //2. A-Frameのカメラに適用
        cameraEl.setAttribute('rotation', {
          x: rotation.x,
          y: rotation.y,
          z: rotation.z
        });
      }

      //次のフレーム
      requestAnimationFrame(render);
    }

    //描画開始
    render();
  }
});
                 
