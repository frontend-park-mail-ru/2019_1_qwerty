import Core from './Core.js';
import { Events } from './Events.js';
import EventBus from '../EventBus.js';
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
                global.WS_NICKNAME = data.nickname;
                this.ws = new WebSocketService('/ws', global.WS_NICKNAME);

                this.ws.subscribe('CONNECTED', this.waitingForOthers);
                this.ws.subscribe('GAME STARTED', this.createPlayers);
                this.ws.subscribe('STATE', this.playersStateChange);
                this.ws.subscribe('OBJECTS', this.objectsStateChange);
                this.ws.subscribe('GAME ENDED', this.gameOver);

                this.ws.init();
                
                EventBus.emit(Events.START_GAME, this.state);
            })
            .catch(e => {
                console.log(`Error:  ${e}`);
            });
    }

    waitingForOthers() {
        EventBus.emit(Events.PUSH_TEXT_TO_SCENE, "Waiting\nother players");
    }

    gameOver(data) {
        EventBus.emit(Events.FINISH_GAME, data.content);
    }

    objectsStateChange(data) {
        this.state.meteorits = [];
        this.scene.destroyObjects();
        for (let key in data.content) {
                let meteorParams = {
                    new: {
                        rotationSpeed: 0,
                        linearSpeed: data.content[key].Speed,
                        x: data.content[key].X,
                        y: data.content[key].Y,
                        hp: 100,
                        ID: data.content[key].ID
                    },
                    meteorits: this.state.meteorits
                }
                EventBus.emit(Events.METEOR_CREATED, meteorParams);
        };
    }

    playersStateChange(data) {
        this.state["player1"].y = data.content["player1"].Y;
        this.state["player1"].x = data.content["player1"].X;

        this.state["player2"].y = data.content["player2"].Y;
        this.state["player2"].x = data.content["player2"].X;

        EventBus.emit(Events.UPDATED_SCORE, data.content["player2"].Score);
    }

    createPlayers (data) {
        let state = this.state;
        let paramData = {state, data};
        
        EventBus.emit(Events.PLAYERS_CREATED_MULTI, paramData);
        
        this.state = paramData.state;
        this.state.player1.type = "player";
        this.state.player2.type = "player";
    }

    start () {
        super.start();
        this.init();
    }

    onControllsPressed (evt) {
        if (this._pressed('LEFT', evt)) {
            this.ws.send({ "action":"LEFT" });
        }
        if (this._pressed('RIGHT', evt)) {
            this.ws.send({ "action": "RIGHT" });            
        }
        if (this._pressed('UP', evt)) {
            this.ws.send({ "action": "UP" });
        }
        if (this._pressed('DOWN', evt)) {
            this.ws.send({ "action": "DOWN" });
        }
    }

    onGameStarted (evt) {
        this.controller.start();
        this.scene.init(evt);
        this.scene.start();
        this.lastFrame = performance.now();
    }

    onGameFinished (evt) {
        cancelAnimationFrame(this.gameloopRequestId);
    }

    onGameStateChanged (evt) {
    }
};
