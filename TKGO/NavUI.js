export class NavUIController {
    constructor(onUpdateCallback) {
        this.onUpdateCallback = onUpdateCallback;
        const inputs = ['posX' , 'posZ' , 'heading'].map(id => document.getElementById(id));
        inputs.forEach(input => {
            if (input) input.addEventListener('input', () => this.handleInput());
        });
    }
    handleInput() {
        const x = document.getElementById('posX').value;
        const z = document.getElementById('posZ').value;
        const heading = document.getElementById('heading').value;
        this.onUpdateCallback(x, z, heading);
    }
}