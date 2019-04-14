import Controller from './Controller.js';
import SingleplayerView from '../views/SingleplayerView.js';
import { Events } from '../modules/game/Events.js';
// import EventBus from '../modules/EventBus.js';

export default class SingleplayerController extends Controller {
    constructor (data) {
        super(data);
        this.view = new SingleplayerView(this.getData());
    }

    getData () {
        this.data.callbacks = {
            singleplayer: {
                help: {
                    click: this.routeFunction('/help')
                },
                scoreboard: {
                    click: this.routeFunction('/score')
                },
                pause: {
                    click: this.routeFunction('/pause')
                },
                menu: {
                    click: this.routeFunction('/')
                }
            }
        };
        this.EventBus.on(Events.UPDATED_SCORE, this.setScore.bind(this));
        this.EventBus.on(Events.CHANGED_LEVEL, this.setLevel.bind(this));

        return this.data;
    }

    setLevel (newLevel) {
        this.view.setLevel = newLevel;
    }

    setScore (newScore) {
        this.view.setScore = newScore.toString();
    }
}
