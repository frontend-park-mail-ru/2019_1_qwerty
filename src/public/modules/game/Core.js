import {Events} from './Events.js';
import EventBus from '/modules/EventBus.js';

const KEYS = {
    FIRE: [' ', 'Enter'],
    LEFT: ['a', 'A', 'ф', 'Ф', 'ArrowLeft'],
    RIGHT: ['d', 'D', 'в', 'В', 'ArrowRight'],
    UP: ['w', 'W', 'ц', 'Ц', 'ArrowUp'],
    DOWN: ['s', 'S', 'ы', 'Ы', 'ArrowDown']
}

export default class GameCore {
    constructor(controller, scene) {
        this.controller = controller;
        this.scene = scene;

        this.onGameStarted = this.onGameStarted.bind(this);
        this.onGameFinished = this.onGameFinished.bind(this);
        this.onControllsPressed = this.onControllsPressed.bind(this);
        this.onGameStateChanged = this.onGameStateChanged.bind(this);

        this.controllersLoopIntervalId = null;
    }

    start() {
        EventBus.on(Events.START_GAME, this.onGameStarted.bind(this));
        EventBus.on(Events.FINISH_GAME, this.onGameFinished.bind(this));
        EventBus.on(Events.CONTROLS_PRESSED, this.onControllsPressed.bind(this));
        EventBus.on(Events.GAME_STATE_CHANGED, this.onGameStateChanged.bind(this));

        const controller = this.controller;
        this.controllersLoopIntervalId = setInterval(function () {
            const actions = controller.diff();

            if (Object.keys(actions).some(k => actions[k])) {
                EventBus.emit(Events.CONTROLS_PRESSED, actions);
            }
        }, 50);
    }

    destroy() {
        clearInterval(this.controllersLoopIntervalId);
        EventBus.off(Events.START_GAME, this.onGameStarted);
        EventBus.off(Events.FINISH_GAME, this.onGameFinished);
        EventBus.off(Events.CONTROLS_PRESSED, this.onControllsPressed);
        EventBus.off(Events.GAME_STATE_CHANGED, this.onGameStateChanged);

        // this.controller.destroy();
        this.scene.stop();
    }

    onControllsPressed(evt) {
        throw new Error('This method must be overridden');
    }

    onGameStarted(evt) {
        throw new Error('This method must be overridden');
    }

    onGameFinished(evt) {
        throw new Error('This method must be overridden');
    }

    onGameStateChanged(evt) {
        throw new Error('This method must be overridden');
    }

    _pressed(name, data) {
        return KEYS[name].some(k => data[k.toLowerCase()]);
    }
};