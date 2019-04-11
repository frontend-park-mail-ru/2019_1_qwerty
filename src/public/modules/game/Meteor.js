import DynamicObject from './DynamicObject.js';

export default class Meteor extends DynamicObject {
    constructor (params) {
        super();

        this.img = new Image();
        this.img.src = 'meteor.png';
        console.log('meteor img: ', this.img.src);
        this.x = 0;
        this.y = 0;
        this.width = 25;
        this.height = 25;
        this.body = this.img;
        this.linearSpeed = params.linearSpeed;
        this.rotationSpeed = params.rotationSpeed;
    }

    draw () {
        const ctx = this.ctx;
        ctx.drawImage(this.body, this.x, this.y, this.width, this.height);
    }

    setup () {

    }
};
