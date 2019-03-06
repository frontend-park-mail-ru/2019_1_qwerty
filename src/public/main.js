'use strict';

import AjaxModule from "./modules/ajax.js"

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
    // form.removeChild(errorDiv);
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

    Object.keys(menuItems).forEach(function (key) {
        const menuItem = document.createElement("a");
        menuItem.textContent = menuItems[key];
        menuItem.href = "/" + key;
        menuItem.className = "application__item";
        menuItem.dataset.section = key;

        menuItemsDivContainer.appendChild(menuItem);
    });

    application.appendChild(menuProfileDivContainer);
    application.appendChild(projectName);
    application.appendChild(menuItemsDivContainer);

}

//signin
function createSignin() {
    application.innerHTML = "";
    const formSection = document.createElement("section");
    formSection.classList.add(...["sign-x", "sign-x_center", ]);

    const signInHeader = document.createElement("h1");
    signInHeader.className = "sign-x__header";
    signInHeader.textContent = "Sign In";

    const signInForm = document.createElement("form");
    signInForm.className = "form";
    signInForm.method="post";
    signInForm.action = "/signin";

    const formError = document.createElement("div");
    formError.display = "none";
    formError.className = "form__error";

    const signInNickname = document.createElement("input");
    signInNickname.classList.add(...["sign-x-form__input",  "sign-x-form__input_margin_m"]) ;
    signInNickname.type = "text";
    signInNickname.placeholder = "Nickname";
    signInNickname.name = "nickname";

    const signInDivContainer = document.createElement("div");
    signInDivContainer.classList.add(...["sign-x-form__content",  "sign-x-form__input_margin_m"]);

    const signInPassword = document.createElement("input");
    signInPassword.classList.add(...["sign-x-form__input",  "sign-x-form__input_size_m"]);
    signInPassword.type = "password";
    signInPassword.dataset.section = "password";
    signInPassword.placeholder = "Password";
    signInPassword.name = "password";

    const showIcon = document.createElement("i");
    showIcon.className = "sign-x-form__icon";

    signInDivContainer.appendChild(signInPassword);
    signInDivContainer.appendChild(showIcon);

    const signInButton = document.createElement("button");
    signInButton.className = "sign-x-form__button";
    signInButton.textContent = "Sign In";

    signInForm.appendChild(formError);
    signInForm.appendChild(signInNickname);
    signInForm.appendChild(signInDivContainer);
    signInForm.appendChild(signInButton);

    formSection.appendChild(signInHeader);
    formSection.appendChild(signInForm);

    showIcon.addEventListener("click", function (event) {
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

                    alert("Hello from /signin: " + xhr.responseText);

                    createMenu();
        },
            path: "/signin",
            body: {
                    nickname, password
                }
        });
    });
    application.appendChild(formSection);
}

function createSignup() {
    application.innerHTML = "";
    const formSection = document.createElement("section");
    formSection.classList.add(...["sign-x", "sign-x_center"]);

    const formError = document.createElement("div");
    formError.display = "none";
    formError.className = "form__error";

    const signUpHeader = document.createElement("h1");
    signUpHeader.className = "sign-x__header__header";
    signUpHeader.textContent = "Sign Up";

    const signUpForm = document.createElement("form");
    signUpForm.className = "sign-x-form";
    signUpForm.method="post";
    signUpForm.action = "/signin";

    const signUpNickname = document.createElement("input");
    signUpNickname.classList.add(...["sign-x-form__input",  "sign-x-form__input_margin_m"]) ;
    signUpNickname.type = "text";
    signUpNickname.placeholder = "Nickname";
    signUpNickname.name = "nickname";

    const signUpEmail = document.createElement("input");
    signUpEmail.classList.add(...["sign-x-form__input",  "sign-x-form__input_margin_m"]) ;
    signUpEmail.type = "email";
    signUpEmail.placeholder = "Your email";
    signUpEmail.name = "email";

    const signUpDivContainer = document.createElement("div");
    signUpDivContainer.classList.add(...["sign-x-form__content",  "sign-x-form__input_margin_m"]);

    const signUpPassword = document.createElement("input");
    signUpPassword.classList.add(...["sign-x-form__input",  "sign-x-form__input_size_m"]);
    signUpPassword.type = "password";
    signUpPassword.dataset.section = "password";
    signUpPassword.placeholder = "Password";
    signUpPassword.name = "password";

    const showIcon = document.createElement("i");
    showIcon.className = "sign-x-form__icon";

    signUpDivContainer.appendChild(signUpPassword);
    signUpDivContainer.appendChild(showIcon);

    const signUpButton = document.createElement("button");
    signUpButton.className = "sign-x-form__button";
    signUpButton.textContent = "Sign Up";

    signUpForm.appendChild(formError);
    signUpForm.appendChild(signUpNickname);
    signUpForm.appendChild(signUpEmail);
    signUpForm.appendChild(signUpDivContainer);
    signUpForm.appendChild(signUpButton);

    formSection.appendChild(signUpHeader);
    formSection.appendChild(signUpForm);

    showIcon.addEventListener("click", function (event) {
        signUpPassword.type = signUpPassword.type === "password" ? "text" : "password";
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
    application.appendChild(formSection);
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
//signin

