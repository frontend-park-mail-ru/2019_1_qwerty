import Controller from './Controller.js';
import { USER_CHECK } from '../config.js';
import MenuView from '../views/MenuView.js';
import router from '../modules/Router.js';

export default class MenuController extends Controller {
    constructor (data) {
        super(data);
        // this.pages = data.pages;
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
                            router.go('/logout');
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
    //
    // routeFunction (path) {
    //     return event => {
    //         event.preventDefault();
    //         this.view.onDestroy();
    //         router.go(path);
    //     };
    // }
}
