import DynamicObject from './DynamicObject.js';

export default class Player extends DynamicObject {
    constructor (ctx) {
        super(ctx);

        this.img = new Image();
        this.img.src = './images/ship.png';

        this.body = this.img;
        this.width = 20;
        this.height = 20;
    }

    /**
     * @private
     */
    draw () {
        const ctx = this.ctx;
        ctx.drawImage(this.body, this.x, this.y, this.width, this.height);
    }

    setup () {

    }
};
