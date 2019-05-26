import Core from './Core.js';
import { Events } from './Events.js';
import EventBus from '../EventBus.js';
import Meteor from './Meteor.js';
import WebSocketService from '../../services/WebSocketService.js';
import AjaxModule from '../ajax.js';
import { CURRENT_USER } from '../../config.js';

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
        let nickname = '';
        this.ws = null;

        AjaxModule.doFetchGet({
            path: CURRENT_USER
        })
            .then(response => {
                if (!response.ok) {
                    let error = new Error('Can not get user data, status code: ');
                    error.response = response;
                    throw error;
                }
                return response.json();
            })
            .then(data => {
                nickname = data.nickname;
                console.log('nickname: ', nickname);
                this.ws = new WebSocketService('/ws', nickname);
                this.ws.subscribe('CONNECTED', () => {});
                this.ws.subscribe('GAME STARTED', this.createPlayers);
                this.ws.init();
                console.log("INSIDE MULTIPLAYER");
                
                EventBus.emit(Events.START_GAME, this.state);
            })
            .catch(e => {
                alert('Error: ' + e.message);
                console.log(`Error:  ${e.message}, ${e.response.status}, ${e.response.statusText}`);
            });

        
    }

    createPlayers (data) {
        let state = this.state;
        // const info = JSON.parse(data);
        EventBus.emit(Events.PLAYERS_CREATED_MULTI, {state, data});
    }

    start () {
        super.start();
        this.init();
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
    }

    onGameStarted (evt) {
        this.controller.start();
        this.scene.init(evt);
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
