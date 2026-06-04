export class NavDataStore {
    constructor() {
        this.position = { x: 0, y: 0, z: -5 };
        this.heading = 0;
    }
    updateData(x, z, heading) {
        this.position.x = parseFloat(x) || 0;
        this.position.z = parseFloat(z) || 0;
        this.heading = parseFloat(heading) || 0;
    }
    getHeadingRadians() {
        return (this.heading * Math.PI)/ 180;
    }
}