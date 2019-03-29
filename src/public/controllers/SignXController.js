import Controller from './Controller.js';

export default class SignXController extends Controller {
    constructor ({
        EventBus = {},
        View = null,
        data = {}
    } = {}) {
        super({
            EventBus,
            View,
            data
        });
        this.view = new View(this.getData());
        this.contentFromNameField = '';
        this.contentFromPasswordField = '';
        this.contentFromEmailField = '';
    }

    getData () {
        this.data.callbacks = {
            SignX: {
                submit: this.submitEvent.bind(this)
            },
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
            }
        };
        return this.data;
    }

    onFocus (formView) {
        return (event) => {
            event.preventDefault();
            if (formView.parentView._errorDiv.display === 'block') {
                formView.parentView._removeFormError();
            }
        };
    }

    getEmail (viewElement) {
        return event => {
            event.preventDefault();
            this.contentFromEmailField = viewElement.getContent().trim();
        };
    }

    getNickname (viewElement) {
        return event => {
            event.preventDefault();
            this.contentFromNameField = viewElement.getContent().trim();
        };
    }

    getPassword (viewElement) {
        return event => {
            event.preventDefault();
            this.contentFromPasswordField = viewElement.getContent().trim();
        };
    }

    submitEvent (formView) {
        return event => {
            event.preventDefault();

            const nickname = this.contentFromNameField;
            const password = this.contentFromPasswordField;

            const body = { nickname, password };
            let errorExpression = !nickname || !password;
            let errorMsg = 'nickname or password is not filled';

            if (formView._isSignup) {
                const email = this.contentFromEmailField;
                body.email = email;
                errorExpression = errorExpression || !email;
                errorMsg = 'nickname or password or email is not filled';
            }

            if (errorExpression) {
                formView._addFormError(errorMsg);
                return;
            }

            if (password.length < 5) {
                formView._addFormError('Password must be longer than 5 characters');
                return;
            }

            this.EventBus.emit('signX:request', {
                path: formView._path,
                body,
                onDestroy: formView.onDestroy.bind(formView),
                afterSuccessSubmit: formView._afterSuccessSubmit,
                addFormError: formView._addFormError.bind(formView)
            });
        };
    }
}
