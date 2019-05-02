'use strict';

import './main.scss';
import SignXController from './controllers/SignXController.js';
import SignXService from './services/SignXService.js';
import MenuService from './services/MenuService.js';
import MenuController from './controllers/MenuController.js';
import ProfileService from './services/ProfileService.js';
import ProfileController from './controllers/ProfileController.js';
import Error404Controller from './controllers/Error404Controller.js';
import ScoreboardController from './controllers/ScoreboardController.js';
import ScoreboardService from './services/ScoreboardService.js';
import SingleplayerController from './controllers/SingleplayerController.js';
import router from './modules/Router.js';

const application = document.getElementById('application');

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

    // const pages = {
    //     // menu: createMenu,
    //     signin: createSignin,
    //     signup: createSignup,
    //     score: Scoreboard,
    //     // logout: logOut,
    //     profile: createProfile,
    //     singleplayer: Singleplayer
    // };

    const menuItems = {
        singleplayer: 'Singleplayer',
        multiplayer: 'Multiplayer',
        score: 'Scoreboard'
    };

    const model = new MenuService();

    return new MenuController({
        parent: application,
        menuItems,
        // pages,
        model
    });
}

// function logOut () {
//     AjaxModule.doFetchGet({
//         path: '/user/logout'
//     })
//         .then(response => {
//             if (!response.ok) {
//                 let error = new Error('Can not logout');
//                 error.response = response;
//                 throw error;
//             }
//             createMenu();
//         })
//         .catch(e => {
//             this._addFormError(e.message);
//             console.log(`Error:  ${e.message}, ${e.response.status}, ${e.response.statusText}`);
//         });
// }

// SignX
function createSignin () {
    application.innerHTML = '';
    const model = new SignXService();

    // EventBus.on('signX:request', model.requestForSignupOrSignin);
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
    // EventBus.on('signX:request', model.requestForSignupOrSignin);
   return new SignXController({
        parent: application,
        isSignup: true,
        afterSuccessSubmit: createMenu,
        model
    });

    // signUpController.show();
}

function Scoreboard () {
    application.innerHTML = '';

    const model = new ScoreboardService();
    // EventBus.on('scoreboard:get-score', model.getScore.bind(model));
    return new ScoreboardController({
        parent: application,
        model
    });
    // const scoreboard = new ScoreboardController({
    //     parent: application,
    //     model
    // });
    // scoreboard.show();
}

function create404Page () {
    application.innerHTML = '';
    return new Error404Controller({
        parent: application
    });
    // error.show();
}

function Singleplayer () {
    application.innerHTML = '';

    return new SingleplayerController({
        parent: application
    });
    // singleplayer.show();
}

router.register('/signin', createSignin());
router.register('/', createMenu());
router.register('/signup', createSignup());
router.register('/profile', createProfile());
// router.register('/logout', logOut);
router.register('/score', Scoreboard());
router.register('/singleplayer', Singleplayer());
router.error(create404Page());

var url = new URL(window.location.href);
router.go(url.pathname, url.searchParams.toString());
