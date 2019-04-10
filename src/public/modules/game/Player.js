import DynamicObject from './DynamicObject.js' ;

export default class Player extends DynamicObject {
    constructor(ctx) {
        super(ctx);


        this.img = new Image();   // Создает новое изображение
        this.img.addEventListener("load", function() {
            // console.log("loaded img", this.img);
            let can = document.querySelector(name="canvas");
            //const ctx = can.getContext( '2d' );
        }, false);
        this.img.src = 'ship.png'; // Устанавливает источник файла 

        this.body = this.img; //new Rect(ctx);
        //this.gun = new Circle(ctx);

        // this.body.width = this.width;
        // this.body.height = this.height;
        //this.gun.radius = 5;
    }

    /**
     * @private
     */
    draw() {
        const ctx = this.ctx;
        // this.body.x = this.x;
        // this.body.y = this.y;
        // this.gun.x = this.x;
        // this.gun.y = this.y - this.body.height / 2;
        ctx.drawImage(this.body, this.x, this.y, this.width, this.height);
        //this.body.render();
        //this.gun.render();
    }

    setup() {

    }
};
