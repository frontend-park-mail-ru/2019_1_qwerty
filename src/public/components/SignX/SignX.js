import AjaxModule from '../../modules/ajax.js';
import ButtonComponent from '../Button/Button.js';
import InputComponent from '../Input/Input.js';

const noop = () => null;

export default class SignXComponent {
    constructor ({
        parent = document.body,
        isSignup = false,
        afterSuccessSubmit = noop
    } = {}) {
        this._parent = parent;
        this._isSignup = isSignup;
        this._afterSuccessSubmit = afterSuccessSubmit;
        this._path = isSignup ? '/api/user/signup' : '/api/user/login';
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

    _onSubmit (xhr) {
        if (xhr.status === 400) {
            const response = JSON.parse(xhr.responseText);
            this._addFormError(response.error);
            return;
        }

        alert('Hello from /SignX: ' + xhr.responseText);

        this.onDestroy();

        this._afterSuccessSubmit();
    }

    _onFocus () {
        if (this._errorDiv.display === 'block') {
            this._removeFormError();
        }
    }

    onDestroy () {
        this._elements.forEach((component) => {
            if (component instanceof ButtonComponent) {
                this._form.removeEventListener('submit', this.submitEvent);
                return;
            }
            component.onDestroy();
        });
    }

    render () {
        const name = this._isSignup ? 'Sign Up' : 'Sign In';

        this._parent.innerHTML = window.fest['components/SignX/SignX.tmpl'](this._isSignup);

        const nicknameParent = document.querySelector('div[data-section-name="nickname"]');
        const signXNickname = new InputComponent({
            name: 'nickname',
            type: 'text',
            placeholder: 'Nickname',
            parent: nicknameParent
        });
        signXNickname.onFocus = this._onFocus.bind(this);
        this._elements.push(signXNickname);

        const passwordParent = document.querySelector('div[data-section-name="password"]');
        const signXPassword = new InputComponent({
            name: 'password',
            type: 'password',
            placeholder: 'Password',
            isPassword: true,
            parent: passwordParent
        });
        signXPassword.onFocus = this._onFocus.bind(this);
        this._elements.push(signXPassword);

        const buttonParent = document.querySelector('div[data-section-name="button"]');
        const signXButton = new ButtonComponent({
            name,
            parent: buttonParent
        });
        this._elements.push(signXButton);

        signXButton.onClick = this._onSubmit.bind(this);
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
            signXEmail.onFocus = this._onFocus.bind(this);
            signXEmail.render();
            this._elements.push(signXEmail);
        }

        signXPassword.render();
        signXButton.render();

        this.submitEvent = (event) => {
            event.preventDefault();

            const nickname = this._form.elements.nickname.value.trim();
            const password = this._form.elements.password.value.trim();

            const body = { nickname, password };
            let errorExpression = !nickname || !password;
            let errorMsg = 'nickname or password is not filled';

            if (this._isSignup) {
                const email = this._form.elements['email'].value.trim();
                body['email'] = email;
                errorExpression = errorExpression || !email;
                errorMsg = 'nickname or password or email is not filled';
            }

            if (errorExpression) {
                this._addFormError(errorMsg);
                return;
            }

            AjaxModule.doPost({
                callback: (xhr) => {
                    signXButton.onClick(xhr);
                },
                path: this._path,
                body
            });
        };

        this._form.addEventListener('submit', this.submitEvent);
    }
}
