import AjaxModule from '../modules/ajax.js';
import EventBus from '../modules/EventBus.js';

export default class ProfileService {
    requestForCurrentUser (path) {
        const promise = AjaxModule.doFetchGet({
            path
        })
            .then(response => {
                if (!response.ok) {
                    let error = new Error('Can not get user data, status code: ');
                    error.response = response;
                    throw error;
                }
                return response.json();
            })
            .catch(e => {
                alert('Error: ' + e.message);
                console.log(`Error:  ${e.message}, ${e.response.status}, ${e.response.statusText}`);
            });
        EventBus.emit('profile-model:get-current-user', promise);
    }

    sendFile ({
        path,
        file
    }) {
        AjaxModule.sendData({
            path,
            file
        });
    }

    sendUserInfo ({
        path,
        body,
        pathForInfo,
        addError,
        addInfo,
        showNotification,
        removeNotification,
        clearFields
    }) {
        AjaxModule.doFetchPost({
            path,
            body
        })
            .then(response => {
                if (!response.ok) {
                    let error = new Error('Incorrect user data');
                    error.response = response;
                    throw error;
                }
                showNotification();
                clearFields();
                return AjaxModule.doFetchGet({
                    path: pathForInfo
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
                addInfo(response);
            })
            .catch(e => {
                addError(e.message);
                removeNotification();
                console.log(`Error:  ${e.message}, ${e.response.status}, ${e.response.statusText}`);
            });
    }
}
