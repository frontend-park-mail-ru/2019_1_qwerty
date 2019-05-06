import DynamicObject from './DynamicObject.js';

export default class Meteor extends DynamicObject {
    constructor (ctx, params) {
        super(ctx);
        this.ctx = ctx;
        this.img = new Image();
        this.img.src = './images/meteor.png';
        this.x = params.x;
        this.y = params.y;
        this.width = 30;
        this.height = 25;
        this.body = this.img;
        this.linearSpeed = params.linearSpeed;
        this.rotationSpeed = params.rotationSpeed;
        // this.points = 15;
        this.hp = params.hp;
    }

    draw () {
        this.setup();
        this.ctx.drawImage(this.body, this.x, this.y, this.width, this.height);
    }

    setup () {
    }

    reduceHealth (damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.dead = true;
        }
    }
};
