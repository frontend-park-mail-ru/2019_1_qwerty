import View from './View.js';

const noop = () => null;

export default class Input extends View {
    constructor ({
        name = '',
        type = 'text',
        placeholder = '',
        isPassword = false,
        parent,
        callbacks,
        nameOfView = 'Input',
        parentView = null
    }) {
        super({
            parent,
            callbacks,
            nameOfView,
            parentView
        });
        this.name = name;
        this.type = type;
        this.placeholder = placeholder;
        this.isPassword = isPassword;
        this._showIconListener = this._showIconListener.bind(this);
        // this._onFocus = onFocus;
    }

    render () {
        this.parent.innerHTML = window.fest['components/Input/Input.tmpl'](this);

        this.elem = document.querySelector(`input[name='${this.name}']`);
        if (this.isPassword) {
            this._showIcon = document.querySelector('.input__icon');
        }

        this.setEvents();
        // this.addEventOnFocus();
        this.showPassword();
    }

    onDestroy () {
        // this.elem.removeEventListener('focus', this._onFocus);
        if (this.isPassword) {
            this._showIcon.removeEventListener('click', this._showIconListener);
        }
        super.onDestroy();
    }

    getContent () {
        return this.elem.value;
    }

    _showIconListener (event) {
        this.elem.type = this.elem.type === 'password' ? 'text' : 'password';
    }

    showPassword () {
        if (!this.isPassword) {
            return null;
        }

        this._showIcon.addEventListener('click', this._showIconListener);
    }

}