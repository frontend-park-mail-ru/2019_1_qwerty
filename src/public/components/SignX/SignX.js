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

        this._afterSuccessSubmit();
    }

    _onFocus () {
        if (this._errorDiv.display === 'block') {
            console.log(this._errorDiv);
            this._removeFormError();
        }
    }

    _onDestroy () {
        return null;
    }

    render () {
        const name = this._isSignup ? 'Sign Up' : 'Sign In';

        const elements = {
            isSignup: this._isSignup
        };

        this._parent.innerHTML = window.fest['components/SignX/SignX.tmpl'](elements);

        const nicknameParent = document.querySelector('div[data-section-name="nickname"]');
        const signXNickname = new InputComponent({
            name: 'nickname',
            type: 'text',
            placeholder: 'Nickname',
            parent: nicknameParent
        });
        signXNickname.onFocus = this._onFocus.bind(this);


        let signXEmail = () => null;

        if (this._isSignup) {
            const emailParent = document.querySelector('div[data-section-name="email"]');
            signXEmail = new InputComponent({
                name: 'email',
                type: 'email',
                placeholder: 'Email',
                parent: emailParent
            });
            signXEmail.onFocus = this._onFocus.bind(this);
        }

        const passwordParent = document.querySelector('div[data-section-name="password"]');
        const signXPassword = new InputComponent({
            name: 'password',
            type: 'password',
            placeholder: 'Password',
            isPassword: true,
            parent: passwordParent
        });
        signXPassword.onFocus = this._onFocus.bind(this);

        this._form = document.querySelector('.sign-x-form');
        this._errorDiv = document.querySelector('.form__error');

        this._errorDiv.display = 'none';

        signXNickname.render();
        if (this._isSignup) {
            signXEmail.render();
        }
        signXPassword.render();

        this._form.addEventListener('submit', (event) => {
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

    //         AjaxModule.doPost({
    //             callback: (xhr) => {
    //                 signXButton.onClick(xhr);
    //                 this._onDestroy();
    //             },
    //             path: this._path,
    //             body
    //         });
    //     });
    // }
}
