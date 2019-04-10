import View from './View.js';

export default class CanvasView extends View {
    constructor ({
        parent = document.body,
        callbacks = {},
        nameOfView = 'canvas',
        parentView
    }) {
        super({
            parent,
            callbacks,
            nameOfView,
            parentView
        });
    }

    render () {
        this.parent.innerHTML = window.fest['components/Canvas/Canvas.tmpl'](this);

        this.elem = document.querySelector(`.canvas`);

        this.setEvents();

        
    }
}
