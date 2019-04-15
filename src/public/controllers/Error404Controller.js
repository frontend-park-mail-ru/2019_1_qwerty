import Controller from './Controller.js';
import Error404View from '../views/Error404View.js';

export default class Error404Controller extends Controller {
    constructor (data) {
        super(data);
        this.getData();
        this.view = new Error404View(this.data);
    }

    getData () {
        this.data.callbacks = {
            Error404: {
                back: {
                    click: this.routeFunction('/')
                }
            }
        };
    }
}
