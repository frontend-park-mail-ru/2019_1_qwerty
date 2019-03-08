'use strict';

import SignXComponent from './components/SignX/SignX.js';
import AjaxModule from './modules/ajax.js';

const application = document.getElementById('application');

function createMenu () {
    application.innerHTML = '';

    let menuProfileItems = {};

    if (/sessionid/.test(document.cookie)) {
        menuProfileItems = {
            profile: 'My Profile',
            logOut: 'Log Out'
        };
    } else {
        menuProfileItems = {
            signin: 'Login',
            signup: 'Signup'
        };
    }

    const menuProfileDivContainer = document.createElement('div');
    menuProfileDivContainer.className = 'menu-profile';

    Object.keys(menuProfileItems).forEach(function (key) {
        const menuItem = document.createElement('a');
        menuItem.textContent = menuProfileItems[key];
        menuItem.href = '/' + key;
        menuItem.dataset.section = key;

        menuProfileDivContainer.appendChild(menuItem);
    });

    const projectName = document.createElement('h1');
    projectName.textContent = 'Galaxy Go';
    projectName.id = 'menu-h1';

    const menuItems = {
        single: 'Singleplayer',
        multi: 'Multiplayer',
        score: 'Scoreboard',
        authors: 'Authors'
    };

    const menuItemsDivContainer = document.createElement('div');
    menuItemsDivContainer.className = 'menu-items';

    Object.entries(menuItems).forEach(function (keyAndData) {
        const [key, data] = keyAndData;

        const menuItem = document.createElement('a');
        menuItem.textContent = data;
        menuItem.href = '/' + key;
        menuItem.className = 'application__item';
        menuItem.dataset.section = key;

        menuItemsDivContainer.appendChild(menuItem);
    });

    application.appendChild(menuProfileDivContainer);
    application.appendChild(projectName);
    application.appendChild(menuItemsDivContainer);
}

// SignX
function createSignin () {
    application.innerHTML = '';

    const signIn = new SignXComponent({ parent: application, isSignup: false, afterSuccessSubmit: createMenu });
    signIn.render();
}

function createSignup () {
    application.innerHTML = '';

    const signUp = new SignXComponent({ parent: application, isSignup: true, afterSuccessSubmit: createMenu });
    signUp.render();
}

createMenu();

const pages = {
    menu: createMenu,
    signin: createSignin,
    signup: createSignup,
    score: Scoreboard

    // ...
};

application.addEventListener('click', function (event) {
    const currentTarget = event.target;
    if (currentTarget instanceof HTMLAnchorElement) {
        event.preventDefault();
        const section = currentTarget.dataset.section;
        console.log(section);
        pages[section]();
    }
});
// SignX
