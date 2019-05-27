import Scene from './Scene.js';
import EventBus from '../EventBus.js';
import { Events } from './Events.js';
import Meteor from './Meteor.js';
import Player from './Player.js';
import Text from './Text.js';

export default class GameScene {
    constructor (canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scene = new Scene(this.ctx);
        this.EventBus = EventBus;

        this.renderScene = this.renderScene.bind(this);
        this.pushMeteorToScene = this.pushMeteorToScene.bind(this);
        this.pushPlayerToScene = this.pushPlayerToScene.bind(this);
        this.pushPlayersToSceneMulti = this.pushPlayersToSceneMulti.bind(this);
        this.pause = this.pause.bind(this);
        // this.destroyObjects = this.destroyObjects.bind(this);
        // this.destroyPlayers = this.destroyPlayers.bind(this);

        this.init(null);
    }

    pushPlayersToSceneMulti (data) {
        const ctx = this.ctx;
        
        data.state["player1"] = new Player(ctx);
        data.state["player2"] = new Player(ctx);
        
        data.state["player1"].name = data.data.content["player1"].ID;
        data.state["player1"].y = data.data.content["player1"].Y;
        data.state["player1"].x = data.data.content["player1"].X;
        data.state["player1"].id = this.scene.push(data.state["player1"]);

        data.state["player2"].name = data.data.content["player2"].ID;
        data.state["player2"].y = data.data.content["player2"].Y;
        data.state["player2"].x = data.data.content["player2"].X;
        data.state["player2"].id = this.scene.push(data.state["player2"]);
        
        // console.log('added two players: ', data.state.player1, data.state.player2);
    }

    // destroyPlayers () {
    //     this.scene.destroyPlayers();
    // }

    destroyObjects () {
        this.scene.destroyObjects();
    }

    pushPlayerToScene (state) {
        const ctx = this.ctx;
        state.player = new Player(ctx);
        state.player.y = this.canvas.height / 2;
        state.player.x = 20;
        state.player.id = this.scene.push(state.player);
        state.player.linearSpeed = 0.1;
        this.player = state.player;
    }

    pushMeteorToScene (data) {
        const ctx = this.ctx;
        const m = new Meteor(ctx, {
            rotationSpeed: data.new.rotationSpeed,
            linearSpeed: data.new.linearSpeed,
            x: data.new.x,
            y: data.new.y,
            hp: data.new.hp
        });

        m.id = this.scene.push(m);
        m.type = "object";
        data.meteorits.push(m);
    }

    pushTextToScene (text) {
        const ctx = this.ctx;
        const t = new Text(ctx, {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            text: text
        });
        t.id = this.scene.push(t);
    }

    init (state) {
        this.state = state;
        
        this.requestFrameId = null;
        this.lastFrameTime = 0;
        this.field = [];
        this.players = null;

        EventBus.on(Events.METEOR_CREATED, this.pushMeteorToScene);
        EventBus.on(Events.PLAYER_CREATED, this.pushPlayerToScene);
        EventBus.on(Events.FINISH_GAME, this.pause);
        EventBus.on(Events.PLAYERS_CREATED_MULTI, this.pushPlayersToSceneMulti);
    }

    setState (state) {
        this.state = state;
        this.state.player.x += state.player.x;
        this.state.player.y += state.player.y;

        // Отключаем сдвиг
        state.player.x = 0;
        state.player.y = 0;
    }

    renderScene (now) {
        const scene = this.scene;
        const delay = now - this.lastFrameTime;
        this.lastFrameTime = now;

        this.state.meteorits.forEach(function (item, i, arr) {
            if (item.dead) {
                scene.remove(item.id);
                arr.splice(i, 1);
                return;
            }

            item.x -= delay * item.linearSpeed;
        });

        scene.render();
        this.requestFrameId = requestAnimationFrame(this.renderScene);
    }

    start () {
        this.lastFrameTime = performance.now();
        this.requestFrameId = requestAnimationFrame(this.renderScene);
    }

    pause () {
        cancelAnimationFrame(this.requestFrameId);
        this.requestFrameId = null;
        this.scene.destroy();

        this.pushTextToScene(`Game over!\n press N to restart`);
        this.scene.render();
    }

    stop () {
        if (this.requestFrameId) {
            cancelAnimationFrame(this.requestFrameId);
            this.requestFrameId = null;
        }

        this.scene.destroy();
        EventBus.off(Events.METEOR_CREATED, this.pushMeteorToScene);
        EventBus.off(Events.PLAYER_CREATED, this.pushPlayerToScene);
        EventBus.off(Events.FINISH_GAME, this.pause);
        EventBus.off(Events.PLAYERS_CREATED_MULTI, this.pushPlayersToSceneMulti);
    }
}
