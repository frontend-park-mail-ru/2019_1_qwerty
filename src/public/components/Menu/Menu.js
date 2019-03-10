import ButtonComponent from '../Button/Button.js';
import HeaderComponent from '../Header/Header.js';

export default class MenuComponent {
    constructor ({
        parent = document.body,
        pages = {}
    } = {}) {
        this._parent = parent;
        this.menuItems = {
            singleplayer: 'Singleplayer',
            multiplayer: 'Multiplayer',
            score: 'Scoreboard',
            authors: 'Authors'
        };
        this.pages = pages;
        this.header = null;
        this.mainMenuButtons = {};
        this._elem = null;
        this.onClickItem = this.onClickItem.bind(this);
    }

    onClickItem (event) {
        const currentTarget = event.target;

        if (!(currentTarget instanceof HTMLButtonElement)) {
            return;
        }
        const name = currentTarget.name;
        const button = this.mainMenuButtons[name];
        if (!button) {
            return;
        }
        event.preventDefault();

        button.onClick();
        this.onDestroy();
    };

    onDestroy () {
        Object.values(this.mainMenuButtons).forEach((button) => {
            this._parent.removeEventListener('click', button.onClick);
        });

        this.header.destroy();
    }

    render () {
        const elements = Object.keys(this.menuItems);
        this._parent.innerHTML = window.fest['components/Menu/Menu.tmpl'](elements);

        this._elem = document.querySelector('.menu-main');

        const headerParent = document.querySelector('.menu-header__item_width_m');
        this.header = new HeaderComponent({
            parent: headerParent,
            pages: this.pages,
            callback: this.onDestroy.bind(this)
        });
        this.header.render();

        Object.entries(this.menuItems).forEach(([key, title]) => {
            const parent = document.querySelector(`[data-section="${key}"]`);
            const button = new ButtonComponent({
                title,
                name: key,
                parent,
                onClick: this.pages[key]
            });
            this.mainMenuButtons[key] = button;
            button.render();
        });

        this._elem.addEventListener('click', this.onClickItem);
    }
}
