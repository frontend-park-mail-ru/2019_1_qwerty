import View from './View.js';
import CanvasView from './CanvasView.js';
import Game from '../modules/game/Game.js';
import GAME_MODES from '../modules/game/Modes.js';
import ButtonView from './ButtonView.js';
import upperFirstLetter from '../utils/UpperFirstLetter.js';
import { Events } from '../modules/game/Events.js';
import template from '../components/Singleplayer/Singleplayer.tmpl.xml';
import isMobile from '../utils/Mobile2.js';

const noop = () => null;

export default class SingleplayerView extends View {
    constructor ({
        parent,
        callbacks,
        nameOfView = 'singleplayer'
    }) {
        super({
            parent,
            callbacks,
            nameOfView
        });
        this.elements = {};
        this.canvas = {};
        this.htmlElements = [];
        this.namesOfButtons = ['scoreboard', 'menu'];

        this.setScore = this.setScore.bind(this);
        this.area = '';
        this.EventBus.on(Events.UPDATED_SCORE, this.setScore);
        this.touchEvent = this.touchEvent.bind(this);
        this.fullScreen = this.fullScreen.bind(this);
    }
    touchEvent (event) {
        if (screen.orientation.type === 'landscape-primary' && !document.fullscreenElement) {
            this.launchIntoFullscreen(this.area);
        }
    }

    launchIntoFullscreen (element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    get getScore () {
        return this.htmlElements.score.innerHTML;
    }

    setScore (newScore) {
        this.htmlElements.score.innerHTML = newScore;
    }

    fullScreen (event) {
        if (!isMobile()) {
            this.launchIntoFullscreen(this.elements.canvas.elem);
        }
    }

    onDestroy () {
        Object.values(this.elements).forEach((component) => {
            if (component.hasOwnProperty('onDestroy')) {
                component.onDestroy();
            }
        });
        this.area.removeEventListener('touchstart', this.touchEvent);
        this.elements.canvas.elem.removeEventListener('click', this.fullScreen);
        this.EventBus.off(Events.UPDATED_SCORE, this.setScore);

        super.onDestroy();
        this.game.destroy();
    }

    create () {
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.doGame();
    }

    doGame () {
        let mode = '';

        mode = GAME_MODES.OFFLINE;
        this.game = new Game(mode, this.canvas);
        this.game.start();
    }

    render () {
        this.parent.innerHTML = template(this);
        this.elem = document.querySelector('.singleplayer');
        this.area = document.querySelector('.singleplayer__container');

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
        this.htmlElements.username = document.querySelector('.username');
        this.htmlElements.score = document.querySelector('.score');

        this.setEvents();
        this.area.addEventListener('touchstart', this.touchEvent);
        this.elements.canvas.elem.addEventListener('click', this.fullScreen);
        this.create();
    }
}
