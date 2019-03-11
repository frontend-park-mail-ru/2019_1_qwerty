import InputComponent from '../Input/Input.js';
import ButtonComponent from '../Button/Button.js';
import AjaxModule from '../../modules/ajax.js';
import FileInputComponent from '../FileInput/FileInput.js';

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
        // this.uploadInput = null;
        // this.file = null;
        this._addFile = this._addFile.bind(this);
        this._errorDiv = null;
        this.submitEvent = this.submitEvent.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }

    // _addFile (event) {
    //     event.preventDefault();
    //
    //     this.file = this.uploadInput.files[0];
    // }

    addInfo () {
        const srcPath = `http://localhost:8080/static/${this.userInfo.avatar}`;

        this.insertElements.imgParent.src = srcPath;
        this.insertElements.imgParent.innerHTML = `<img src="${srcPath}" alt="ava" class="profile-form__img">`;

        this.insertElements.nickname.textContent = this.userInfo.name;
        this.insertElements.email.textContent = this.userInfo.email;
        this.insertElements.score.textContent = this.userInfo.score;
    }

    _renderAllComponents () {
        const uploadParent = document.querySelector('[data-section="change-button"]');
        const uploadInput = new FileInputComponent({
            parent: uploadParent,
            title: 'Change'
        });
        uploadInput.render();
        this.elements.upload = uploadInput;

        const emailParent = document.querySelector('[data-section="email"]');
        const emailInput = new InputComponent({
            name: 'email',
            type: 'email',
            placeholder: 'New Email',
            parent: emailParent
        });
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

    callbackForRender (xhr) {
        if (xhr.status === 404) {
            alert(xhr.status);
            return;
        }

        this.userInfo = JSON.parse(xhr.responseText);

        this._parent.innerHTML = window.fest['components/Profile/Profile.tmpl']();

        this.insertElements = {
            imgParent: document.querySelector('[data-section="img"]'),
            nickname: document.querySelector('[data-section="nickname"]'),
            email: document.querySelector('[data-section="current-email"]'),
            score: document.querySelector('[data-section="max-score"]')
        };

        this.addInfo();
        this._renderAllComponents();
        this._errorDiv = document.querySelector('.profile-form__error');
        this._errorDiv.display = 'none';
        this._form = document.querySelector('form');
        // this.uploadInput = document.querySelector('.inputfile');
        this._form.addEventListener('submit', this.submitEvent);
        // this.uploadInput.addEventListener('change', this._addFile);
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
        // this.insertElements.email.innerText = (this.body.email ? this.body.email : this.insertElements.email.innerText);
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
        let errorExpression = !email && !password && !this.file;
        let errorMsg = 'fill something to submit';

        if (errorExpression) {
            this._addFormError(errorMsg);
            return;
        }

        if (password.length && password.length < 5) {
            this._addFormError('Password must be longer than 5 characters');
            return;
        }

        if (this.file) {
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
