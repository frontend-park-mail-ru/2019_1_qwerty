export default class DynamicObject {
    constructor (ctx) {
        this.ctx = ctx;
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

    get getCenter () {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
    }

    get getWidth () {
        return this.width;
    }
};
