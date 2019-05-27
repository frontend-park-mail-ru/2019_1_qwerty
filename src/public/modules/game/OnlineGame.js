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
    }

    init() {
        this.createPlayers = this.createPlayers.bind(this);
        this.playersStateChange = this.playersStateChange.bind(this);
        this.objectsStateChange = this.objectsStateChange.bind(this);

        this.gameloopRequestId = null;
        this.lastFrame = 0;
        this.shitStep = 2.1;
        this.timer = {};
        this.state = {
            player1: {},
            player2: {},
            meteorits: []
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
                this.ws.subscribe('STATE', this.playersStateChange);
                this.ws.subscribe('OBJECTS', this.objectsStateChange);

                this.ws.init();
                console.log("INSIDE MULTIPLAYER");
                
                EventBus.emit(Events.START_GAME, this.state);
            })
            .catch(e => {
                alert('Error: ' + e.message);
                console.log(`Error:  ${e.message}, ${e.response.status}, ${e.response.statusText}`);
            });

        
    }

    objectsStateChange(data) {
        // console.log("OBJECTS:", data, this.state);
        this.state.meteorits = [];
        this.scene.destroyObjects();
        for (let key in data.content) {
            let meteorParams = {
                new: {
                    rotationSpeed: 0,
                    linearSpeed: data.content[key].Speed,
                    x: data.content[key].X,
                    y: data.content[key].Y,
                    hp: 100
                },
                meteorits: this.state.meteorits
            }
            EventBus.emit(Events.METEOR_CREATED, meteorParams);
            // this.state.meteorits = meteorParams.meteorits;
        };
    }

    playersStateChange(data) {
        // console.log("PLAYERS STATE:", data, this.state);
        // this.scene.destroyPlayers();
        this.state["player1"].y = data.content["player1"].Y;
        this.state["player1"].x = data.content["player1"].X;

        this.state["player2"].y = data.content["player2"].Y;
        this.state["player2"].x = data.content["player2"].X;
        console.log("players state: ", data, this.state["player1"], this.state["player2"]);
    }

    createPlayers (data) {
        let state = this.state;
        let paramData = {state, data};
        // console.log("createPlayers");
        EventBus.emit(Events.PLAYERS_CREATED_MULTI, paramData);
        
        this.state = paramData.state;
        this.state.player1.type = "player";
        this.state.player2.type = "player";
        // console.log("out state: ", this.state);
    }

    start () {
        super.start();
        this.init();
    }

    onControllsPressed (evt) {
        if (this._pressed('LEFT', evt)) {
            this.ws.send('action', { 'action': 'LEFT' });
        }
        if (this._pressed('RIGHT', evt)) {
            this.ws.send('action', { 'action': 'RIGHT' });            
        }
        if (this._pressed('UP', evt)) {
            this.ws.send('action', { 'action': 'UP' });
        }
        if (this._pressed('DOWN', evt)) {
            this.ws.send('action', { 'action': 'DOWN' });
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
