import AjaxModule from '../modules/ajax.js';
import EventBus from '../modules/EventBus.js';
import { SEND_IMAGE, CURRENT_USER, UPDATE_USER } from '../config.js';

export default class ProfileService {
    requestForCurrentUser () {
        AjaxModule.doFetchGet({
            path: CURRENT_USER
        })
            .then(response => {
                if (!response.ok) {
                    let error = new Error('Can not get user data, status code: ');
                    error.response = response;
                    throw error;
                }

                return response.json();
            })
            .then(data => {
                EventBus.emit('profile-model:get-current-user', data);
            })
            .catch(e => {
                alert('Error: ' + e.message);
                console.log(`Error:  ${e.message}, ${e.response.status}, ${e.response.statusText}`);
            });
    }

    sendUserInfo (body) {
        AjaxModule.doFetchPost({
            path: UPDATE_USER,
            body
        })
            .then(response => {
                if (!response.ok) {
                    let error = new Error('Incorrect user data');
                    error.response = response;
                    throw error;
                }
                if (body.upload) {
                    return AjaxModule.sendData({
                        path: SEND_IMAGE, file: body.upload
                    });
                }
                return response;
                // EventBus.emit('profile-model:show-notification');
                // EventBus.emit('profile-model:clear-fields');
                // return AjaxModule.doFetchGet({
                //     path: CURRENT_USER
                // });
            })
            .then(response => {
                if (body.upload) {
                    console.log(response);
                    if (!response.ok) {
                        let error = new Error('Incorrect image data');
                        error.response = response;
                        throw error;
                    }
                }
                EventBus.emit('profile-model:show-notification');
                EventBus.emit('profile-model:clear-fields');
                return AjaxModule.doFetchGet({
                    path: CURRENT_USER
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then(response => {
                console.log(response);
                EventBus.emit('profile-model:add-info', response);
            })
            .catch(e => {
                EventBus.emit('profile-model:add-error', e.message);
                EventBus.emit('profile-model:remove-notification');
                console.log(`Error:  ${e.message}, ${e.response.status}, ${e.response.statusText}`);
            });
    }
}
