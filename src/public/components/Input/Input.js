
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
        console.log(window.fest);
        this.parent.innerHTML = window.fest['components/Input/Input.tmpl'](this);

        this._elem = document.querySelector(`input[name='${this.name}']`);

        this.addEventOnFocus();
        this.showPassword();
    }

    addEventOnFocus () {
        this._elem.addEventListener('focus', (event) => {
            event.preventDefault();

            this._onFocus();
        });
    }

    showPassword () {
        if (!this.isPassword) {
            return null;
        }
        const showIcon = document.querySelector('.sign-x-form__icon');
        showIcon.addEventListener('click', (event) => {
            this._elem.type = this._elem.type === 'password' ? 'text' : 'password';
        });
    }
    set onFocus (callback) {
        this._onFocus = callback;
    }

    get onFocus () {
        return this._onFocus;
    }
}
