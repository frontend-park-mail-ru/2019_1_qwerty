import Scene from './Scene.js';
import EventBus from '../EventBus.js';
import { Events } from './Events.js';
import Rand from './Rand.js';
import Bullet from './Bullet.js';
import Meteor from './Meteor.js';
import Player from './Player.js';

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
        this.player = null;

        this.renderScene = this.renderScene.bind(this);
        this.pushMeteorToScene = this.pushMeteorToScene.bind(this);
        this.pushBulletToScene = this.pushBulletToScene.bind(this);
        this.pushPlayerToScene = this.pushPlayerToScene.bind(this);
        this.pause = this.pause.bind(this);

        EventBus.on(Events.METEOR_CREATED, this.pushMeteorToScene);
        EventBus.on(Events.BULLET_CREATED, this.pushBulletToScene);
        EventBus.on(Events.PLAYER_CREATED, this.pushPlayerToScene);
        EventBus.on(Events.FINISH_GAME, this.pause);
    }

    pushPlayerToScene (state) {
        const ctx = this.ctx;
        state.player = new Player(ctx);
        state.player.y = this.canvas.height / 2;
        state.player.x = 20;
        state.player.id = this.scene.push(state.player);
        this.player = state.player;
    }

    pushMeteorToScene (data) {
        const ctx = this.ctx;
        const m = new Meteor(ctx, {
            rotationSpeed: data.new.rotationSpeed,
            linearSpeed: data.new.linearSpeed
        });

        m.y = Rand(0, this.canvas.height - m.height);
        m.x = this.canvas.width;
        m.id = this.scene.push(m);
        data.meteorits.push(m);
    }

    pushBulletToScene (bullets) {
        const ctx = this.ctx;
        const b = new Bullet(ctx, {
            x: this.player.x + this.player.width,
            y: this.player.y + this.player.height / 2,
            radius: 1,
            linearSpeed: 0.1
        });

        bullets.push(b);
        b.id = this.scene.push(b);
    }

    init (state) {
        this.state = state;
    }

    setState (state) {
        this.state = state;
        this.state.player.x += state.player.x;
        this.state.player.y += state.player.y;

        // Отключаем сдвиг
        state.player.x = 0;
        state.player.y = 0;
    }

    renderScene (now) {
        const scene = this.scene;
        const delay = now - this.lastFrameTime;
        // console.log("fps: ", 1000 / delay);
        this.lastFrameTime = now;

        this.state.meteorits.forEach(function (item, i, arr) {
            if (item.dead) {
                scene.remove(item.id);
                arr.splice(i, 1);
                return;
            }

            item.x -= delay * item.linearSpeed;
        });

        this.state.bullets.forEach(function (item, i, arr) {
            if (item.dead) {
                scene.remove(item.id);
                arr.splice(i, 1);
                return;
            }

            item.x += delay * item.linearSpeed;
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

        this.scene.destroy();
        EventBus.off(Events.METEOR_CREATED, this.pushMeteorToScene);
        EventBus.off(Events.BULLET_CREATED, this.pushBulletToScene);
        EventBus.off(Events.PLAYER_CREATED, this.pushPlayerToScene);
        EventBus.off(Events.FINISH_GAME, this.pause);
    }
}
