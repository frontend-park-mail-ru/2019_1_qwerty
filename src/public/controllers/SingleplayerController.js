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
                scoreboard: {
                    click: this.routeFunction('/score')
                },
                menu: {
                    click: this.routeFunction('/')
                },
                game_menu: {
                    click: this.routeFunction('/')
                },
                retry: {
                    click: (event) => {
                        return;
                    }
                }
            }
        };

        return this.data;
    }
}
