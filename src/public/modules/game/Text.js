import DynamicObject from './DynamicObject.js';

export default class Text extends DynamicObject {
    constructor (ctx, data) {
        super(ctx);
        this.text = data.text;
        this.x = data.x;
        this.y = data.y;
        this.lineHeight = 20;
        this.draw = this.draw.bind(this);
    }

    /**
     * @private
     */
    draw () {
        this.setup();
        let lines = this.text.split('\n');
        for (var i = 0; i < lines.length; i++) {
            this.ctx.fillText(lines[i], this.x, this.y + (i * this.lineHeight));
        }
    }

    setup () {
        this.ctx.font = `${this.lineHeight}px Pixel`;
        this.ctx.fillStyle = 'red';
        this.ctx.textAlign = 'center';
    }
};
