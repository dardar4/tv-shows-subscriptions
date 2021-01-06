import axios from 'axios'

const Cinema_URL = 'http://localhost:9000/api'

const handleResponse = (response) => {
    console.log(response); //TODO: delete of better logger ?
    if(response.error){
        console.error(response.error);
        return null;
    }

    return response.result;
}

const invoke = async (action, ...params) => {
    let response = null;
    let userData = null;

    switch (action) {
        case 'checkLogin':
            response = await axios.post(`${Cinema_URL}/account/login`, {
                userName : params[0],
                password : params[1] 
            });
            break;
        case 'createAccount':
            response = await axios.post(`${Cinema_URL}/account/create`, {
                userName : params[0],
                newPassword : params[1] 
            })
            break;
        case 'getUsers':
            response = await axios.get(Cinema_URL + '/users/');
            break;
        case 'addUser':
            userData = params[0];
            response = await axios.post(Cinema_URL + '/users/', userData);
            break;
        case 'updateUser':
            userData = params[0];
            response = await axios.patch(`${Cinema_URL}/users/${userData.id}`, userData);
            break;
        case 'deleteUser':
            const userId = params[0];
            response = await axios.delete(`${Cinema_URL}/users/${userId}`);
            break;
        default:
            console.warn(`Cinema Api action=${action} is not supported`)
            return null;
    }

    return handleResponse(response.data);
}

export default { 
    invoke,
}