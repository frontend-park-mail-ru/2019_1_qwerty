'use strict';

import SignXComponent from './components/SignX/SignX.js';
import ScoreComponent from './components/Score/Score.js';
import AjaxModule from './modules/ajax.js';
import MenuComponent from './components/Menu/Menu.js';
import ProfileComponent from './components/Profile/Profile.js';

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
    AjaxModule.doGet({
        path: '/user/logout',
        callback: (xhr) => {
            if (xhr.status === 200) {
                createMenu();
            }
        }
    });
}

// SignX
function createSignin () {
    application.innerHTML = '';

    const signIn = new SignXComponent({ parent: application, isSignup: false, afterSuccessSubmit: createMenu });
    signIn.render();
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

    const signUp = new SignXComponent({ parent: application, isSignup: true, afterSuccessSubmit: createMenu });
    signUp.render();
}

function Scoreboard () {
    application.innerHTML = '';

    const board = new ScoreComponent({ parent: application });
    board.render();
    ScoreComponent.getNext();
}

createMenu();
