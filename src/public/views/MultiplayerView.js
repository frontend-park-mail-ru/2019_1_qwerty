import View from './View.js';
import CanvasView from './CanvasView.js';
import Game from '../modules/game/Game.js';
import GAME_MODES from '../modules/game/Modes.js';
import ButtonView from './ButtonView.js';
import upperFirstLetter from '../utils/UpperFirstLetter.js';
import { Events } from '../modules/game/Events.js';
import template from '../components/Multiplayer/Multiplayer.tmpl.xml';

const noop = () => null;

export default class MultiplayerView extends View {
    constructor ({
        parent,
        callbacks,
        nameOfView = 'multiplayer'
    }) {
        super({
            parent,
            callbacks,
            nameOfView
        });
        this.elements = {};
        this.canvas = {};
        this.namesOfButtons = ['help', 'scoreboard', 'menu'];

        this.setScore = this.setScore.bind(this);
        this.setLevel = this.setLevel.bind(this);

        this.EventBus.on(Events.UPDATED_SCORE, this.setScore);
        this.EventBus.on(Events.CHANGED_LEVEL, this.setLevel);
    }

    get getScore () {
        return this.elements['score'].innerHTML;
    }

    setScore (newScore) {
        this.elements['score'].innerHTML = newScore;
    }

    setLevel (newLevel) {
        this.elements['level'].innerHTML = newLevel;
    }

    onDestroy () {
        Object.values(this.elements).forEach((component) => {
            if (component.hasOwnProperty('onDestroy')) {
                component.onDestroy();
            }
        });

        this.EventBus.off(Events.UPDATED_SCORE, this.setScore);
        this.EventBus.off(Events.CHANGED_LEVEL, this.setLevel);

        super.onDestroy();
        this.game.destroy();
    }

    create () {
        this.canvas = document.querySelector(name = 'canvas');
        this.ctx = this.canvas.getContext('2d');
        this.doGame();
    }

    doGame () {
        let mode = '';

        mode = GAME_MODES.ONLINE;
        this.game = new Game(mode, this.canvas);
        this.game.start();
    }

    render () {
        this.parent.innerHTML = template(this);
        this.elem = document.querySelector('.multiplayer');

        let canvasParent = document.querySelector('[data-section-name="canvas"]');
        const canvas = new CanvasView({
            name: 'canvas',
            title: 'canvas',
            parent: canvasParent,
            callbacks: this.callbacksForView,
            parentView: this,
            nameOfView: 'canvas'
        });
        canvas.render();
        this.elements.canvas = canvas;
        this.namesOfButtons.forEach(name => {
            const parent = document.querySelector(`[data-section-name="${name}"]`);
            const button = new ButtonView({
                name,
                title: upperFirstLetter(name),
                parent,
                callbacks: this.callbacksForView,
                nameOfView: name,
                parentView: this
            });
            button.render();
            this.elements[name] = button;
        });

        this.elements.username = document.querySelector('.username');
        this.elements.score = document.querySelector('.score');
        this.elements.level = document.querySelector('[data-section-name="level"]');

        this.setEvents();
        this.create();
    }
}
