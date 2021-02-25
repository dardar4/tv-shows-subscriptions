import axios from 'axios'

const CINEMA_API_URL = process.env.REACT_APP_CINEMA_API_URL + '/api';

const handleResponse = (response) => {
    //console.log('CinemaApi::handleResponse', response); //TODO: delete of better logger ?
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
        {
            response = await axios.post(`${CINEMA_API_URL}/account/login`, {
                userName : params[0],
                password : params[1] 
            });
            break;
        }
        case 'createAccount':
        {
            response = await axios.post(`${CINEMA_API_URL}/account/create`, {
                userName : params[0],
                newPassword : params[1] 
            })
            break;
        }
        case 'getUsers':
        {
            response = await axios.get(CINEMA_API_URL + '/users');
            break;
        }
        case 'addUser':
        {
            const userData = params[0];
            response = await axios.post(CINEMA_API_URL + '/users/', userData);
            break;
        }
        case 'updateUser':
        {
            const userData = params[0];
            response = await axios.patch(`${CINEMA_API_URL}/users/${userData._id}`, userData);
            break;
        }
        case 'deleteUser':
        {
            const userId = params[0];
            response = await axios.delete(`${CINEMA_API_URL}/users/${userId}`);
            break;
        }
        case 'getShows':
        {
            response = await axios.get(CINEMA_API_URL + '/shows');
            break;
        }
        case 'addShow':
        {
            const showData = params[0];
            response = await axios.post(CINEMA_API_URL + '/shows/', showData);
            break;
        }
        case 'updateShow':
        {
            const showData = params[0];
            response = await axios.patch(`${CINEMA_API_URL}/shows/${showData.showID}`, showData);
            break;
        }
        case 'deleteShow':
        {
            const showID = params[0];
            response = await axios.delete(`${CINEMA_API_URL}/shows/${showID}`);
            break;
        }
        case 'getMembers':
        {
            response = await axios.get(`${CINEMA_API_URL}/members`);
            break;
        }
        case 'addMember': 
        {
            const memberData = params[0];
            response = await axios.post(`${CINEMA_API_URL}/members`, memberData);
            break;
        }
        case 'updateMember':
        {
            const memberId = params[0];
            const memberData = params[1];
            response = await axios.patch(`${CINEMA_API_URL}/members/${memberId}`, memberData);
            break;
        }
        case 'deleteMember':
        {
            const memberId = params[0];
            response = await axios.delete(`${CINEMA_API_URL}/members/${memberId}`);
            break;
        }
        case 'createShowSubscription':
        {
            const subscribeShowData = params[0];
            response = await axios.post(`${CINEMA_API_URL}/subscriptions`, subscribeShowData);
            break;
        }
        case 'updateShowSubscription':
        {
            const memberID = params[0];
            const subscribeShowData = params[1];
            response = await axios.patch(`${CINEMA_API_URL}/subscriptions/${memberID}`, subscribeShowData);
            break;
        }
        case 'getSubscriptions':
        {
            response = await axios.get(`${CINEMA_API_URL}/subscriptions`);
            break;
        }
        default:
            console.warn(`Cinema Api action=${action} is not supported`)
            return null;
    }

    return handleResponse(response.data);
}

export default { 
    invoke,
}