import Controller from './Controller.js';
import { CURRENT_USER, SEND_IMAGE, UPDATE_USER } from '../config.js';

export default class ProfileController extends Controller {
    constructor ({
        EventBus = {},
        View = null,
        data = {}
    }) {
        super({
            EventBus,
            View,
            data
        });

        this.contentFromEmailField = '';
        this.contentFromImageField = '';
        this.contentFromPasswordField = '';
        this.getData();
        this.clearFields.bind(this);
        EventBus.on('profile-model:get-current-user', this.getPromiseFromModel.bind(this));
        EventBus.emit('profile:get-current-user', CURRENT_USER);
        this.promise
            .then(userInfo => {
                this.data.userInfo = userInfo;
                this.createView();
            });
        this.view = null;
    }

    createView () {
        this.view = new this.View(this.data);
        this.view.render();
    }

    getPromiseFromModel (promise) {
        this.promise = promise;
    }

    getData () {
        this.data.callbacks = {
            profile: {
                submit: this.submitEvent.bind(this)
            },
            close: {
                click: this.changeCallbackToEventListener.bind(this)
            },
            email: {
                focus: this.onFocus.bind(this),
                change: this.getEmail.bind(this)
            },
            password: {
                focus: this.onFocus.bind(this),
                change: this.getPassword.bind(this)
            },
            upload: {
                change: this.addAndGetImage.bind(this)
            }
        };

    }

    getEmail (viewElement) {
        return event => {
            event.preventDefault();
            this.contentFromEmailField = viewElement.getContent().trim();
        };
    }

    addAndGetImage (viewElement) {
        return event => {
            event.preventDefault();
            viewElement.file = viewElement.elem.files[0];
            if (!/image\/(jpg|jpeg|png)/.test(viewElement.file.type)) {
                viewElement.parentView._addFormError('Incorrect file format');
                return;
            }
            const reader = new FileReader();

            reader.onloadend = () => {
                viewElement.parentView.insertElements.img.src = reader.result;
                this.contentFromImageField = viewElement.file;
            };

            if (viewElement.file) {
                viewElement.parentView._removeFormError();
                reader.readAsDataURL(viewElement.file);
            } else {
                viewElement.insertElements.img.src = '';
            }
        };
    }

    getPassword (viewElement) {
        return event => {
            event.preventDefault();
            this.contentFromPasswordField = viewElement.getContent().trim();
        };
    }

    onFocus (formView) {
        return (event) => {
            event.preventDefault();
            if (formView.parentView._errorDiv.display === 'block') {
                formView.parentView._removeFormError();
            }
        };
    }

    changeCallbackToEventListener (formView) {
        return event => {
            event.preventDefault();
            this.data.afterSubmit();
            formView.parentView.onDestroy();
        };
    }

    submitEvent (viewElement) {
        return event => {
            event.preventDefault();

            const email = this.contentFromEmailField;
            const password = this.contentFromPasswordField;
            const upload = this.contentFromImageField;

            const body = { email, password };
            let errorExpression = !email && !password && !upload;
            let errorMsg = 'fill something to submit';

            if (errorExpression) {
                viewElement._addFormError(errorMsg);
                viewElement.removeNotification();
                return;
            }

            if (password.length && password.length < 5) {
                viewElement._addFormError('Password must be longer than 5 characters');
                viewElement.removeNotification();
                return;
            }

            if (upload) {
                this.EventBus.emit('profile:send-img', {
                    path: SEND_IMAGE,
                    file: upload
                });
            }

            // this.body = body;
            this.EventBus.emit('profile:send-user-data', {
                path: UPDATE_USER,
                body,
                pathForInfo: CURRENT_USER,
                addError: viewElement._addFormError.bind(viewElement),
                addInfo: this.addInfoForModel(viewElement),
                showNotification: viewElement.showNotification.bind(viewElement),
                removeNotification: viewElement.removeNotification.bind(viewElement),
                clearFields: this.clearFields(viewElement)
            });
        };
    }
    addInfoForModel (viewElement) {
        return response => {
            viewElement.userInfo = response;
            viewElement.addInfo();
        };
    }
    clearFields (viewElement) {
        return () => {
            viewElement.elem.elements.email.value = '';
            viewElement.elem.elements.password.value = '';
            viewElement.elem.file = null;
            this.contentFromPasswordField = '';
            this.contentFromEmailField = '';
            this.contentFromImageField = null;
        };
    }
}
