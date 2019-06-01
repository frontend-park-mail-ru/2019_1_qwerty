import View from './View.js';
import CanvasView from './CanvasView.js';
import Game from '../modules/game/Game.js';
import GAME_MODES from '../modules/game/Modes.js';
import ButtonView from './ButtonView.js';
import upperFirstLetter from '../utils/UpperFirstLetter.js';
import { Events } from '../modules/game/Events.js';
import template from '../templates/Singleplayer/Singleplayer.tmpl.xml';
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

        this.retryButton.removeEventListener('touchend', () => {
            document.querySelector('.game__buttons').style.display = 'none';
            this.EventBus.emit(Events.RESTART)
        });
        this.retryButton.removeEventListener('click', () => {
            document.querySelector('.game__buttons').style.display = 'none';
            this.EventBus.emit(Events.RESTART)
        });

        this.mobileButtonUp.removeEventListener('touchstart', () => {event.preventDefault(); this.EventBus.emit(Events.TOUCH_STARTED, {type: 'down', touchKey: 'w'})});
        this.mobileButtonUp.removeEventListener('touchend', () => {event.preventDefault(); this.EventBus.emit(Events.TOUCH_STARTED, {type: 'up', touchKey: 'w'})});
        
        this.mobileButtonDown.removeEventListener('touchstart', () => {event.preventDefault(); this.EventBus.emit(Events.TOUCH_STARTED, {type: 'down', touchKey: 's'})});
        this.mobileButtonDown.removeEventListener('touchend', () => {event.preventDefault(); this.EventBus.emit(Events.TOUCH_STARTED, {type: 'up', touchKey: 's'})});

        this.mobileButtonLeft.removeEventListener('touchstart', () => {event.preventDefault(); this.EventBus.emit(Events.TOUCH_STARTED, {type: 'down', touchKey: 'a'})});
        this.mobileButtonLeft.removeEventListener('touchend', () => {event.preventDefault(); this.EventBus.emit(Events.TOUCH_STARTED, {type: 'up', touchKey: 'a'})});

        this.mobileButtonRight.removeEventListener('touchstart', () => {event.preventDefault(); this.EventBus.emit(Events.TOUCH_STARTED, {type: 'down', touchKey: 'd'})});
        this.mobileButtonRight.removeEventListener('touchend', () => {event.preventDefault(); this.EventBus.emit(Events.TOUCH_STARTED, {type: 'up', touchKey: 'd'})});

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
        this.elementClick = document.querySelector('.singleplayer__canvas-container');

        this.retryButton = document.querySelector(`[data-section-name="retry"]`);
        this.retryButton.addEventListener('touchend', () => {
            document.querySelector('.game__buttons').style.display = 'none';
            this.EventBus.emit(Events.RESTART)
        });
        this.retryButton.addEventListener('click', () => {
            document.querySelector('.game__buttons').style.display = 'none';
            this.EventBus.emit(Events.RESTART)
        });

        this.mobileButtonUp = document.querySelector('.mobile__button-up');
        this.mobileButtonUp.addEventListener('touchstart', () => {event.preventDefault(); this.EventBus.emit(Events.TOUCH_STARTED, {type: 'down', touchKey: 'w'})});
        this.mobileButtonUp.addEventListener('touchend', () => {event.preventDefault(); this.EventBus.emit(Events.TOUCH_STARTED, {type: 'up', touchKey: 'w'})});
        
        this.mobileButtonDown = document.querySelector('.mobile__button-down');
        this.mobileButtonDown.addEventListener('touchstart', () => {event.preventDefault(); this.EventBus.emit(Events.TOUCH_STARTED, {type: 'down', touchKey: 's'})});
        this.mobileButtonDown.addEventListener('touchend', () => {event.preventDefault(); this.EventBus.emit(Events.TOUCH_STARTED, {type: 'up', touchKey: 's'})});

        this.mobileButtonLeft = document.querySelector('.mobile__button-left');
        this.mobileButtonLeft.addEventListener('touchstart', () => {event.preventDefault(); this.EventBus.emit(Events.TOUCH_STARTED, {type: 'down', touchKey: 'a'})});
        this.mobileButtonLeft.addEventListener('touchend', () => {event.preventDefault(); this.EventBus.emit(Events.TOUCH_STARTED, {type: 'up', touchKey: 'a'})});

        this.mobileButtonRight = document.querySelector('.mobile__button-right');
        this.mobileButtonRight.addEventListener('touchstart', () => {event.preventDefault(); this.EventBus.emit(Events.TOUCH_STARTED, {type: 'down', touchKey: 'd'})});
        this.mobileButtonRight.addEventListener('touchend', () => {event.preventDefault(); this.EventBus.emit(Events.TOUCH_STARTED, {type: 'up', touchKey: 'd'})});


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

        const gameRetryButton = new ButtonView({
            name: 'retry',
            title: upperFirstLetter('retry'),
            parent: document.querySelector(`[data-section-name="retry"]`),
            callbacks: this.callbacksForView,
            nameOfView: 'retry',
            parentView: this
        });

        gameRetryButton.render();
        this.elements['retry'] = gameRetryButton;

        this.htmlElements.username = document.querySelector('.username');
        this.htmlElements.score = document.querySelector('.score');

        this.setEvents();
        this.area.addEventListener('touchstart', this.touchEvent);
        this.elem.addEventListener('click', this.fullScreen);
        this.create();
    }
}
