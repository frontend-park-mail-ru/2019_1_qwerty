import Controller from './Controller.js';
import { USER_CHECK } from '../config.js';
import MenuView from '../views/MenuView.js';

const noop = () => {};

export default class MenuController extends Controller {
    constructor (data) {
        super(data);
        // this.pages = data.pages;
        this.path = USER_CHECK;
        this.model = data.model;
        // this.EventBus.on('menu:user-auth', this.model.requestForUserAuth);
       // this.getData();
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

    createViewAndRender (isAuthorized) {
        this.data.isAuthorized = isAuthorized;
        this.data.headerTitles = (isAuthorized) ? {
            profile: 'My Profile',
            logout: 'Log Out'
        } : {
            signin: 'Sign In',
            signup: 'Sign Up'
        };
        this.getData();
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
                },
                multiplayer: {
                    click: this.multiplayerClickEvent()
                }
            }
        };
    }

    multiplayerClickEvent () {
        if (!this.data.isAuthorized) {
            return (event) => {
                document.querySelector('.menu__error').innerHTML = 'Please, sign in or sign up';
                setTimeout(() => {
                    document.querySelector('.menu__error').innerHTML = '';
                }, 2000);
            };
        }
        return this.routeFunction('/multiplayer');
    }

    destroy () {
        this.EventBus.off('model:user-auth-info', this.createViewAndRender);
        this.EventBus.off('menu:user-auth', this.model.requestForUserAuth);
        this.EventBus.off('menu:log-out', this.model.logOut);
        super.destroy();
    }
}
