'use strict';

const application = document.getElementById('application');

const menuItems = {
    signup: "Sign Up",
    signin: "Sign In"
    //... Дописать самим
};

function createMenu() {
    Object.keys(menuItems).forEach(function (key) {
        const menuItem = document.createElement("a");
        menuItem.textContent = menuItems[key];
        menuItem.href = "/" + key;
        menuItem.className = "application__item";
        menuItem.dataset.section = key;

        application.appendChild(menuItem);
    });

}

//signin
function createSignin() {
    application.innerHTML = "";
    const formSection = document.createElement("section");
    formSection.classList.add(...["signin", "signin_center", "signin_text_center"]);

    const signInHeader = document.createElement("h1");
    signInHeader.className = "signin__header";
    signInHeader.textContent = "Sign In";

    const signInForm = document.createElement("form");
    signInForm.className = "signin-form";
    signInForm.method="post";
    signInForm.action = "/signin";

    const signInNickname = document.createElement("input");
    signInNickname.classList.add(...["signin-form__input",  "signin-form__input_margin_m"]) ;
    signInNickname.type = "text";
    signInNickname.placeholder = "Nickname";

    const signInDivContainer = document.createElement("div");
    signInDivContainer.classList.add(...["signin-form__content",  "signin-form__input_margin_m"]);

    const signInPassword = document.createElement("input");
    signInPassword.classList.add(...["signin-form__input",  "signin-form__input_size_m"]);
    signInPassword.type = "password";
    signInPassword.dataset.section = "password";
    signInPassword.placeholder = "Password";

    const showIcon = document.createElement("i");
    showIcon.className = "signin-form__icon";

    signInDivContainer.appendChild(signInPassword);
    signInDivContainer.appendChild(showIcon);

    const signInButton = document.createElement("button");
    signInButton.className = "signin-form__button";
    signInButton.textContent = "Sign In";

    signInForm.appendChild(signInNickname);
    signInForm.appendChild(signInDivContainer);
    signInForm.appendChild(signInButton);

    formSection.appendChild(signInHeader);
    formSection.appendChild(signInForm);

    showIcon.addEventListener("click", function (event) {
        signInPassword.type = signInPassword.type === "password" ? "text" : "password";
    });

    application.appendChild(formSection);
}

createMenu();

const pages = {
    menu: createMenu,
    signin: createSignin,
    //...
};

application.addEventListener("click", function (event) {
   const currentTarget =  event.target;

   if(currentTarget instanceof HTMLAnchorElement) {
       event.preventDefault();
       const section = currentTarget.dataset.section;
       pages[section]();
   }
});
//signin

