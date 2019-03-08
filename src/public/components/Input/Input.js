
export default class InputComponent {
    constructor ({
        name = '',
        type = 'text',
        classes = [],
        placeholder = '',
        isPassword = false
    } = {}) {
        this.name = name;
        this.type = type;
        this.classes = classes;
        this.placeholder = placeholder;
        this.isPassword = isPassword;
    }

    onFocus () {
        const elem = document.querySelector(`input[name='${this.name}']`);
        elem.addEventListener('focus', (event) => {
            event.preventDefault();

            this._callback();
        });
    }

    showPassword () {
        if (!this.isPassword) {
            return null;
        }
        const elem = document.querySelector(`input[name='${this.name}']`);
        const showIcon = document.querySelector('.sign-x-form__icon');
        showIcon.addEventListener('click', (event) => {
            elem.type = elem.type === 'password' ? 'text' : 'password';
        });
    }
    set callback (callback) {
        this._callback = callback;
    }

    get callback () {
        return this._callback;
    }
}
