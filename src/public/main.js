'use strict';

import AjaxModule from "./modules/ajax.js"
import SignXComponent from "./components/SignX/SignX.js"

const application = document.getElementById('application');

function addFormError(error) {
    const errorDiv = document.querySelector(".form__error");
    errorDiv.textContent = error;
    errorDiv.dataset.section = "error";
    errorDiv.display = "block";
}

function removeFormError() {
    const errorDiv = document.querySelector(".form__error");
    errorDiv.textContent = "";
    errorDiv.display = "none"
}

function createMenu() {
    application.innerHTML = "";

    let menuProfileItems = {};
    console.log();
    if (/sessionid/.test(document.cookie)) {
        menuProfileItems = {
            profile: "My Profile",
        }
    } else {
        menuProfileItems = {
            signin: "Login",
            signup: "Signup",
        };
    }

    const menuProfileDivContainer = document.createElement("div");
    menuProfileDivContainer.className = "menu-profile";

    Object.keys(menuProfileItems).forEach(function (key) {
        const menuItem = document.createElement("a");
        menuItem.textContent = menuProfileItems[key];
        menuItem.href = "/" + key;
        menuItem.dataset.section = key;

        menuProfileDivContainer.appendChild(menuItem);
    });

    const projectName = document.createElement("h1");
    projectName.textContent = "Galaxy Go";
    projectName.id = "menu-h1";

    const menuItems = {
        single: "Singleplayer",
        multi: "Multiplayer",
        score: "Scoreboard",
        authors: "Authors",
    };

    const menuItemsDivContainer = document.createElement("div");
    menuItemsDivContainer.className = "menu-items";

    Object.entries(menuItems).forEach(function (keyAndData) {
        const [key, data] = keyAndData;

        const menuItem = document.createElement("a");
        menuItem.textContent = data;
        menuItem.href = "/" + key;
        menuItem.className = "application__item";
        menuItem.dataset.section = key;

        menuItemsDivContainer.appendChild(menuItem);
    });

    application.appendChild(menuProfileDivContainer);
    application.appendChild(projectName);
    application.appendChild(menuItemsDivContainer);

}

//SignX
function createSignin() {
    application.innerHTML = "";

    const signIn = new SignXComponent({parent:application});
    signIn.render();

    const showIcon = document.querySelector(".sign-x-form__icon");
    const signInForm = document.querySelector(".sign-x-form");
    const errorDiv = document.querySelector(".form__error");

    errorDiv.display="none";

    showIcon.addEventListener("click", function (event) {
        const signInPassword = signInForm.elements["password"];
        signInPassword.type = signInPassword.type === "password" ? "text" : "password";
    });

    signInForm.addEventListener("click", function (event) {
       const target = event.target;
       const error = document.querySelector(".form__error");

        if (target instanceof HTMLInputElement && error.display === "block") {
           removeFormError(error);
       }
    });

    signInForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const nickname = signInForm.elements["nickname"].value.trim();
        const password = signInForm.elements["password"].value.trim();

        if (!password || !nickname) {
            addFormError("nickname or password is not filled");
            return;
        }

        AjaxModule.doPost({
            callback: function (xhr) {

                   if (xhr.status === 400 ) {
                        const response = JSON.parse(xhr.responseText);
                        addFormError(response.error);
                        return;
                   }

                    alert("Hello from /SignX: " + xhr.responseText);

                    createMenu();
        },
            path: "/signin",
            body: {
                    nickname, password
                }
        });
    });

}

function createSignup() {
    application.innerHTML = "";

    const signUp = new SignXComponent({parent: application, isSignup:true});
    signUp.render();

    const showIcon = document.querySelector(".sign-x-form__icon");
    const signUpForm = document.querySelector(".sign-x-form");
    const errorDiv = document.querySelector(".form__error");

    errorDiv.display="none";

    showIcon.addEventListener("click", function (event) {
        const signUpPassword = signUpForm.elements["password"];
        signUpPassword.type = (signUpPassword.type === "password") ? "text" : "password";
    });

    signUpForm.addEventListener("click", function (event) {
        const target = event.target;
        const error = document.querySelector(".form__error");

        if (target instanceof HTMLInputElement && error.display === "block") {
            removeFormError();
        }
    });

    signUpForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const nickname = signUpForm.elements["nickname"].value.trim();
        const password = signUpForm.elements["password"].value.trim();
        const email = signUpForm.elements["email"].value.trim();

        if (!password || !nickname || !email) {
            addFormError("nickname or password or email is not filled");
            return;
        }

        AjaxModule.doPost({
            callback: function (xhr) {

                if (xhr.status === 400 ) {
                    const response = JSON.parse(xhr.responseText);
                    addFormError(response.error);
                    return;
                }

                alert("Hello from /signup: " + xhr.responseText);

                createMenu();
            },
            path: "/signup",
            body: {
                nickname, email, password
            }
        });
    });

}

createMenu();

const pages = {
    menu: createMenu,
    signin: createSignin,
    signup: createSignup,
    score: Scoreboard,

    //...
};

application.addEventListener("click", function (event) {
   const currentTarget =  event.target;
   if(currentTarget instanceof HTMLAnchorElement) {
       event.preventDefault();
       const section = currentTarget.dataset.section;
       console.log(section);
       pages[section]();
   }
});
//SignX

