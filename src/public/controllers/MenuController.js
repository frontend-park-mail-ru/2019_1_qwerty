import Controller from './Controller.js';
import { USER_CHECK } from '../config.js';

export default class MenuController extends Controller {
    constructor ({
        EventBus,
        View,
        pages = {},
        data = {}
    } = {}) {
        super({
            EventBus,
            View,
            data
        });
        this.pages = pages;
        this.path = USER_CHECK;
        this.ViewClass = View;
        this.data.callbacks = this.changePagesToEventListeners();
        this.EventBus.emit('menu:user-auth', this.path);
    }

    createViewAndRender (namesAndTitles) {
        this.data.headerTitles = namesAndTitles;
        this.view = new this.ViewClass(this.data);
        this.show();
    }

    // getData () {
    //
    //     this.EventBus.emit('menu:user-auth', {
    //         path: this.path,
    //         createViewAndRender: this.createViewAndRender.bind(this)
    //     });
    // }

    changePagesToEventListeners () {
        return Object.entries(this.pages).reduce((accum, [key, func]) => {
            accum[key] = {
                click: function (viewElement) {
                    return (event) => {
                        event.preventDefault();
                        func();
                        viewElement.parentView.destroy();
                    };
                }
            };
            return accum;
        }, {});
    }
}
