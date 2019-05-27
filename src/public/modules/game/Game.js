import OfflineGame from './OfflineGame.js';
import OnlineGame from './OnlineGame.js';
import GAME_MODES from './Modes.js';
import GameScene from './GameScene.js';
import GameControllers from './GameControllers.js';

export default class Game {
    constructor (mode, canvas) {
        let GameConstructor = null;
        let isOnline = 0;
        switch (mode) {
            case GAME_MODES.ONLINE: {
                GameConstructor = OnlineGame;
                isOnline = 1;
                break;
            }
            case GAME_MODES.OFFLINE: {
                GameConstructor = OfflineGame;
                break;
            }
            default:
                throw new Error('Invalid game mode ' + mode);
        }

        this.gameScene = new GameScene(canvas, isOnline);
        this.gameControllers = new GameControllers(canvas);
        this.gameCore = new GameConstructor(this.gameControllers, this.gameScene);
    }

    start () {
        this.gameCore.start();
    }

    destroy () {
        this.gameCore.destroy();
    }
}
