import Controller from './Controller.js';
import SingleplayerView from '../views/SingleplayerView.js';

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
                menu: {
                    click: this.routeFunction('/')
                }
            }
        };
<<<<<<< HEAD
=======
        this.EventBus.on(Events.UPDATED_SCORE, this.setScore.bind(this));
        this.EventBus.on(Events.CHANGED_LEVEL, this.setLevel.bind(this));
>>>>>>> 232e3c1f532d547e0519398dc3cfdb91a51cc1ab

        return this.data;
    }
}
