import View from './View.js';
import ButtonView from './ButtonView.js';
import template from '../components/404NotFound/Error404.tmpl.xml';

export default class Error404View extends View {
    constructor ({
        parent,
        callbacks,
        nameOfView = 'Error404',
        parentView
    }) {
        super({
            parent,
            callbacks,
            nameOfView,
            parentView
        });
        this.elements = {};
    }

    onDestroy () {
        this.elements.back.onDestroy();
    }

    render () {
        // this.parent.innerHTML = window.fest['components/404NotFound/Error404.tmpl']();
        this.parent.innerHTML = template();
        const buttonParent = document.querySelector('.error__button');
        const button = new ButtonView({
            name: 'back',
            title: 'Back to Home',
            parent: buttonParent,
            callbacks: this.callbacksForView,
            nameOfView: 'back',
            parentView: this
        });
        button.render();
        this.elements.back = button;
    }
}
