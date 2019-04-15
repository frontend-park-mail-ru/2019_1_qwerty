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

        return this.data;
    }
}
