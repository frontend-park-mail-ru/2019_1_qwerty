import Controller from './Controller.js';
import { USER_CHECK } from '../config.js';
import MenuView from '../views/MenuView.js';

export default class MenuController extends Controller {
    constructor (data) {
        super(data);
        this.pages = data.pages;
        this.path = USER_CHECK;
        this.getData();
        this.EventBus.on('model:user-auth-info', this.createViewAndRender.bind(this));
        this.EventBus.emit('menu:user-auth');
    }

    createViewAndRender (namesAndTitles) {
        this.data.headerTitles = namesAndTitles;
        this.view = new MenuView(this.data);
        this.show();
    }

    getData () {
        this.data.callbacks = {
            menu: {
                header: {
                    signin: {
                        click: this.changePagesToEventListeners(this.pages.signin).bind(this)
                    },
                    signup: {
                        click: this.changePagesToEventListeners(this.pages.signup).bind(this)
                    },
                    profile: {
                        click: this.changePagesToEventListeners(this.pages.profile).bind(this)
                    },
                    logout: {
                        click: function (event) {
                            event.preventDefault();
                            this.pages.logout();
                        }.bind(this)
                    }
                },
                score: {
                    click: this.changePagesToEventListeners(this.pages.score).bind(this)
                }
            }
        };
    }

    changePagesToEventListeners (func) {
        return event => {
            event.preventDefault();
            this.view.onDestroy();
            func();
        };
    }
}
