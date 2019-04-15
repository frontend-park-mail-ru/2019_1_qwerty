import DynamicObject from './DynamicObject.js';

export default class Text extends DynamicObject {
    constructor (ctx, data) {
        super(ctx);
        this.text = data.text;
        this.x = data.x;
        this.y = data.y;

        this.draw = this.draw.bind(this);
    }

    /**
     * @private
     */
    draw () {
        this.setup();
        this.ctx.fillText(this.text, this.x, this.y);
    }

    setup () {
        this.ctx.font = '25px Pixel';
        this.ctx.fillStyle = 'red';
        this.ctx.textAlign = 'center';
    }
};
