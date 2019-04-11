import DynamicObject from './DynamicObject.js';

export default class Player extends DynamicObject {
    constructor (ctx) {
        super(ctx);

        this.img = new Image(); 
        this.img.src = 'ship.png'; 

        this.body = this.img; 
        this.width = 20;
        this.height = 20;
        // this.gun = new Circle(ctx);

        // this.body.width = this.width;
        // this.body.height = this.height;
        // this.gun.radius = 5;
    }

    /**
     * @private
     */
    draw () {
        const ctx = this.ctx;
        // this.body.x = this.x;
        // this.body.y = this.y;
        // this.gun.x = this.x;
        // this.gun.y = this.y - this.body.height / 2;
        ctx.drawImage(this.body, this.x, this.y, this.width, this.height);
        // this.body.render();
        // this.gun.render();
    }

    setup () {

    }
};
