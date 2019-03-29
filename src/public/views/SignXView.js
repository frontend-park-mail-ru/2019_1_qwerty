import View from './View.js';
import InputView from './InputView.js';
import ButtonComponent from '../components/Button/Button.js';

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
        this._isSignup = isSignup;
        this._afterSuccessSubmit = afterSuccessSubmit;
        this._path = isSignup ? CREATE_USER : LOGIN_USER;
        this._elements = [];
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
        this._elements.forEach((component) => {
            component.onDestroy();
        });

        super.onDestroy();
        //
        // this._form.removeEventListener('submit', this.submitEvent);
    }

    render () {
        const title = this._isSignup ? 'Sign Up' : 'Sign In';

        this.parent.innerHTML = window.fest['components/SignX/SignX.tmpl'](this._isSignup);
        const nicknameParent = document.querySelector('div[data-section-name="nickname"]');
        const signXNickname = new InputView({
            name: 'nickname',
            type: 'text',
            placeholder: 'Nickname',
            parent: nicknameParent,
            nameOfView: 'InputNickname',
            callbacks: this.callbacks,
            parentView: this
        });

        this._elements.push(signXNickname);

        const passwordParent = document.querySelector('div[data-section-name="password"]');
        const signXPassword = new InputView({
            name: 'password',
            type: 'password',
            placeholder: 'Password',
            isPassword: true,
            parent: passwordParent,
            nameOfView: 'InputPassword',
            callbacks: this.callbacks,
            parentView: this
        });

        this._elements.push(signXPassword);

        const buttonParent = document.querySelector('div[data-section-name="button"]');
        const name = 'button';
        const signXButton = new ButtonComponent({
            name,
            title,
            parent: buttonParent,
            type: 'submit',
            callbacks: this.callbacks
        });

        this.elem = document.querySelector('.sign-x-form');
        this._errorDiv = document.querySelector('.form__error');

        this._errorDiv.display = 'none';

        signXNickname.render();
        if (this._isSignup) {
            const emailParent = document.querySelector('div[data-section-name="email"]');
            const signXEmail = new InputView({
                name: 'email',
                type: 'email',
                placeholder: 'Email',
                parent: emailParent,
                nameOfView: 'InputEmail',
                callbacks: this.callbacks,
                parentView: this
            });

            signXEmail.render();
            this._elements.push(signXEmail);
        }

        signXPassword.render();
        signXButton.render();

        this.setEvents();
        // this._form.addEventListener('submit', this.callbacks.SignX.submit(this));
    }
}
