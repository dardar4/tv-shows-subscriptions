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

    switch (action) {
        case 'checkLogin':
            response = await axios.post(`${Cinema_URL}/login`, {
                userName : params[0],
                password : params[1] 
            });
            break;
        case 'getAllUsers':
            response = await axios.get(Cinema_URL + '/users/');
            break;
        case 'addUser':
            response = await axios.post(Cinema_URL + '/users/', params[0]);
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