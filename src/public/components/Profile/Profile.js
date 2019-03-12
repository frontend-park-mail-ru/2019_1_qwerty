import InputComponent from '../Input/Input.js';
import ButtonComponent from '../Button/Button.js';
import AjaxModule from '../../modules/ajax.js';
import FileInputComponent from '../FileInput/FileInput.js';
import { API_STATIC } from '../../config.js';

const noop = () => null;

export default class ProfileComponent {
    constructor ({
        parent = document.body,
        callback = noop
    }) {
        this.callback = callback;
        this._parent = parent;
        this.elements = {};
        this.userInfo = {};
        this.insertElements = {};
        this.callbackForRender = this.callbackForRender.bind(this);
        this._errorDiv = null;
        this.submitEvent = this.submitEvent.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
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
        emailInput.render();
        emailInput.onFocus = this._onFocus.bind(this);
        this.elements.email = emailInput;

        const passwordParent = document.querySelector('[data-section="password"]');
        const passwordInput = new InputComponent({
            name: 'password',
            type: 'password',
            placeholder: 'New Password',
            parent: passwordParent,
            isPassword: true
        });
        passwordInput.render();
        passwordInput.onFocus = this._onFocus.bind(this);
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

    callbackForRender (xhr) {
        if (xhr.status === 404) {
            alert(xhr.status);
            return;
        }

        this.userInfo = JSON.parse(xhr.responseText);

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
        if (xhr.status === 404) {
            const errorMessage = 'Не верный Nickname и/или пароль';
            this._addFormError(errorMessage);
            return;
        }
        this._form.elements.email.value = '';
        this._form.elements.password.value = '';
        this.file = null;

        AjaxModule.doGet({
            path: '/user',
            callback: (xhr) => {
                if (xhr.status === 404) {
                    alert(xhr.status);
                    return;
                }
                this.userInfo = JSON.parse(xhr.responseText);
                this.addInfo();
            }
        });
    };

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
            return;
        }

        if (password.length && password.length < 5) {
            this._addFormError('Password must be longer than 5 characters');
            return;
        }

        if (this.elements.upload.file) {
            this.sendFile();
        }

        this.body = body;
        AjaxModule.doPost({
            callback: this._onSubmit,
            path: '/user/update',
            body
        });
    };

    render () {
        AjaxModule.doGet({
            path: '/user',
            callback: this.callbackForRender
        });
    }
}
