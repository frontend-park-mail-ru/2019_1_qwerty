
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
        this.class = 'input';
        this.placeholder = placeholder;
        this.isPassword = isPassword;
        this.parent = parent;
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

    onDestroy () {
        this._elem.removeEventListener('focus', this._onFocus);
        if (this.isPassword) {
            this._showIcon.removeEventListener('click', this._showIconEvent);
        }
    }

    addEventOnFocus () {
        this._elem.addEventListener('focus', this._onFocus);
    }

    showPassword () {
        if (!this.isPassword) {
            return null;
        }
        this._showIconEvent = (event) => {
            this._elem.type = this._elem.type === 'password' ? 'text' : 'password';
        };

        this._showIcon.addEventListener('click', this._showIconEvent);
    }
    set onFocus (callback) {
        this._onFocus = (event) => {
            event.preventDefault();

            callback();
        };
    }

    get onFocus () {
        return this._onFocus;
    }
}
