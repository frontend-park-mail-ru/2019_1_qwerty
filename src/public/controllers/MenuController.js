import Controller from './Controller.js';
import { USER_CHECK } from '../config.js';
import MenuView from '../views/MenuView.js';
import router from '../modules/Router.js';

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
                        // click: this.changePagesToEventListeners(this.pages.signin).bind(this)
                        click: this.routeFunction('/signin').bind(this)
                    },
                    signup: {
                        click: this.routeFunction('/signup').bind(this)
                        // click: this.changePagesToEventListeners(this.pages.signup).bind(this)
                    },
                    profile: {
                        click: this.routeFunction('/profile').bind(this)
                        // click: this.changePagesToEventListeners(this.pages.profile).bind(this)
                    },
                    logout: {
                        click: function (event) {
                            event.preventDefault();
                            router.go('/logout');
                            // this.pages.logout();
                        }
                    }
                },
                score: {
                    // click: this.changePagesToEventListeners(this.pages.score).bind(this)
                    click: this.routeFunction('/score').bind(this)
                }
            }
        };
    }
    //
    // changePagesToEventListeners (func) {
    //     return event => {
    //         event.preventDefault();
    //         this.view.onDestroy();
    //         func();
    //     };
    // }

    routeFunction (path) {
        return event => {
            event.preventDefault();
            this.view.onDestroy();
            router.go(path);
        };
    }
}
