import { API_WS_URL } from '../config.js';

var cookie = require('cookie');

// var ws = new WebSocket(
//     'http://localhost/auth',
//     [],
    // {
    //     'headers': {
    //         'Cookie': cookie.serialize('id', '496E66DD')
    //     }
    // }
// );

const noop = () => null;
export default class WebSocketService {
  constructor (path) {
    this.actions = {};
    this.addCallbacks = this.addCallbacks.bind(this);
    this.connection = new Promise(function (resolve, reject) {
      const wsClient = new WebSocket("ws://178.62.211.77:8080/api/ws?nickname=ppp");
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
    wsClient.onmessage = function (event) {
      const data = JSON.parse(event.data);
      //console.log(data);
      if (!this.actions.hasOwnProperty(data.action)) {
        throw new Error('Invalid action:' + data.action);
      }
      this.actions[data.action](event.data);
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
      });
  }

  subscribe (action = '', callback = noop) {
    if (this.actions.hasOwnProperty(action)) {
      throw new Error('this action is already exists');
    }
    this.actions[action] = callback;
  }
}
