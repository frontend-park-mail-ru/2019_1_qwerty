import Controller from './Controller.js';
import EventBus from '../modules/EventBus.js';

export default class SignXController extends Controller {

    getData () {
        delete this.data.view;
        const callbacks = {
            SignX: {
                submit: this.submitEvent.bind(this)
            },
            Input: {
                focus: this.onFocus.bind(this)
            }
        };
        this.data.callbacks = callbacks;
        return this.data;
    }

    onFocus (formView) {
        return () => {
            if (formView._errorDiv.display === 'block') {
                formView._removeFormError();
            }
        };
    }

    submitEvent (formView) {
        return event => {
            event.preventDefault();

            const nickname = formView._form.elements.nickname.value.trim();
            const password = formView._form.elements.password.value.trim();

            const body = { nickname, password };
            let errorExpression = !nickname || !password;
            let errorMsg = 'nickname or password is not filled';

            if (formView._isSignup) {
                const email = formView._form.elements.email.value.trim();
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

            EventBus.emit('signX:request', { formView, body });
        };
    }
}
