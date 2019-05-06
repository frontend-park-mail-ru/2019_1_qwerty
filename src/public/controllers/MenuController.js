import Controller from './Controller.js';
import { USER_CHECK } from '../config.js';
import MenuView from '../views/MenuView.js';
import router from '../modules/Router.js';

export default class MenuController extends Controller {
    constructor (data) {
        super(data);
        // this.pages = data.pages;
        this.path = USER_CHECK;
        this.model = data.model;
        // this.EventBus.on('menu:user-auth', this.model.requestForUserAuth);
        this.getData();
        this.createViewAndRender = this.createViewAndRender.bind(this);
        // this.EventBus.on('model:user-auth-info', this.createViewAndRender);
        // this.EventBus.on('menu:log-out', this.model.logOut);
        // this.EventBus.emit('menu:user-auth');
    }

    show () {
        this.EventBus.on('menu:user-auth', this.model.requestForUserAuth);
        this.EventBus.on('model:user-auth-info', this.createViewAndRender);
        this.EventBus.on('menu:log-out', this.model.logOut);
        this.EventBus.emit('menu:user-auth');
    }

    createViewAndRender (namesAndTitles) {
        this.data.headerTitles = namesAndTitles;
        this.view = new MenuView(this.data);
        super.show();
    }

    getData () {
        this.data.callbacks = {
            menu: {
                header: {
                    signin: {
                        click: this.routeFunction('/signin')
                    },
                    signup: {
                        click: this.routeFunction('/signup')
                    },
                    profile: {
                        click: this.routeFunction('/profile')
                    },
                    logout: {
                        click: event => {
                            event.preventDefault();
                            this.EventBus.emit('menu:log-out');

                        }
                    }
                },
                score: {
                    click: this.routeFunction('/score')
                },
                singleplayer: {
                    click: this.routeFunction('/singleplayer')
                }
            }
        };
    }

    destroy() {
        this.EventBus.off('model:user-auth-info', this.createViewAndRender);
        this.EventBus.off('menu:user-auth', this.model.requestForUserAuth);
        this.EventBus.off('menu:log-out', this.model.logOut);
        super.destroy();
    }
}
