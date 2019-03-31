import View from './View.js';
import ButtonView from './ButtonView.js';
import HeaderView from './HeaderView.js';

export default class MenuView extends View {
    constructor ({
        parent = document.body,
        callbacks = {},
        nameOfView = '',
        menuItems = {},
        headerTitles = {}
    } = {}) {
        super({
            parent,
            nameOfView,
            callbacks
        });
        this.menuItems = menuItems;
        this.header = null;
        this.mainMenuButtons = {};
        this.destroy = this.onDestroy.bind(this);
        this.headerTitles = headerTitles;
        this.parentView = this;
    }

    onDestroy () {
        Object.values(this.mainMenuButtons).forEach((button) => {
            button.onDestroy();
        });
        this.header.onDestroy();
    }

    render () {
        const elements = Object.keys(this.menuItems);
        this.parent.innerHTML = window.fest['components/Menu/Menu.tmpl'](elements);

        this.elem = document.querySelector('.menu-main');

        const headerParent = document.querySelector('.menu-header__item_width_m');
        this.header = new HeaderView({
            callbacks: this.callbacks,
            parent: headerParent,
            pages: this.pages,
            destroy: this.destroy,
            headerTitles: this.headerTitles
        });
        this.header.render();

        Object.entries(this.menuItems).forEach(([key, title]) => {
            const parent = document.querySelector(`[data-section="${key}"]`);
            const button = new ButtonView({
                title,
                parent,
                callbacks: this.callbacks,
                name: key,
                nameOfView: key,
                parentView: this
            });
            this.mainMenuButtons[key] = button;
            button.render();
        });
    }
}
