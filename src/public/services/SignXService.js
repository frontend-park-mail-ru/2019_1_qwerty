import AjaxModule from '../modules/ajax.js';

export default class SignXService {
    requestForSignupOrSignin ({ formView, body }) {
        AjaxModule.doFetchPost({
            path: formView._path,
            body: body
        })
            .then(response => {
                if (!response.ok) {
                    let error = new Error('Incorrect Nickname and/or password');
                    error.response = response;
                    throw error;
                }
                formView.onDestroy();
                formView._afterSuccessSubmit();
            })
            .catch(e => {
                formView._addFormError(e.message);
                console.log(`Error:  ${e.message}, ${e.response.status}, ${e.response.statusText}`);
            });
    }
}