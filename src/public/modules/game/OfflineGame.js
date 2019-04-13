import Core from './Core.js';
import { Events } from './Events.js';
import Rand from './Rand.js';
import EventBus from '/modules/EventBus.js';

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
            player: {},
            meteorits: [],
            bullets: []
        };
        this.gameStopped = false;
        this.canvasWidth = scene.canvas.width;
        this.canvasHeight = scene.canvas.height;
    }

    start () {
        super.start();
        EventBus.emit(Events.PLAYER_CREATED, this.state);

        setTimeout(function () {
            EventBus.emit(Events.START_GAME, this.state);
        }.bind(this));
    }

    gameloop (now) {
        const delay = now - this.lastFrame;
        this.lastFrame = now;
        this.state.delay = delay;
        this.timer -= delay;

        if (this.timer < 0) {
            EventBus.emit(Events.METEOR_CREATED, this.state.meteorits);
            this.timer = Rand(0.8, 2) * 1000;
        }

        this.state.meteorits.forEach(function (item, pos) {
            if (item.x < -item.width) {
                item.dead = true;
                this.state.meteorits.splice(pos, 1);
            }

            const distance = Math.sqrt((this.state.player.x - item.x) ** 2 + (this.state.player.y - item.y) ** 2);
            if (distance < (this.state.player.width / 2 + item.width / 2)) {
                EventBus.emit(Events.FINISH_GAME);
                this.gameStopped = true;
            }
        }.bind(this));

        this.state.bullets.forEach(function (bullet, bulletId, bullets) {
            if (bullet.x > this.canvasWidth) {
                bullet.dead = true;
            }

            this.state.meteorits.forEach(function (meteorit, meteoritId, meteorits) {
                const bulletCenter = {
                    x: bullet.x + bullet.radius / 2,
                    y: bullet.y + bullet.radius / 2
                };
                const meteoritCenter = {
                    x: meteorit.x + meteorit.width / 2,
                    y: meteorit.y + meteorit.height / 2
                };
                const distance = Math.sqrt((bulletCenter.x - meteoritCenter.x) ** 2 + (bulletCenter.y - meteoritCenter.y) ** 2);

                if (distance < (bullet.radius / 2 + meteorit.width / 2)) {
                    meteorit.dead = true;
                    bullet.dead = true;
                }
            });
        }.bind(this));

        EventBus.emit(Events.GAME_STATE_CHANGED, this.state);
        if (!this.gameStopped) {
            this.gameloopRequestId = requestAnimationFrame(this.gameloop);
        }
    }

    onControllsPressed (evt) {
        if (this._pressed('LEFT', evt)) {
            if (this.state.player.x > 0) {
                this.state.player.x -= this.shitStep;
            }
        }
        if (this._pressed('RIGHT', evt)) {
            if (this.state.player.x < this.canvasWidth - this.state.player.width) {
                this.state.player.x += this.shitStep;
            }
        }
        if (this._pressed('UP', evt)) {
            if (this.state.player.y > 0) {
                this.state.player.y -= this.shitStep;
            }
        }
        if (this._pressed('DOWN', evt)) {
            if (this.state.player.y < this.canvasHeight - this.state.player.height) {
                this.state.player.y += this.shitStep;
            }
        }
        if (this._pressed('FIRE', evt)) {
            EventBus.emit(Events.BULLET_CREATED, this.state.bullets);
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
        cancelAnimationFrame(this.gameloopRequestId);
    }

    onGameStateChanged (evt) {
    }
};
