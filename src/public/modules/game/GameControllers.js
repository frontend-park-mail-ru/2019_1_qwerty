import { Events } from './Events.js';
import EventBus from '../EventBus.js';

export default class GameControllers {
    constructor (root) {
        this.root = root;
        this.previous = {};
        this.keys = {};
        
        // this._onKeyPress = this._keyHandler.bind(this, 'press');
        this._onKeyDown = this._keyHandler.bind(this, {type: 'down', touchKey: null});
        this._onKeyUp = this._keyHandler.bind(this, {type: 'up', touchKey: null});
        // this._onTouchStartUp = this._keyHandler.bind(this);

        EventBus.on(Events.TOUCH_STARTED, this._keyHandler.bind(this));
    }

    /**
     * Начинаем слушать события клавиатуры
     */
    start () {
        document.addEventListener('keydown', this._onKeyDown);
        // document.addEventListener('keypress', this._onKeyPress);
        document.addEventListener('keyup', this._onKeyUp);
        // document.addEventListener("touchstart", handleStart, false);
    }

    /**
     * Прекращаем слушать события клавиатуры
     */
    destroy () {
        document.removeEventListener('keydown', this._onKeyDown);
        // document.removeEventListener('keypress', this._onKeyPress);
        document.removeEventListener('keyup', this._onKeyUp);
        EventBus.off(Events.TOUCH_STARTED, this._keyHandler.bind(this));
    }

    /**
     * Нажата ли клавиша?
     * @param  {string}  key
     * @return {boolean}
     */
    is (key) {
        return this.keys[key];
    }

    /**
     * Обработчик события
     * @param  {string} type
     * @param  {MouseEvent} event
     */
    _keyHandler (data, event) {
        if (data.touchKey === null) {
            this.keys[event.key.toLowerCase()] = data.type;
        } else {
            this.keys[data.touchKey.toLowerCase()] = data.type;
        }
    }

    /**
     * Получить клавиши, нажатые с момента прошлого запроса
     * @returns {*}
     */
    diff () {
        let allkeys = [];
        allkeys.push.apply(allkeys, Object.keys(this.previous));
        allkeys.push.apply(allkeys, Object.keys(this.keys));
        allkeys = allkeys.map(k => k.toLowerCase());
        // Убираем дубликаты
        allkeys = allkeys.filter((key, pos, all) => {
            return all.indexOf(key, pos + 1) === -1;
        });

        const clicked = allkeys.reduce((res, key) => {
            res[key] = !this.previous[key] && this.keys[key] === 'down';
            if (key === 'n') this.previous[key] = true;
            if (this.keys[key] === 'up') {
                if (key === 'n') 
                    this.previous[key] = false;
            }
            return res;
        }, {});

        return clicked;
    }
};
