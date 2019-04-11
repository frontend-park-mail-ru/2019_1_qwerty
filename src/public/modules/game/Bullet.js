import DynamicObject from './DynamicObject.js';

export default class Bullet extends DynamicObject {
    constructor (ctx, bullet) {
        super(ctx);
        this.radius = 0;
        this.x = bullet.x;
        this.y = bullet.y;
        this.radius = bullet.radius;
        this.draw = this.draw.bind(this);
    }

    /**
     * @private
     */
    draw () {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        console.log('bullet: ', this.x, this.y);
        ctx.fillStyle = 'red';
        ctx.closePath();
        ctx.fill();
    }

    setup () {
        // const ctx = this.ctx;

        // ctx.translate(this.x, this.y);
        // ctx.scale(this.radius, this.radius);
    }
};
