import Core from './Core.js';
import {Events} from './Events.js';
import EventBus from '/modules/EventBus.js';
// import rand from './Rand.js';

	
export default class OfflineGame extends Core {
	constructor(controller, scene) {
		super(controller, scene);

		this.state = {};
		this.gameloop = this.gameloop.bind(this);
		this.gameloopRequestId = null;
		this.lastFrame = 0;
		this.shitStep = 5;
	}

	start() {
		super.start();
		this.state = {
			me: {
				x: 0,
				y: 0
			}
		};

		// this.state.items = Array.from(new Array(3 * 5), function (_, position) {
		// 	return {
		// 		coll: position % 5,
		// 		row: position < 5 ? 0 : (position / 5) | 0,
		// 		dead: false,
		// 		fadeSpeed: 0,
		// 		fadeLevel: 0
		// 	};
		// });

		setTimeout(function () {
			EventBus.emit(Events.START_GAME, this.state);
		}.bind(this));
	}

	gameloop(now) {
		const delay = now - this.lastFrame;
		this.lastFrame = now;

		// this.state.bullets = this.state.bullets
		// 	.map(function (bullet) {
		// 		bullet.percents += 0.02;
		// 		return bullet;
		// 	})
		// 	.filter(function (bullet) {
		// 		if (bullet.percents >= 1 && bullet.row >= 0) {
		// 			this.state.items[bullet.row * 5 + bullet.coll].fadeSpeed = rand(10, 20) / 1000;
		// 			return false;
		// 		}

		// 		return bullet.percents < 1;
		// 	}.bind(this));

		// this.state.items = this.state.items.map(function (item) {
		// 	if (item.fadeSpeed) {
		// 		item.fadeLevel += item.fadeSpeed;
		// 	}

		// 	if (item.fadeLevel >= 1) {
		// 		item.dead = true;
		// 	}

		// 	return item;
		// });

		EventBus.emit(Events.GAME_STATE_CHANGED, this.state);
		
		// if (!this.state.items.find(item => !item.dead)) {
		// 	setTimeout(function () {
		// 		EventBus.emit(events.FINISH_GAME);
		// 	}.bind(this));
		// }

		this.gameloopRequestId = requestAnimationFrame(this.gameloop);
	}

	onControllsPressed(evt) {
		
		if (this._pressed('LEFT', evt)) {
			this.state.me.x = -this.shitStep;
		}
		if (this._pressed('RIGHT', evt)) {
			this.state.me.x = this.shitStep;
		}
		if (this._pressed('UP', evt)) {
			this.state.me.y = -this.shitStep;
		}
		if (this._pressed('DOWN', evt)) {
			this.state.me.y = this.shitStep;
		}
		//console.log("trigger OfflineGame.js 89: ", this.state.me.x, this.state.me.y);
	}

	onGameStarted(evt) {
		this.controller.start();
		this.scene.init(evt);
		this.scene.start();

		this.lastFrame = performance.now();
		this.gameloopRequestId = requestAnimationFrame(this.gameloop);
	}

	onGameFinished(evt) {
		cancelAnimationFrame(this.gameloopRequestId);

		EventBus.emit('CLOSE_GAME');
	}

	onGameStateChanged(evt) {
		this.scene.setState(evt);
	}
};
