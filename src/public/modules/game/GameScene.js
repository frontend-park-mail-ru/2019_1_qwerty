import Scene from './Scene.js';
import EventBus from '/modules/EventBus.js';
import { Events } from './Events.js';
import Rand from './Rand.js';
import Bullet from './Bullet.js';

export default class GameScene {
    constructor (canvas) {
        this.EventBus = EventBus;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scene = new Scene(this.ctx);
        this.state = null;
        this.requestFrameId = null;
        this.lastFrameTime = 0;
        this.field = [];
        this.me = null;

        this.renderScene = this.renderScene.bind(this);
        EventBus.on(Events.METEOR_CREATED, this.pushMeteorToScene.bind(this));
        EventBus.on(Events.BULLET_CREATED, this.pushBulletToScene.bind(this));
        EventBus.on(Events.PLAYER_CREATED, this.pushPlayerToScene.bind(this));
        EventBus.on(Events.FINISH_GAME, this.pause.bind(this));

        this.sceneWidth = 300;
        this.sceneHeight = 150;
    }

    pushPlayerToScene (me) {
        me.ctx = this.ctx;
        me.y = 10;
        me.x = 20;

        me.id = this.scene.push(me);
        this.me = me;
    }

    pushMeteorToScene (m) {
        m.ctx = this.ctx;
        m.y = Rand(0, this.sceneHeight - m.height);
        m.x = 280;

        m.id = this.scene.push(m);
    }

    pushBulletToScene (bullets) {
        const ctx = this.ctx;
        const b = new Bullet(ctx, {
            x: this.me.x + this.me.width,
            y: this.me.y + this.me.height * 0.6 / 2,
            radius: 1,
            linearSpeed: 0
        });
        bullets.push(b);
        b.id = this.scene.push(b);
    }

    init (state) {
        this.state = state;
    }

    setState (state) {
        this.state = state;
        this.state.me.x += state.me.x;
        this.state.me.y += state.me.y;

        // Отключаем сдвиг
        state.me.x = 0;
        state.me.y = 0;
    }

    renderScene (now) {
        const scene = this.scene;
        const delay = now - this.lastFrameTime;
        this.lastFrameTime = now;
        console.log('me: ', this.me.x, this.me.y);
        // const bullets = this.state.bullets.map(function (bullet) {
        //     const b = new Circle(ctx);
        //     b.id = scene.push(b);
        //     b.radius = 4;

        //     b.x = 50 + bullet.coll * 75;
        //     b.y = 660 - (660 - (50 + bullet.row * 50)) * bullet.percents;

        //     return b;
        // });

        this.state.meteorits.forEach(function (item) {
            if (item.dead) {
                scene.remove(item.id);
                return;
            }

            item.x -= delay * item.linearSpeed;
        });

        this.state.bullets.forEach(function (item, pos) {
            if (item.dead) {
                scene.remove(item.id);
                return;
            }

            item.x += delay * 0.2;
        });

        scene.render();
        this.requestFrameId = requestAnimationFrame(this.renderScene);
    }

    start () {
        this.lastFrameTime = performance.now();
        this.requestFrameId = requestAnimationFrame(this.renderScene);
    }

    pause () {
        cancelAnimationFrame(this.requestFrameId);
        this.requestFrameId = null;
    }

    stop () {
        if (this.requestFrameId) {
            cancelAnimationFrame(this.requestFrameId);
            this.requestFrameId = null;
        }

        this.scene.clear();
    }
}
