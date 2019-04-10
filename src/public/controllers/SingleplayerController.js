import Controller from './Controller.js';
import SingleplayerView from '../views/SingleplayerView.js';

export default class ScoreboardController extends Controller {
    constructor (data) {
        super(data);
        this.view = new SingleplayerView(this.getData());
        
        // this.EventBus.on('scoreboard-model:update-score-data', this.updateScore.bind(this));
        // this.EventBus.emit('scoreboard:get-score', { position: this.position, offset: 0 });
    }

    getData () {
        this.data.callbacks = {
            Singleplayer: {
            }
        };
        return this.data;
    }
}
