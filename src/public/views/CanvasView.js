import View from './View.js';
import template from '../components/Canvas/Canvas.tmpl.xml';

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
        this.parent.innerHTML = template();
        this.elem = document.querySelector(`.canvas`);
        console.log('size of canvas: ', this.elem.width, this.elem.height);
        this.setEvents();
    }
}
