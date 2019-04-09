import Controller from './Controller.js';
import ScoreboardView from '../views/ScoreboardView.js';

export default class ScoreboardController extends Controller {
    constructor (data) {
        super(data);
        this.view = new ScoreboardView(this.getData());
        this.contentFromScoreTable = '';
        this.position = 0;

        var urlParams = new URLSearchParams(window.location.search);
        this.position = Number(urlParams.get('offset'));

        this.EventBus.on('scoreboard-model:update-score-data', this.updateScore.bind(this));
        this.EventBus.emit('scoreboard:get-score', { position: this.position, offset: 0 });
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

    updateScore (data) {
        this.position = data.position;
        this.view.updateScore(data.scoresheet);
    }

    getPrevPage (event) {
        if (this.position <= 0) {
            return;
        }

        event.preventDefault();
        window.history.pushState(`${window.location.pathname}?offset=${(this.position - 10)}`, null, `${window.location.pathname}?offset=${(this.position - 10).toString()}`);
        this.EventBus.emit('scoreboard:get-score', { position: this.position, offset: -10 });
    }

    getNextPage (event) {
        event.preventDefault();
        window.history.pushState(`${window.location.pathname}?offset=${(this.position + 10)}`, null, `${window.location.pathname}?offset=${(this.position + 10).toString()}`);
        this.EventBus.emit('scoreboard:get-score', { position: this.position, offset: +10 });
    }
}
