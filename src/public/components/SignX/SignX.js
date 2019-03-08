import AjaxModule from '../../modules/ajax.js';

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
        const errorDiv = document.querySelector('.form__error');
        errorDiv.textContent = error;
        errorDiv.dataset.section = 'error';
        errorDiv.display = 'block';
    }

    _removeFormError () {
        const errorDiv = document.querySelector('.form__error');
        errorDiv.textContent = '';
        errorDiv.display = 'none';
    }

    _onSubmit (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const nickname = form.elements['nickname'].value.trim();
            const password = form.elements['password'].value.trim();

            const body = { nickname, password };
            let errorExpression = !nickname || !password;
            let errorMsg = 'nickname or password is not filled';

            if (this._isSignup) {
                const email = form.elements['email'].value.trim();
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
                    if (xhr.status === 400) {
                        const response = JSON.parse(xhr.responseText);
                        this._addFormError(response.error);
                        return;
                    }

                    alert('Hello from /SignX: ' + xhr.responseText);

                    this._afterSuccessSubmit();
                },
                path: this._path,
                body
            });
        });
    }

    _showPassword (showIcon, form) {
        showIcon.addEventListener('click', (event) => {
            const signInPassword = form.elements['password'];
            signInPassword.type = signInPassword.type === 'password' ? 'text' : 'password';
        });
    }

    _onFocus (form) {
        form.addEventListener('click', (event) => {
            const target = event.target;
            const error = document.querySelector('.form__error');

            if (target instanceof HTMLInputElement && error.display === 'block') {
                this._removeFormError(error);
            }
        });
    }

    render () {
        this._parent.innerHTML = window.fest['components/SignX/SignX.tmpl'](this._isSignup);

        const showIcon = document.querySelector('.sign-x-form__icon');
        const Form = document.querySelector('.sign-x-form');
        const errorDiv = document.querySelector('.form__error');

        errorDiv.display = 'none';

        this._onSubmit(Form);
        this._showPassword(showIcon, Form);
        this._onFocus(Form);
    }
}
