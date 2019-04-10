export default class GameControllers {
    constructor(root) {
        this.root = root;
        this.previous = {};
        this.keys = [];

        //this._onKeyPress = this._keyHandler.bind(this, 'press');
        this._onKeyDown = this._keyHandler.bind(this, 'down');
        this._onKeyUp = this._keyHandler.bind(this, 'up');
    }

    /**
     * Начинаем слушать события клавиатуры
     */
    start() {
        document.addEventListener('keydown', this._onKeyDown);
        //document.addEventListener('keypress', this._onKeyPress);
        document.addEventListener('keyup', this._onKeyUp);
    }

    /**
     * Прекращаем слушать события клавиатуры
     */
    destroy() {
        document.removeEventListener('keydown', this._onKeyDown);
        //document.removeEventListener('keypress', this._onKeyPress);
        document.removeEventListener('keyup', this._onKeyUp);
    }

    /**
     * Нажата ли клавиша?
     * @param  {string}  key
     * @return {boolean}
     */
    is(key) {
        return this.keys[key];
    }

    /**
     * Обработчик события
     * @param  {string} type
     * @param  {MouseEvent} event
     */
    _keyHandler(type, event) {
        // this.keys[event.key.toLowerCase()] = type === 'down';
        // this.keys[event.key.toLowerCase()] = type === 'press';
        // this.keys[event.key.toLowerCase()] = type === 'up';
        this.keys[event.key.toLowerCase()] = type;
        console.log('key type: ', this.keys[event.key.toLowerCase()]);
    }

    /**
     * Получить клавиши, нажатые с момента прошлого запроса
     * @returns {*}
     */
    diff() {
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
            return res;
        }, {});
        
        
        // console.log(this.keys);
        this.previous = this.keys.slice(0);
        //console.log('key type inside: ', this.keys[event.key.toLowerCase()]);
        this.previous = this.previous.filter((key) => {
            return key !== 'up';
        });

        return clicked;
    }
};