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
        this._path = isSignup ? '/signup' : '/signin';
    }

    _addFormError (error) {
        this._errorDiv.textContent = error;
        this._errorDiv.dataset.section = 'error';
        // this._errorDiv.style.visibility = 'visible';
        this._errorDiv.display = 'block';
    }

    _removeFormError () {
        this._errorDiv.textContent = '';
        this._errorDiv.display = 'none';
        console.log(this._errorDiv);
    }

    _onSubmit (xhr) {
        if (xhr.status === 400) {
            const response = JSON.parse(xhr.responseText);
            console.log(this);
            this._addFormError(response.error);
            return;
        }

        alert('Hello from /SignX: ' + xhr.responseText);

        this._afterSuccessSubmit();
    }

    _onFocus () {
        if (this._errorDiv.display === 'block') {
            console.log(this._errorDiv);
            this._removeFormError();
        }
    }

    _onDestroy () {
        this._form.removeEventListener('click', );
    }

    render () {
        const name = this._isSignup ? 'signup' : 'signin';

        const signXButton = new ButtonComponent({ name,
            classes: [
                'sign-x-form__button_width_m',
                'sign-x-form__button_height_h'] });
        signXButton.callback = this._onSubmit.bind(this);

        const signXNickname = new InputComponent({
            name: 'nickname',
            type: 'text',
            classes: ['sign-x-form__input_width_m'],
            placeholder: 'Nickname'
        });
        signXNickname.callback = this._onFocus.bind(this);

        const signXEmail = new InputComponent({
            name: 'email',
            type: 'email',
            classes: ['sign-x-form__input_width_m'],
            placeholder: 'Email'
        });
        signXEmail.callback = this._onFocus.bind(this);

        const signXPassword = new InputComponent({
            name: 'password',
            type: 'password',
            classes: ['sign-x-form__input_width_m'],
            placeholder: 'Password',
            isPassword: true
        });
        signXPassword.callback = this._onFocus.bind(this);

        const elements = {
            isSignup: this._isSignup,
            signXButton,
            signXNickname,
            signXEmail,
            signXPassword
        };

        this._parent.innerHTML = window.fest['components/SignX/SignX.tmpl'](elements);

        this._form = document.querySelector('.sign-x-form');
        this._errorDiv = document.querySelector('.form__error');

        this._errorDiv.display = 'none';

        signXNickname.onFocus();
        if (this._isSignup) {
            signXEmail.onFocus();
        }
        signXPassword.onFocus();

        signXPassword.showPassword();

        this._form.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log('hi');

            const nickname = this._form.elements['nickname'].value.trim();
            const password = this._form.elements['password'].value.trim();

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
                    signXButton.callback(xhr);
                    this._onDestroy();
                },
                path: this._path,
                body
            });
        });
    }
}
