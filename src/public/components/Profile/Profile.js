import InputComponent from '../Input/Input.js';
import ButtonComponent from '../Button/Button.js';
import AjaxModule from '../../modules/ajax.js';
import FileInputComponent from '../FileInput/FileInput.js';
import { API_STATIC } from '../../config.js';
import NotificationComponent from '../Notification/Notification.js';

const noop = () => null;

export default class ProfileComponent {
    constructor ({
        parent = document.body,
        callback = noop
    }) {
        this.callback = function () {
            callback();
            this.onDestroy();
        }.bind(this);

        this._parent = parent;
        this.elements = {};
        this.userInfo = {};
        this.insertElements = {};
        this._errorDiv = null;
        this.submitEvent = this.submitEvent.bind(this);
        this._path = '/user/update';
    }

    addInfo () {
        const srcPath = API_STATIC + this.userInfo.avatar;

        this.insertElements.img.src = srcPath;

        this.insertElements.nickname.textContent = this.userInfo.name;
        this.insertElements.email.textContent = this.userInfo.email;
        this.insertElements.score.textContent = this.userInfo.score;
    }

    changeRealTimeImage () {
        const file = this.elements.upload.file;
        console.log(file.type);
        if (!/image\/(jpg|jpeg|png)/.test(file.type)) {
            this._addFormError('Incorrect file format');
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            this.insertElements.img.src = reader.result;
        };

        if (file) {
            this._removeFormError();
            reader.readAsDataURL(file);
        } else {
            this.insertElements.img.src = '';
        }
    }

    _onFocus () {
        if (this._errorDiv.display === 'block') {
            this._removeFormError();
        }
    }

    _renderAllComponents () {
        const notificationParent = document.querySelector('[data-section="profile-notification"]');
        const notification = new NotificationComponent({
            parent: notificationParent
        });
        notification.render();
        notification.display = 'none';
        this.elements.notification = notification;

        const uploadParent = document.querySelector('[data-section="change-button"]');
        const uploadInput = new FileInputComponent({
            parent: uploadParent,
            title: 'Change'
        });
        uploadInput.render();
        this.elements.upload = uploadInput;
        uploadInput.onChange = this.changeRealTimeImage.bind(this);

        const emailParent = document.querySelector('[data-section="email"]');
        const emailInput = new InputComponent({
            name: 'email',
            type: 'email',
            placeholder: 'New Email',
            parent: emailParent
        });
        emailInput.onFocus = this._onFocus.bind(this);
        emailInput.render();
        this.elements.email = emailInput;

        const passwordParent = document.querySelector('[data-section="password"]');
        const passwordInput = new InputComponent({
            name: 'password',
            type: 'password',
            placeholder: 'New Password',
            parent: passwordParent,
            isPassword: true
        });
        passwordInput.onFocus = this._onFocus.bind(this);
        passwordInput.render();
        this.elements.password = passwordInput;

        const closeButtonParent = document.querySelector('[data-section="close"]');
        const closeButton = new ButtonComponent({
            name: 'close',
            title: 'Close',
            parent: closeButtonParent,
            onClick: this.callback
        });

        closeButton.render();
        this.elements.close = closeButton;

        const saveButtonParent = document.querySelector('[data-section="save"]');
        const saveButton = new ButtonComponent({
            name: 'save',
            title: 'Save',
            parent: saveButtonParent,
            type: 'submit'
        });

        saveButton.render();
        this.elements.save = saveButton;
    }

    

    onDestroy () {
        Object.values(this.elements).forEach((item) => {
            item.destroy();
        });
    }

    showNotification () {
        this.elements.notification.display = 'flex';
    }

    removeNotification () {
        this.elements.notification.display = 'none';
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

    sendFile () {
        AjaxModule.sendData({
            path: '/user/avatar',
            file: this.elements.upload.file
        });
    }

    submitEvent (event) {
        event.preventDefault();

        const email = this._form.elements.email.value.trim();
        const password = this._form.elements.password.value.trim();

        const body = { email, password };
        let errorExpression = !email && !password && !this.elements.upload.file;
        let errorMsg = 'fill something to submit';

        if (errorExpression) {
            this._addFormError(errorMsg);
            this.removeNotification();
            return;
        }

        if (password.length && password.length < 5) {
            this._addFormError('Password must be longer than 5 characters');
            this.removeNotification();
            return;
        }

        if (this.elements.upload.file) {
            this.sendFile();
        }

        this.body = body;

        AjaxModule.doFetchPost({
            path: this._path,
            body: this.body,
		})
			.then(response => {
                if (!response.ok) {
                    let error =  new Error("Incorrect user data");
                    error.response = response;
                    throw error;
                } 
                this.showNotification();
                this._form.elements.email.value = '';
                this._form.elements.password.value = '';
                this.file = null;
        
                return AjaxModule.doFetchGet({
                    path: '/user',
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }                                 
                return response.json();
            })
            .then(response => {
                this.userInfo = response;
                console.log(this.userInfo);
                this.addInfo();
            })
            .catch(e => {
                this._addFormError(error.message);
                this.removeNotification();
                alert('Error: ' + e.message  + " " + e.response.status + " " + e.response.statusText);
                console.log('Error: ' + e.message);
                console.log(e.response);
            });

    };

    render () {
        AjaxModule.doFetchGet({
            path: '/user',
        })
            .then(response => {
                if (!response.ok) {
                    let error =  new Error("Can't get user data, status code: ");
                    error.response = response;
                    throw error;
                } 
                return response.json();
            })
            .then(response => {
                this.userInfo = response;

                this._parent.innerHTML = window.fest['components/Profile/Profile.tmpl']();

                this.insertElements = {
                    img: document.querySelector('.profile-form__img'),
                    nickname: document.querySelector('[data-section="nickname"]'),
                    email: document.querySelector('[data-section="current-email"]'),
                    score: document.querySelector('[data-section="max-score"]')
                };

                this.addInfo();
                this._renderAllComponents();
                this._errorDiv = document.querySelector('.profile-form__error');
                this._errorDiv.display = 'none';
                this._form = document.querySelector('form');
                this._form.addEventListener('submit', this.submitEvent);
            })
            .catch(e => {
                alert('Error: ' + e.message  + " " + e.response.status + " " + e.response.statusText);
                console.log('Error: ' + e.message);
                console.log(e.response);
            });
    }
}
