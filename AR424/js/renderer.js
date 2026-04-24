//AR424/js/renderer.js
document.addEventListener('DOMContentLoaded', () => {
  const statusEl = document.getElementById('status');
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
    //カメラの起動処理やcctag-detector.jsの呼び出し
    console.log("App ready")
  }
});
                 
