import Core from './Core.js';
import { Events } from './Events.js';
import Rand from './Rand.js';
import EventBus from '/modules/EventBus.js';
import Meteor from './Meteor.js';
import Player from './Player.js';

const timer = 2;

export default class OfflineGame extends Core {
    constructor (controller, scene) {
        super(controller, scene);
        this.state = {};
        this.gameloop = this.gameloop.bind(this);
        this.gameloopRequestId = null;
        this.lastFrame = 0;
        this.shitStep = 5;
        this.timer = timer * 1000;
        this.state = {
            me: {},
            meteorits: []
        };
        this.gameStopped = false;
    }

    start () {
        super.start();

        this.state.me = new Player();
        EventBus.emit(Events.PLAYER_CREATED, this.state.me);

        // this.state.items = Array.from(new Array(3 * 5), function (_, position) {
        // 	return {
        // 		x: position % 5,
        // 		y: position < 5 ? 0 : (position / 5) | 0,
        // 		dead: false,
        // 		fadeSpeed: 0,
        // 		fadeLevel: 0
        // 	};
        // });

        setTimeout(function () {
            EventBus.emit(Events.START_GAME, this.state);
        }.bind(this));
    }

    gameloop (now) {
        const delay = now - this.lastFrame;
        this.lastFrame = now;
        this.state.delay = delay;
        this.timer -= delay;

        // this.state.bullets = this.state.bullets
        // 	.map(function (bullet) {
        // 		bullet.percents += 0.02;
        // 		return bullet;
        // 	})
        // 	.filter(function (bullet) {
        // 		if (bullet.percents >= 1 && bullet.row >= 0) {
        // 			this.state.items[bullet.row * 5 + bullet.coll].fadeSpeed = rand(10, 20) / 1000;
        // 			return false;
        // 		}

        // 		return bullet.percents < 1;
        // 	}.bind(this));
        console.log('1');

        if (this.timer < 0) {
            const m = new Meteor({
                rotationSpeed: 0,
                linearSpeed: 0.17
            });
            this.state.meteorits.push(m);
            EventBus.emit(Events.METEOR_CREATED, m);
            this.timer = Rand(0.8, 2) * 1000;
        }
        this.q = 1;
        this.state.meteorits.forEach(function (item, pos) {
            console.log('gameloop:');
            if (item.x < -item.width) {
                item.dead = true;
            }

            const distance = Math.sqrt((this.state.me.x - item.x) ** 2 + (this.state.me.y - item.y) ** 2);
            if (distance < (this.state.me.width / 2 + item.width / 2)) {
                EventBus.emit(Events.FINISH_GAME);
                this.gameStopped = true;
            }
        }.bind(this));

        EventBus.emit(Events.GAME_STATE_CHANGED, this.state);

        if (!this.gameStopped) {
            this.gameloopRequestId = requestAnimationFrame(this.gameloop);
        }
    }

    onControllsPressed (evt) {
        if (this._pressed('LEFT', evt)) {
            this.state.me.x -= this.shitStep;
        }
        if (this._pressed('RIGHT', evt)) {
            this.state.me.x += this.shitStep;
        }
        if (this._pressed('UP', evt)) {
            this.state.me.y -= this.shitStep;
        }
        if (this._pressed('DOWN', evt)) {
            this.state.me.y += this.shitStep;
        }
    }

    onGameStarted (evt) {
        this.controller.start();
        this.scene.init(evt);
        this.scene.start();
        this.lastFrame = performance.now();
        this.gameloopRequestId = requestAnimationFrame(this.gameloop);
    }

    onGameFinished (evt) {
        console.log('canceled');
        cancelAnimationFrame(this.gameloopRequestId);
    }

    onGameStateChanged (evt) {
    }
};
