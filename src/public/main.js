'use strict';

import ScoreComponent from './components/Score/Score.js';
import AjaxModule from './modules/ajax.js';
import SignXController from './controllers/SignXController.js';
import SignXView from './views/SignXView.js';
import SignXService from './services/SignXService.js';
import EventBus from './modules/EventBus.js';
import MenuService from './services/MenuService.js';
import MenuController from './controllers/MenuController.js';
import MenuView from './views/MenuView.js';
import ProfileService from './services/ProfileService.js';
import ProfileController from './controllers/ProfileController.js';
import ProfileView from './views/ProfileView.js';

const application = document.getElementById('application');

function createMenu () {
    application.innerHTML = '';

    const pages = {
        // menu: createMenu,
        signin: createSignin,
        signup: createSignup,
        score: Scoreboard,
        logout: logOut,
        profile: createProfile
    };

    const menuItems = {
        singleplayer: 'Singleplayer',
        multiplayer: 'Multiplayer',
        score: 'Scoreboard'
    };

    const model = new MenuService();
    EventBus.on('menu:user-auth', model.requestForUserAuth);
    const menu = new MenuController({
        parent: application,
        menuItems,
        pages
    });
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
        afterSuccessSubmit: createMenu
    });

    signInController.show();
}

function createProfile () {
    application.innerHTML = '';

    const model = new ProfileService();

    EventBus.on('profile:send-img', model.sendFile);
    EventBus.on('profile:get-current-user', model.requestForCurrentUser);
    EventBus.on('profile:send-user-data', model.sendUserInfo);
    const profile = new ProfileController({
        afterSubmit: createMenu,
        parent: application
    });
}

function createSignup () {
    application.innerHTML = '';
    const model = new SignXService();
    EventBus.on('signX:request', model.requestForSignupOrSignin);
    const signUpController = new SignXController({
        parent: application,
        isSignup: true,
        afterSuccessSubmit: createMenu
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
