import View from './View.js';
import ButtonView from './ButtonView.js';
import HeaderView from './HeaderView.js';
import template from '../templates/Menu/Menu.tmpl.xml';
import isMobile from '../utils/Mobile.js';

export default class MenuView extends View {
    constructor ({
        parent = document.body,
        callbacks = {},
        nameOfView = 'menu',
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
        this.headerTitles = headerTitles;
        this.parentView = this;
        this.resize = this.resize.bind(this);
    }

    onDestroy () {
        Object.values(this.mainMenuButtons).forEach((button) => {
            button.onDestroy();
        });
        this.header.onDestroy();
        removeEventListener('resize', this.resize);
    }
    resize () {
        const headerClass = (isMobile()) ? '.menu-header' : '.menu-header_mobile';
        console.log(headerClass);
        const hideHeader = document.querySelector(`${headerClass} .menu-header__item_width_m`);
        hideHeader.innerHTML = '';
        console.log(isMobile());
        event.preventDefault();
        this.header.onDestroy();
        this.renderHeader();
    }

    renderHeader () {
        const headerClass = (isMobile()) ? '.menu-header_mobile' : '.menu-header';
        const headerParent = document.querySelector(`${headerClass} .menu-header__item_width_m`);
        this.header = new HeaderView({
            callbacks: this.callbacksForView,
            parent: headerParent,
            pages: this.pages,
            headerTitles: this.headerTitles
        });
        this.header.render();
    }
    render () {
        addEventListener('resize', this.resize);
        const elements = Object.keys(this.menuItems);
        this.parent.innerHTML = template(elements);
        this.elem = document.querySelector('.menu-main');
        this.renderHeader();

        Object.entries(this.menuItems).forEach(([key, title]) => {
            const parent = document.querySelector(`[data-section="${key}"]`);
            const button = new ButtonView({
                title,
                parent,
                callbacks: this.callbacksForView,
                name: key,
                nameOfView: key,
                parentView: this
            });
            this.mainMenuButtons[key] = button;
            button.render();
        });
    }
}
