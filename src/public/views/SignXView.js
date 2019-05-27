import View from './View.js';
import InputView from './InputView.js';
import ButtonView from './ButtonView.js';
import template from '../components/SignX/SignX.tmpl.xml';

import { CREATE_USER, LOGIN_USER } from '../config.js';

const noop = () => null;

export default class SignXView extends View {
    constructor ({
        parent,
        callbacks,
        isSignup = false,
        afterSuccessSubmit = noop,
        nameOfView = 'SignX'
    }) {
        super({
            parent,
            callbacks,
            nameOfView
        });
        this.isSignup = isSignup;
        this.afterSuccessSubmit = afterSuccessSubmit;
        this.path = isSignup ? CREATE_USER : LOGIN_USER;
        this.elements = {};
    }

    _addFormError (error) {
        this._errorDiv.textContent = error;
        this._errorDiv.dataset.section = 'error';
        this._errorDiv.display = 'block';
    }

    _removeFormError () {
        this._errorDiv.textContent = '';
        this._errorDiv.display = 'none';
    }

    onDestroy () {
        Object.values(this.elements).forEach((component) => {
            component.onDestroy();
        });

        super.onDestroy();
    }

    render () {
        const title = this.isSignup ? 'Sign Up' : 'Sign In';
        this.parent.innerHTML = template(this.isSignup);
        const nicknameParent = document.querySelector('div[data-section-name="nickname"]');
        const signXNickname = new InputView({
            name: 'nickname',
            type: 'text',
            placeholder: 'Nickname',
            parent: nicknameParent,
            nameOfView: 'InputNickname',
            callbacks: this.callbacksForView,
            parentView: this
        });

        this.elements['nickname'] = signXNickname;

        const passwordParent = document.querySelector('div[data-section-name="password"]');
        const signXPassword = new InputView({
            name: 'password',
            type: 'password',
            placeholder: 'Password',
            isPassword: true,
            parent: passwordParent,
            nameOfView: 'InputPassword',
            callbacks: this.callbacksForView,
            parentView: this
        });

        this.elements['password'] = signXPassword;

        const buttonParent = document.querySelector('div[data-section-name="button"]');
        const name = 'button';
        const signXButton = new ButtonView({
            name,
            title,
            parent: buttonParent,
            type: 'submit',
            callbacks: this.callbacksForView
        });

        this.elem = document.querySelector('.sign-x-form');
        this._errorDiv = document.querySelector('.form__error');

        this._errorDiv.display = 'none';

        signXNickname.render();

        signXPassword.render();
        signXButton.render();

        this.setEvents();
    }
}
