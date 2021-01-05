import axios from 'axios'


const Cinema_URL = 'http://localhost:9000/api'

const getAllUsers = () => {
    return axios.get(Cinema_URL + '/users/');
}

const checkUserLogin = async (userName, password) => {
    const response = await axios.post(`${Cinema_URL}/login`, {
        userName,
        password 
    });

    if(response.data.error){
        return null;
    }

    return response.data.result;
}

export default { 
    getAllUsers, 
    checkUserLogin 
}