import Core from './Core.js';
import { Events } from './Events.js';
import Rand from '../../utils/Rand.js';
import EventBus from '/modules/EventBus.js';
import Meteor from './Meteor.js';

export default class OfflineGame extends Core {
    constructor (controller, scene) {
        super(controller, scene);
        this.state = {};
        this.gameloop = this.gameloop.bind(this);
        this.gameloopRequestId = null;
        this.lastFrame = 0;
        this.shitStep = 2.1;
        this.nextLevelCondition = 50;
        this.timer = {};
        this.state = {
            player: {},
            meteorits: [],
            bullets: []
        };
        this.gameStopped = false;
        this.canvasWidth = scene.canvas.width;
        this.canvasHeight = scene.canvas.height;
        this.score = 0;
        this.level = 0;
    }

    start () {
        super.start();
        EventBus.emit(Events.PLAYER_CREATED, this.state);

        this.timer.meteorTimer = 2000;
        this.timer.scoreTimer = 1000;

        setTimeout(function () {
            EventBus.emit(Events.START_GAME, this.state);
        }.bind(this));
    }

    checkCollisions (obj, massive) {
        let index = null;
        massive.forEach((item, pos) => {
            if (item.getCenter.x < -item.getWidth) {
                item.dead = true;
                massive.splice(pos, 1);
            }

            const distance = Math.sqrt((obj.getCenter.x - item.getCenter.x) ** 2 + (obj.getCenter.y - item.getCenter.y) ** 2);
            if (distance < (obj.getWidth / 2 + item.getWidth / 2)) {
                index = item;
            }
        });

        return index;
    }

    gameloop (now) {
        const delay = now - this.lastFrame;
        this.lastFrame = now;
        this.timer.meteorTimer -= delay;
        this.timer.scoreTimer -= delay;

        let levelFactor = Math.trunc(this.score / this.nextLevelCondition);
        if (this.level < levelFactor) {
            this.level = levelFactor;
            EventBus.emit(Events.CHANGED_LEVEL, this.level);
        }

        if (this.timer.scoreTimer < 0) {
            this.score += 10;
            EventBus.emit(Events.UPDATED_SCORE, this.score);
            this.timer.scoreTimer = 1000;
        }

        // По таймеру генерируем новые метеориты
        if (this.timer.meteorTimer < 0) {
            let newMeteorit = new Meteor(null, {});
            let y = Rand(0, this.canvasHeight - newMeteorit.height);
            let x = this.canvasWidth;
            newMeteorit.hp = 10 + this.level * 10;
            newMeteorit.x = x;
            newMeteorit.y = y;

            // Метеориты не накладываются друг на друга
            while (this.checkCollisions(newMeteorit, this.state.meteorits)) {
                newMeteorit.y = Rand(0, this.canvasHeight - newMeteorit.height);
            }

            EventBus.emit(Events.METEOR_CREATED, {
                meteorits: this.state.meteorits,
                new: {
                    rotationSpeed: 0,
                    linearSpeed: 0.1 + levelFactor / 100,
                    x: newMeteorit.x,
                    y: newMeteorit.y,
                    hp: newMeteorit.hp
                }
            });

            let startInterval = 100;
            let endInterval = 150 + 10000 / (this.score / 100 + 2);
            this.timer.meteorTimer = Rand(startInterval, endInterval);
        }

        // Коллизии игрока с метеоритами
        if (this.checkCollisions(this.state.player, this.state.meteorits)) {
            EventBus.emit(Events.FINISH_GAME);
            this.gameStopped = true;
        }

        // Коллизии пуль с метеоритами
        this.state.bullets.forEach((bullet, bulletId, bullets) => {
            if (bullet.x > this.canvasWidth) {
                bullet.dead = true;
            }

            let obj = this.checkCollisions(bullet, this.state.meteorits);
            if (obj) {
                obj.reduceHealth(bullet.damage);
                bullet.dead = true;
            }
        });
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
