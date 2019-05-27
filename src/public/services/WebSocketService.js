import { API_WS_URL, WS_NICKNAME } from '../config.js';

const noop = () => null;
export default class WebSocketService {
  constructor (path, nickname) {
    this.path = path;
    this.nickname = nickname;
    this.actions = {};
    this.addCallbacks = this.addCallbacks.bind(this);
    this.init = this.init.bind(this);
  }

  init () {
    let nickname = this.nickname;
    let path = this.path;
    this.connection = new Promise(function (resolve, reject) {
      const wsClient = new WebSocket(`${API_WS_URL}${path}?nickname=${nickname}`);
      wsClient.onopen = () => {
        console.log('ws connected');
        resolve(wsClient);
      };
      wsClient.onerror = function (error) {
        console.log('Ошибка ' + error.message);
        reject(error);
      };
    })
      .then((wsClient) => {
        this.addCallbacks(wsClient);
        return wsClient;
      });
  }

  addCallbacks (wsClient) {
    // Чтение входящих сообщений
    wsClient.onmessage = function (event) {
      const data = JSON.parse(event.data);
      // console.log("action: ", data.action);

      if (!this.actions.hasOwnProperty(data.action)) {
        throw new Error('Invalid action:' + data.action);
      }
      this.actions[data.action](data);
    }.bind(this);

    wsClient.onclose = function (event) {
      if (event.wasClean) {
        console.log('Соединение закрыто чисто');
      } else {
        console.log('Обрыв соединения'); // например, "убит" процесс сервера
      }
      console.log('Код: ' + event.code + ' причина: ' + event.reason);
    };
  }

  reject (error) {
    throw new Error(error);
  }

  send (action = '', data = {}) {
    console.log("sending: ", JSON.stringify(data));
    data.action = action;
    this.connection = this.connection
      .then((wsClient) => {
        wsClient.send(JSON.stringify(data));
        return wsClient;
      })
      .catch(e => {
        console.log(`Error:  ${e.message}, ${e.response.status}, ${e.response.statusText}`);
    });
  }

  subscribe (action = '', callback = noop) {
    if (this.actions.hasOwnProperty(action)) {
      throw new Error('this action is already exists');
    }
    this.actions[action] = callback;
  }
}
