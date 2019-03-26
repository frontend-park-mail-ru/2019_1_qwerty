import View from './View.js';
import InputComponent from '../components/Input/Input.js';
import ButtonComponent from '../components/Button/Button.js';

export default class SignXView extends View {
    constructor (data) {
        super(data);
        this._isSignup = data.isSignup;
        this._afterSuccessSubmit = data.afterSuccessSubmit;
        this._path = data.isSignup ? '/user/create' : '/user/login';
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
            component.destroy();
        });

        this._form.removeEventListener('submit', this.submitEvent);
    }

    render () {
        const title = this._isSignup ? 'Sign Up' : 'Sign In';

        this.parent.innerHTML = window.fest['components/SignX/SignX.tmpl'](this._isSignup);

        const nicknameParent = document.querySelector('div[data-section-name="nickname"]');
        const signXNickname = new InputComponent({
            name: 'nickname',
            type: 'text',
            placeholder: 'Nickname',
            parent: nicknameParent
        });
        signXNickname.onFocus = this.callbacks.Input.focus(this);
        this._elements.push(signXNickname);

        const passwordParent = document.querySelector('div[data-section-name="password"]');
        const signXPassword = new InputComponent({
            name: 'password',
            type: 'password',
            placeholder: 'Password',
            isPassword: true,
            parent: passwordParent
        });
        signXPassword.onFocus = this.callbacks.Input.focus(this);
        this._elements.push(signXPassword);

        const buttonParent = document.querySelector('div[data-section-name="button"]');
        const name = 'button';
        const signXButton = new ButtonComponent({
            name,
            title,
            parent: buttonParent,
            type: 'submit'
        });

        this._form = document.querySelector('.sign-x-form');
        this._errorDiv = document.querySelector('.form__error');

        this._errorDiv.display = 'none';

        signXNickname.render();
        if (this._isSignup) {
            const emailParent = document.querySelector('div[data-section-name="email"]');
            const signXEmail = new InputComponent({
                name: 'email',
                type: 'email',
                placeholder: 'Email',
                parent: emailParent
            });
            signXEmail.onFocus = this.callbacks.Input.focus(this);
            signXEmail.render();
            this._elements.push(signXEmail);
        }

        signXPassword.render();
        signXButton.render();

        this._form.addEventListener('submit', this.callbacks.SignX.submit(this));
    }
}
