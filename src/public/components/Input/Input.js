
const noop = () => null;

export default class InputComponent {
    constructor ({
        name = '',
        type = 'text',
        placeholder = '',
        isPassword = false,
        parent = document.body
    } = {}) {
        this.name = name;
        this.type = type;
        this.placeholder = placeholder;
        this.isPassword = isPassword;
        this.parent = parent;
        this._elem = null;
    }

    render () {
        this.parent.innerHTML = window.fest['components/Input/Input.tmpl'](this);

        this._elem = document.querySelector(`input[name='${this.name}']`);
        if (this.isPassword) {
            this._showIcon = document.querySelector('.sign-x-form__icon');
        }

        this.addEventOnFocus();
        this.showPassword();
    }

    destroy () {
        this._elem.removeEventListener('focus', this._onFocus);
        if (this.isPassword) {
            this._showIcon.removeEventListener('click', this._showIconListener);
        }
    }

    addEventOnFocus () {
        this._elem.addEventListener('focus', this._onFocus);
    }

    _showIconListener = (event) => {
        this._elem.type = this._elem.type === 'password' ? 'text' : 'password';
    };

    showPassword () {
        if (!this.isPassword) {
            return null;
        }

        this._showIcon.addEventListener('click', this._showIconListener);
    }
    set onFocus (callback) {
        this._onFocus = (event) => {
            event.preventDefault();

            callback(event);
        };
    }

    get onFocus () {
        return this._onFocus;
    }
}
