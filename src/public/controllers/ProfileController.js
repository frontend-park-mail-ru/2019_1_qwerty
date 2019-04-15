import Controller from './Controller.js';
import ProfileView from '../views/ProfileView.js';
import router from '../modules/Router.js';

export default class ProfileController extends Controller {
    constructor (data) {
        super(data);
        this.contentFromEmailField = '';
        this.contentFromImageField = '';
        this.contentFromPasswordField = '';
        this.getData();
        this.EventBus.on('profile-model:get-current-user', this.createViewAndRender.bind(this));
        this.EventBus.emit('profile:get-current-user');
    }

    createViewAndRender (userInfo) {
        this.data.userInfo = userInfo;
        this.view = new ProfileView(this.data);
        this.EventBus.on('profile-model:clear-fields', this.clearFields.bind(this));
        this.EventBus.on('profile-model:add-info', this.addInfoForModel.bind(this));
        this.EventBus.on('profile-model:add-error', this.addFormError.bind(this));
        this.EventBus.on('profile-model:show-notification', this.showNotification.bind(this));
        this.EventBus.on('profile-model:remove-notification', this.removeNotification.bind(this));
        this.show();
    }

    addFormError () {
        this.view._addFormError.bind(this.view);
        this.view._addFormError();
    }

    showNotification () {
        this.view.showNotification.bind(this.view);
        this.view.showNotification();
    }

    removeNotification () {
        this.view.removeNotification.bind(this.view);
        this.view.removeNotification();
    }

    getData () {
        this.data.callbacks = {
            profile: {
                close: {
                    click: this.routeFunction('/')
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
                },
                submit: this.submitEvent.bind(this)
            }
        };
    }

    getEmail (event) {
        event.preventDefault();
        this.contentFromEmailField = this.view.elements.email.getContent().trim();
    }

    addAndGetImage (event) {
        event.preventDefault();
        this.view.file = this.view.elements.upload.elem.files[0];
        if (!/image\/(jpg|jpeg|png)/.test(this.view.file.type)) {
            this.view._addFormError('Incorrect file format');
            return;
        }
        const reader = new FileReader();

        reader.onloadend = () => {
            this.view.insertElements.img.src = reader.result;
            this.contentFromImageField = this.view.file;
        };

        if (this.view.file) {
            this.view._removeFormError();
            reader.readAsDataURL(this.view.file);
        } else {
            this.insertElements.img.src = '';
        }
    }

    getPassword (event) {
        event.preventDefault();
        this.contentFromPasswordField = this.view.elements.password.getContent().trim();
    }

    onFocus (event) {
        event.preventDefault();
        if (this.view._errorDiv.display === 'block') {
            this.view._removeFormError();
        }
    }

    // changeCallbackToEventListener (event) {
    //     event.preventDefault();
    //     // this.data.afterSubmit();
    //     this.view.onDestroy();
    //     router.go('/');
    // }

    submitEvent (event) {
        event.preventDefault();

        const email = this.contentFromEmailField;
        const password = this.contentFromPasswordField;
        const upload = this.contentFromImageField;

        const body = { email, password };
        let errorExpression = !email && !password && !upload;
        let errorMsg = 'fill something to submit';

        if (errorExpression) {
            this.view._addFormError(errorMsg);
            this.view.removeNotification();
            return;
        }

        if (password.length && password.length < 5) {
            this.view._addFormError('Password must be longer than 5 characters');
            this.view.removeNotification();
            return;
        }

        if (upload) {
            this.EventBus.emit('profile:send-img', upload);
        }
        this.EventBus.emit('profile:send-user-data', body);
    }

    addInfoForModel (response) {
        this.view.userInfo = response;
        this.view.addInfo();
    }

    clearFields () {
        this.view.elem.elements.email.value = '';
        this.view.elem.elements.password.value = '';
        this.view.elem.file = null;
        this.contentFromPasswordField = '';
        this.contentFromEmailField = '';
        this.contentFromImageField = null;
    }
}
