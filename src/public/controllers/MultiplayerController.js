import Controller from './Controller.js';
import MultiplayerView from '../views/MultiplayerView.js';

export default class MultiplayerController extends Controller {
    constructor (data) {
        super(data);
        this.view = new MultiplayerView(this.getData());
    }

    getData () {
        this.data.callbacks = {
            multiplayer: {
                scoreboard: {
                    click: this.routeFunction('/score'),
                    touchend: this.routeFunction('/')
                },
                menu: {
                    click: this.routeFunction('/'),
                    touchend: this.routeFunction('/')
                },
                game_menu: {
                    click: this.routeFunction('/'),
                    touchend: this.routeFunction('/')
                }
            }
        };

        return this.data;
    }
}
