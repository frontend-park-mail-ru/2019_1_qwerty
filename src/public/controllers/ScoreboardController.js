import Controller from './Controller.js';
import ScoreboardView from '../views/ScoreboardView.js';

export default class ScoreboardController extends Controller {
    constructor (data) {
        super(data);
        this.view = new ScoreboardView(this.getData());
        this.contentFromScoreTable = '';
        this.EventBus.on('scoreboard-model:update-score-data', this.updateScore.bind(this));
        this.EventBus.emit('scoreboard:get-score', 0);
    }

    getData () {
        this.data.callbacks = {
            Scoreboard: {
                prev: {
                    click: this.getPrevPage.bind(this)
                },
                next: {
                    click: this.getNextPage.bind(this)
                },
                close: {
                    click: this.routeFunction('/')
                }
            }
        };
        return this.data;
    }

    updateScore (scoresheet) {
        this.view.updateScore(scoresheet);
    }

    getPrevPage (event) {
        event.preventDefault();
        this.EventBus.emit('scoreboard:get-score', -10);
    }

    getNextPage (event) {
        event.preventDefault();
        this.EventBus.emit('scoreboard:get-score', +10);
    }
}
