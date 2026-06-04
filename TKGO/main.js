//main.js
import { NavDataStore } from './NavDataStore.js';
import { NavUIController } from './NavUI.js';

import { initNavViewer, renderNavViewer } from './NavViewer.js';

window.addEventListener('DOMContentLoaded', () => {

    // Initialize the data
    const dataStore = new NavDataStore();

    // Initialize the renderer
    initNavViewer('canvas-container');

    //Initialize the UI
    const ui = new NavUIController((x, z, heading) => {
        dataStore.updateData(x, z, heading);
    });

    //animation loop
    function animate() {
        requestAnimationFrame(animate);

        //render the data
        renderNavViewer(dataStore);

    }
    animate();

})