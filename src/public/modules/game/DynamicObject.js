export default class DynamicObject {
    constructor (ctx) {
        this.ctx = ctx;
        // console.log("ctx inside asteroid: ", this.ctx);
        this.x = 0;
        this.y = 0;
    }

    render () {
        this.ctx.save();
        this.setup();

        this.draw();

        this.ctx.restore();
    }

    /**
     * @abstract
     * @private
     */
    draw () {
        const ctx = this.ctx;
        ctx.rect(this.x, this.y, 50, 50);
    }

    setup () {

    }
};
