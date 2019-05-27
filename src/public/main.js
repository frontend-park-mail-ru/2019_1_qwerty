'use strict';

import './main.scss';
import SignXController from './controllers/SignXController.js';
import SignXService from './services/SignXService.js';
import MenuService from './services/MenuService.js';
import MenuController from './controllers/MenuController.js';
import MultiplayerController from './controllers/MultiplayerController.js';
import ProfileService from './services/ProfileService.js';
import ProfileController from './controllers/ProfileController.js';
import Error404Controller from './controllers/Error404Controller.js';
import ScoreboardController from './controllers/ScoreboardController.js';
import ScoreboardService from './services/ScoreboardService.js';
import SingleplayerController from './controllers/SingleplayerController.js';
import router from './modules/Router.js';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';

const application = document.getElementById('application');
if ('serviceWorker' in navigator) {
    console.log(runtime);
    const register = runtime.register();
    console.log(register);
}
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('sw.js')
//         .then(function (reg) {
//             console.log('Registration succeeded. Scope is ' + reg.scope);
//         })
//         .catch(function (error) {
//             console.log('Registration failed with ' + error);
//         });
// }

function createMenu () {
    application.innerHTML = '';

    const menuItems = {
        singleplayer: 'Singleplayer',
        multiplayer: 'Multiplayer',
        score: 'Scoreboard'
    };

    const model = new MenuService();

    return new MenuController({
        parent: application,
        menuItems,
        model
    });
}

// SignX
function createSignin () {
    application.innerHTML = '';
    const model = new SignXService();

    return new SignXController({
        parent: application,
        isSignup: false,
        afterSuccessSubmit: createMenu,
        model
    });
}

function createProfile () {
    application.innerHTML = '';

    const model = new ProfileService();

    return new ProfileController({
        afterSubmit: createMenu,
        parent: application,
        model
    });
}

function createSignup () {
    application.innerHTML = '';
    const model = new SignXService();

    return new SignXController({
        parent: application,
        isSignup: true,
        afterSuccessSubmit: createMenu,
        model
    });
}

function Scoreboard () {
    application.innerHTML = '';

    const model = new ScoreboardService();
    return new ScoreboardController({
        parent: application,
        model
    });
}

function create404Page () {
    application.innerHTML = '';
    return new Error404Controller({
        parent: application
    });
}

function Singleplayer () {
    application.innerHTML = '';

    return new SingleplayerController({
        parent: application
    });
}

function Multiplayer () {
    application.innerHTML = '';

    return new MultiplayerController({
        parent: application
    });
}

router.register('/signin', createSignin());
router.register('/', createMenu());
router.register('/signup', createSignup());
router.register('/profile', createProfile());
router.register('/score', Scoreboard());
router.register('/singleplayer', Singleplayer());
router.register('/multiplayer', Multiplayer());
router.error(create404Page());

var url = new URL(window.location.href);
console.log('href:', window.location.href, url.pathname);
router.go(url.pathname, url.searchParams.toString());
