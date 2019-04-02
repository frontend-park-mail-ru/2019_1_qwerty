import Controller from './Controller.js';
import SignXView from '../views/SignXView.js';

export default class SignXController extends Controller {
    constructor (data) {
        super(data);
        this.view = new SignXView(this.getData());
        this.contentFromNameField = '';
        this.contentFromPasswordField = '';
        this.contentFromEmailField = '';
        this.EventBus.on('signx-model:add-errors', this.view._addFormError.bind(this.view));
        this.EventBus.on('signx-model:after-success-submit', function () {
            this.view.onDestroy();
            this.view.afterSuccessSubmit();
        }.bind(this));
    }

    getData () {
        this.data.callbacks = {
            SignX: {
                InputNickname: {
                    focus: this.onFocus.bind(this),
                    change: this.getNickname.bind(this)
                },
                InputEmail: {
                    focus: this.onFocus.bind(this),
                    change: this.getEmail.bind(this)
                },
                InputPassword: {
                    focus: this.onFocus.bind(this),
                    change: this.getPassword.bind(this)
                },
                submit: this.submitEvent.bind(this)
            }
        };
        return this.data;
    }

    onFocus (event) {
        event.preventDefault();
        if (this.view.parentView._errorDiv.display === 'block') {
            this.view.parentView._removeFormError();
        }
    }

    getEmail (event) {
        event.preventDefault();
        this.contentFromEmailField = this.view.elements.email.getContent().trim();
    }

    getNickname (event) {
        event.preventDefault();
        this.contentFromNameField = this.view.elements.nickname.getContent().trim();
    }

    getPassword (event) {
        event.preventDefault();
        this.contentFromPasswordField = this.view.elements.password.getContent().trim();
    }

    submitEvent (event) {
        event.preventDefault();

        const nickname = this.contentFromNameField;
        const password = this.contentFromPasswordField;

        const body = { nickname, password };
        let errorExpression = !nickname || !password;
        let errorMsg = 'nickname or password is not filled';

        if (this.view.isSignup) {
            const email = this.contentFromEmailField;
            body.email = email;
            errorExpression = errorExpression || !email;
            errorMsg = 'nickname or password or email is not filled';
        }

        if (errorExpression) {
            this.view._addFormError(errorMsg);
            return;
        }

        if (password.length < 5) {
            this.view._addFormError('Password must be longer than 5 characters');
            return;
        }

        this.EventBus.emit('signX:request', {
            path: this.view.path,
            body
        });
    }
}
