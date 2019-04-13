import DynamicObject from './DynamicObject.js';

export default class Meteor extends DynamicObject {
    constructor (ctx, params) {
        super(ctx);
        this.ctx = ctx;
        this.img = new Image();
        this.img.src = 'meteor.png';
        this.x = 0;
        this.y = 0;
        this.width = 30;
        this.height = 25;
        this.body = this.img;
        this.linearSpeed = params.linearSpeed;
        this.rotationSpeed = params.rotationSpeed;
        this.points = 15;
    }

    draw () {
        this.ctx.drawImage(this.body, this.x, this.y, this.width, this.height);
    }

    setup () {

    }
};
