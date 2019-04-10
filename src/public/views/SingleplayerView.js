import View from './View.js';
import CanvasView from './CanvasView.js';
import Game from '../modules/game/Game.js';
import GAME_MODES from '../modules/game/Modes.js';

export default class SingleplayerView extends View {
    constructor ({
        parent,
        callbacks,
        nameOfView = 'Scoreboard'
    }) {
        super({
            parent,
            callbacks,
            nameOfView
        });
        this.elements = {};
        this.canvas = {};

        // this.EventBus.on('CLOSE_GAME', function () {
        //     if (this.active) {
        //         this.router.open('/');
        //     }
        // }.bind(this));
    }

    onDestroy () {
        Object.values(this.elements).forEach((component) => {
            component.onDestroy();
        });

        super.onDestroy();
    }

    create() {
        this.canvas = document.querySelector(name="canvas");
        this.ctx = this.canvas.getContext('2d');

        this.doGame();
        //return this;
    }

    doGame() {
        let mode = '';
        // if (pathname === '/game/online-mode') {
        //     mode = GAME_MODES.ONLINE;
        // } else {
        //     mode = GAME_MODES.OFFLINE;
        // }
        
        mode = GAME_MODES.OFFLINE;
        this.game = new Game(mode, this.canvas);
        this.game.start();
    }

    render () {
        this.parent.innerHTML = window.fest['components/Singleplayer/Singleplayer.tmpl'](this);

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

        this.setEvents();

        this.create();
    }   
}
