import Controller from './Controller.js';
import SignXView from '../views/SignXView.js';
import router from '../modules/Router.js';

export default class SignXController extends Controller {
    constructor (data) {
        super(data);
        this.view = new SignXView(this.getData());
        this.contentFromNameField = '';
        this.contentFromPasswordField = '';
        this.model = data.model;
    }

    show () {
        this.EventBus.on('signX:request', this.model.requestForSignupOrSignin);
        this.EventBus.on('signx-model:add-errors', this.view._addFormError.bind(this.view));
        this.EventBus.on('signx-model:after-success-submit', this.SuccessSubmit);
        super.show();
    }

    SuccessSubmit () {
        router.go('/');
    }

    destroy() {
        this.EventBus.off('signX:request', this.model.requestForSignupOrSignin);
        this.EventBus.off('signx-model:add-errors', this.view._addFormError.bind(this.view));
        this.EventBus.off('signx-model:after-success-submit',this.SuccessSubmit);
        super.destroy();
    }

    getData () {
        this.data.callbacks = {
            SignX: {
                InputNickname: {
                    focus: this.onFocus.bind(this),
                    change: this.getNickname.bind(this)
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
        if (this.view._errorDiv.display === 'block') {
            this.view._removeFormError();
        }
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
