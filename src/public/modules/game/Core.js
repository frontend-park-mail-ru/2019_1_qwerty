import { Events } from './Events.js';
import EventBus from '../EventBus.js';

const KEYS = {
    LEFT: ['a', 'A', 'ф', 'Ф', 'ArrowLeft'],
    RIGHT: ['d', 'D', 'в', 'В', 'ArrowRight'],
    UP: ['w', 'W', 'ц', 'Ц', 'ArrowUp'],
    DOWN: ['s', 'S', 'ы', 'Ы', 'ArrowDown'],
    RESTART: ['n', 'N', 'т', 'Т']
};

export default class GameCore {
    constructor (controller, scene) {
        this.controller = controller;
        this.scene = scene;

        this.onGameStarted = this.onGameStarted.bind(this);
        this.onGameFinished = this.onGameFinished.bind(this);
        this.onControllsPressed = this.onControllsPressed.bind(this);
        this.onGameStateChanged = this.onGameStateChanged.bind(this);
        this.onGameRestarted = this.onGameRestarted.bind(this);

        this.controllersLoopIntervalId = 0;
    }

    start () {
        EventBus.on(Events.START_GAME, this.onGameStarted);
        EventBus.on(Events.DESTROY_GAME, this.onGameFinished);
        EventBus.on(Events.CONTROLS_PRESSED, this.onControllsPressed);
        EventBus.on(Events.GAME_STATE_CHANGED, this.onGameStateChanged);
        EventBus.on(Events.RESTART, this.onGameRestarted);

        const controller = this.controller;
        this.controllersLoopIntervalId = setInterval(function () {
            const actions = controller.diff();

            if (Object.keys(actions).some(k => actions[k])) {
                EventBus.emit(Events.CONTROLS_PRESSED, actions);
            }
        }, 20);
        console.log("parent: ", this.controllersLoopIntervalId);
    }

    destroy () {
        
        console.log("DESTROYP PARENT: ", this.controllersLoopIntervalId);
        clearInterval(this.controllersLoopIntervalId);
        EventBus.emit(Events.DESTROY_GAME);

        this.controller.destroy();
        this.scene.stop();

        EventBus.off(Events.START_GAME, this.onGameStarted);
        EventBus.off(Events.DESTROY_GAME, this.onGameFinished);
        EventBus.off(Events.CONTROLS_PRESSED, this.onControllsPressed);
        EventBus.off(Events.GAME_STATE_CHANGED, this.onGameStateChanged);
        EventBus.off(Events.RESTART, this.onGameRestarted);
    }

    onGameRestarted (evt) {
        throw new Error('This method must be overridden');
    }

    onControllsPressed (evt) {
        throw new Error('This method must be overridden');
    }

    onGameStarted (evt) {
        throw new Error('This method must be overridden');
    }

    onGameFinished (evt) {
        throw new Error('This method must be overridden');
    }

    onGameStateChanged (evt) {
        throw new Error('This method must be overridden');
    }

    _pressed (name, data) {
        return KEYS[name].some(k => data[k.toLowerCase()]);
    }
};
