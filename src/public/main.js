'use strict';

import ScoreComponent from './components/Score/Score.js';
import AjaxModule from './modules/ajax.js';
import MenuComponent from './components/Menu/Menu.js';
import ProfileComponent from './components/Profile/Profile.js';
import SignXController from './controllers/SignXController.js';
import SignXView from './views/SignXView.js';
import SignXService from './services/SignXService.js';
import EventBus from './modules/EventBus.js';

const application = document.getElementById('application');

function createMenu () {
    application.innerHTML = '';

    const pages = {
        menu: createMenu,
        signin: createSignin,
        signup: createSignup,
        score: Scoreboard,
        logout: logOut,
        profile: createProfile

        // ...
    };

    const menu = new MenuComponent({
        parent: application,
        pages
    });

    menu.render();
}

function logOut () {
    AjaxModule.doFetchGet({
        path: '/user/logout'
    })
        .then(response => {
            if (!response.ok) {
                let error = new Error('Can not logout');
                error.response = response;
                throw error;
            }
            createMenu();
        })
        .catch(e => {
            this._addFormError(e.message);
            console.log(`Error:  ${e.message}, ${e.response.status}, ${e.response.statusText}`);
        });
}

// SignX
function createSignin () {
    application.innerHTML = '';
    const model = new SignXService();

    EventBus.on('signX:request', model.requestForSignupOrSignin);
    const signInController = new SignXController({
        parent: application,
        isSignup: false,
        afterSuccessSubmit: createMenu,
        View: SignXView
    });

    signInController.show();
}

function createProfile () {
    application.innerHTML = '';
    const profile = new ProfileComponent({
        parent: application,
        callback: createMenu
    });
    profile.render();
}

function createSignup () {
    application.innerHTML = '';
    const model = new SignXService();

    EventBus.on('signX:request', model.requestForSignupOrSignin);
    const signUpController = new SignXController({
        parent: application,
        isSignup: true,
        afterSuccessSubmit: createMenu,
        View: SignXView
    });

    signUpController.show();
}

function Scoreboard () {
    application.innerHTML = '';

    const board = new ScoreComponent({ parent: application });
    board.getNext();
    board.render();
}

createMenu();
