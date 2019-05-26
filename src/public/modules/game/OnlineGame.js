import Core from './Core.js';
import { Events } from './Events.js';
import EventBus from '../EventBus.js';
import Meteor from './Meteor.js';
import WebSocketService from '../../services/WebSocketService.js';

export default class OnlineGame extends Core {
    constructor (controller, scene) {
        super(controller, scene);
        this.canvasWidth = scene.canvas.width;
        this.canvasHeight = scene.canvas.height;
        this.createPlayers = this.createPlayers.bind(this);
    }

    init() {
        this.gameloopRequestId = null;
        this.lastFrame = 0;
        this.shitStep = 2.1;
        this.timer = {};
        this.state = {
            player1: {},
            player2: {},
            meteorits: [],
            bullets: []
        };
        this.gameStopped = false;
        this.score = 0;
        this.ws = new WebSocketService('/ws');
    }

    createPlayers (data) {
        console.log("online data: ", data);
        let state = this.state;
        const info = JSON.parse(data);
        EventBus.emit(Events.PLAYERS_CREATED_MULTI, {state, info});
    }

    start () {
        super.start();
        this.init();

        this.ws.subscribe('init-data', this.createPlayers);
        console.log("INSIDE MULTIPLAYER");
        
        EventBus.emit(Events.START_GAME, this.state);
    }

    onControllsPressed (evt) {
        if (this._pressed('LEFT', evt)) {
            this.ws.send('send-data', { 'move': 'left' });
        }
        if (this._pressed('RIGHT', evt)) {
            this.ws.send('send-data', { 'move': 'right' });            
        }
        if (this._pressed('UP', evt)) {
            this.ws.send('send-data', { 'move': 'up' });
        }
        if (this._pressed('DOWN', evt)) {
            this.ws.send('send-data', { 'move': 'down' });
        }
        // if (this._pressed('FIRE', evt)) {
        //     EventBus.emit(Events.BULLET_CREATED, this.state.bullets);
        // }
    }

    onGameStarted (evt) {
        this.controller.start();
        this.scene.init(evt);
        this.scene.pushPlayerToScene(this.state);
        this.scene.start();
        this.lastFrame = performance.now();
        // this.gameloopRequestId = requestAnimationFrame(this.gameloop);
    }

    onGameFinished (evt) {
        cancelAnimationFrame(this.gameloopRequestId);
    }

    onGameStateChanged (evt) {
    }
};
