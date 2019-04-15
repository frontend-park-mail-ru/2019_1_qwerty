import View from './View.js';
import { UPDATE_USER, API_STATIC } from '../config.js';
import NotificationView from './NotificationView.js';
import FileInputView from './FileInputView.js';
import InputView from './InputView.js';
import ButtonView from './ButtonView.js';

export default class ProfileView extends View {
    constructor ({
        parent = document.body,
        callbacks = {},
        nameOfView = 'profile',
        parentView = null,
        userInfo = {}
    }) {
        super({
            parent,
            callbacks,
            nameOfView,
            parentView
        });
        this.elements = {};
        this.insertElements = {};
        this._errorDiv = null;
        this.path = UPDATE_USER;
        this.userInfo = userInfo;
    }

    addInfo () {
        this.insertElements.img.src = API_STATIC + this.userInfo.avatar;
        this.insertElements.nickname.textContent = this.userInfo.name;
        this.insertElements.email.textContent = this.userInfo.email;
        this.insertElements.score.textContent = this.userInfo.score;
    }

    render () {
        this.parent.innerHTML = window.fest['components/Profile/Profile.tmpl']();

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
        this.elem = document.querySelector('form');
        this.setEvents();
    }

    showNotification () {
        this.elements.notification.display = 'flex';
    }

    removeNotification () {
        this.elements.notification.display = 'none';
    }

    onDestroy () {
        super.onDestroy();
        Object.values(this.elements).forEach((item) => {
            item.onDestroy();
        });
    }

    _renderAllComponents () {
        const notificationParent = document.querySelector('[data-section="profile-notification"]');
        const notification = new NotificationView({
            parent: notificationParent,
            parentView: this,
            nameOfView: 'Notification'
        });
        notification.render();
        notification.display = 'none';
        this.elements.notification = notification;

        const uploadParent = document.querySelector('[data-section="change-button"]');
        const uploadInput = new FileInputView({
            parent: uploadParent,
            title: 'Change',
            callbacks: this.callbacksForView,
            parentView: this,
            nameOfView: 'upload'
        });
        uploadInput.render();
        this.elements.upload = uploadInput;

        const emailParent = document.querySelector('[data-section="email"]');
        const emailInput = new InputView({
            name: 'email',
            type: 'email',
            placeholder: 'New Email',
            isPassword: false,
            parent: emailParent,
            callbacks: this.callbacksForView,
            nameOfView: 'email',
            parentView: this
        });
        emailInput.render();
        this.elements.email = emailInput;

        const passwordParent = document.querySelector('[data-section="password"]');
        const passwordInput = new InputView({
            name: 'password',
            type: 'password',
            placeholder: 'New Password',
            parent: passwordParent,
            isPassword: true,
            callbacks: this.callbacksForView,
            nameOfView: 'password',
            parentView: this
        });
        passwordInput.render();
        this.elements.password = passwordInput;

        const closeButtonParent = document.querySelector('[data-section="close"]');
        const closeButton = new ButtonView({
            name: 'close',
            title: 'Close',
            parent: closeButtonParent,
            type: 'button',
            callbacks: this.callbacksForView,
            parentView: this,
            nameOfView: 'close'
        });
        closeButton.render();
        this.elements.close = closeButton;

        const saveButtonParent = document.querySelector('[data-section="save"]');
        const saveButton = new ButtonView({
            name: 'save',
            title: 'Save',
            parent: saveButtonParent,
            type: 'submit',
            callbacks: this.callbacksForView,
            parentView: this,
            nameOfView: 'save'
        });

        saveButton.render();
        this.elements.save = saveButton;
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
}
