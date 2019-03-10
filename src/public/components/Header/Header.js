import AjaxModule from '../../modules/ajax.js';
import ButtonComponent from '../Button/Button.js';

export default class HeaderComponent {
    constructor ({
        parent = document.body,
        pages = {}
    } = {}) {
        this._parent = parent;
        this.pages = pages;
        this.buttons = {};
        this._elements = {};
        this._elem = null;
        this.namesAndTitles = null;
        this.onClickItem = this.onClickItem.bind(this);
    }

    onClickItem (event) {
        const currentTarget = event.target;

        if ((currentTarget instanceof HTMLButtonElement)) {
            const name = currentTarget.name;
            const button = this._elements[name];

            if (!button) {
                return;
            }

            event.preventDefault();

            button.onClick();

            this.destroy();

        }
    };

    destroy() {
        Object.entries(this._elements).forEach((keyAndButton) => {
            const [, button] = keyAndButton;
            this._parent.removeEventListener('click', button.onClick);
        });
    }

    render () {
        AjaxModule.doGet({
            path: 'http://localhost:8080/api/user/check',
            callback: (xhr) => {

                this.namesAndTitles = {
                    signin: 'Sign In',
                    signup: 'Sign Up'
                };

                if (xhr.status === 200) {
                    this.namesAndTitles = {
                        profile: 'My Profile',
                        logout: 'Log Out'
                    };
                }

                const names = Object.keys(this.namesAndTitles);
                this._parent.innerHTML = window.fest['components/Header/Header.tmpl'](names);

                this._elem = document.querySelector('.header');

                Object.entries(this.namesAndTitles).forEach((keyAndData) => {
                    const [key, data] = keyAndData;

                    const parent = document.querySelector(`[data-section="${key}"]`);
                    const button = new ButtonComponent({
                        name: key,
                        title: data,
                        parent,
                        onClick: this.pages[key]
                    });

                    button.render();

                    this._elements[key] = button;
                    this._elem.addEventListener('click', this.onClickItem);
                });



            }
        });
    }
}