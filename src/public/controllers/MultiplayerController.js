import Controller from './Controller.js';
import MultiplayerView from '../views/MultiplayerView.js';
import EventBus from '../modules/EventBus.js';
import { Events } from '../modules/game/Events.js';

export default class MultiplayerController extends Controller {
    constructor (data) {
        super(data);
        this.view = new MultiplayerView(this.getData());
    }

    getData () {
        this.data.callbacks = {
            multiplayer: {
                menu: {
                    click: (event) => { EventBus.emit(Events.CLOSE_SOCKET); (this.routeFunction('/'))(event);},
                    touchend: (event) => { EventBus.emit(Events.CLOSE_SOCKET); (this.routeFunction('/'))(event);}
                },
                game_menu: {
                    click: (event) => { EventBus.emit(Events.CLOSE_SOCKET); (this.routeFunction('/'))(event);},
                    touchend: (event) => { EventBus.emit(Events.CLOSE_SOCKET); (this.routeFunction('/'))(event);}
                }
            }
        };

        return this.data;
    }
}
