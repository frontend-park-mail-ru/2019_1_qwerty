import View from './View.js';
import CanvasView from './CanvasView.js';
import Game from '../modules/game/Game.js';
import GAME_MODES from '../modules/game/Modes.js';
import ButtonView from './ButtonView.js';
import upperFirstLetter from '../utils/UpperFirstLetter.js';
import { Events } from '../modules/game/Events.js';
import template from '../templates/Multiplayer/Multiplayer.tmpl.xml';
import isMobile from '../utils/Mobile2.js';

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
        this.htmlElements = [];
        this.namesOfButtons = ['menu'];
        this.area = '';
        this.touchEvent = this.touchEvent.bind(this);
        this.fullScreen = this.fullScreen.bind(this);
    }

    touchEvent (event) {
        event.preventDefault();
        if (screen.orientation.type === 'landscape-primary' && !document.fullscreenElement) {
            this.launchIntoFullscreen(this.area);
        }
    }

    launchIntoFullscreen (element) {
        event.preventDefault();
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
        return this.elements.score.innerHTML;
    }

    setScore (newScore) {
        this.elements.score.innerHTML = newScore;
    }

    fullScreen (event) {
        if (!isMobile()) {
            this.launchIntoFullscreen( this.elem);
        }
    }

    onDestroy () {
        Object.values(this.elements).forEach((component) => {
            if (component.hasOwnProperty('onDestroy')) {
                component.onDestroy();
            }
        });

        this.area.removeEventListener('touchstart', this.touchEvent);

        this.elementClick.removeEventListener('click', this.fullScreen);

        this.mobileButtonUp.removeEventListener('touchstart', () => {this.EventBus.emit(Events.TOUCH_STARTED, {type: 'down', touchKey: 'w'})});
        this.mobileButtonUp.removeEventListener('touchend', () => {this.EventBus.emit(Events.TOUCH_STARTED, {type: 'up', touchKey: 'w'})});
        
        this.mobileButtonDown.removeEventListener('touchstart', () => {this.EventBus.emit(Events.TOUCH_STARTED, {type: 'down', touchKey: 's'})});
        this.mobileButtonDown.removeEventListener('touchend', () => {this.EventBus.emit(Events.TOUCH_STARTED, {type: 'up', touchKey: 's'})});

        this.mobileButtonLeft.removeEventListener('touchstart', () => {this.EventBus.emit(Events.TOUCH_STARTED, {type: 'down', touchKey: 'a'})});
        this.mobileButtonLeft.removeEventListener('touchend', () => {this.EventBus.emit(Events.TOUCH_STARTED, {type: 'up', touchKey: 'a'})});

        this.mobileButtonRight.removeEventListener('touchstart', () => {this.EventBus.emit(Events.TOUCH_STARTED, {type: 'down', touchKey: 'd'})});
        this.mobileButtonRight.removeEventListener('touchend', () => {this.EventBus.emit(Events.TOUCH_STARTED, {type: 'up', touchKey: 'd'})});

        this.elements.canvas.elem.removeEventListener('click', this.fullScreen);

        this.EventBus.off(Events.UPDATED_SCORE, this.setScore);

        super.onDestroy();
        this.game.destroy();
    }

    create () {
        this.EventBus.on(Events.UPDATED_SCORE, this.setScore);
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
        this.area = document.querySelector('.multiplayer__container');
        this.elementClick = document.querySelector('.multiplayer__canvas-container');

        this.mobileButtonUp = document.querySelector('.mobile__button-up');
        this.mobileButtonUp.addEventListener('touchstart', () => {this.EventBus.emit(Events.TOUCH_STARTED, {type: 'down', touchKey: 'w'})});
        this.mobileButtonUp.addEventListener('touchend', () => {this.EventBus.emit(Events.TOUCH_STARTED, {type: 'up', touchKey: 'w'})});
        
        this.mobileButtonDown = document.querySelector('.mobile__button-down');
        this.mobileButtonDown.addEventListener('touchstart', () => {this.EventBus.emit(Events.TOUCH_STARTED, {type: 'down', touchKey: 's'})});
        this.mobileButtonDown.addEventListener('touchend', () => {this.EventBus.emit(Events.TOUCH_STARTED, {type: 'up', touchKey: 's'})});

        this.mobileButtonLeft = document.querySelector('.mobile__button-left');
        this.mobileButtonLeft.addEventListener('touchstart', () => {this.EventBus.emit(Events.TOUCH_STARTED, {type: 'down', touchKey: 'a'})});
        this.mobileButtonLeft.addEventListener('touchend', () => {this.EventBus.emit(Events.TOUCH_STARTED, {type: 'up', touchKey: 'a'})});

        this.mobileButtonRight = document.querySelector('.mobile__button-right');
        this.mobileButtonRight.addEventListener('touchstart', () => {this.EventBus.emit(Events.TOUCH_STARTED, {type: 'down', touchKey: 'd'})});
        this.mobileButtonRight.addEventListener('touchend', () => {this.EventBus.emit(Events.TOUCH_STARTED, {type: 'up', touchKey: 'd'})});

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

        const gameMenuButton = new ButtonView({
            name: 'game_menu',
            title: upperFirstLetter('menu'),
            parent: document.querySelector(`[data-section-name="game_menu"]`),
            callbacks: this.callbacksForView,
            nameOfView: 'game_menu',
            parentView: this
        });

        gameMenuButton.render();
        this.elements['game_menu'] = gameMenuButton;

        this.htmlElements.username = document.querySelector('.username');
        this.htmlElements.score = document.querySelector('.score');

        this.setEvents();
        this.area.addEventListener('touchstart', this.touchEvent);
        this.elem.addEventListener('click', this.fullScreen);
        this.create();
    }
}
