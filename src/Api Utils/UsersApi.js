import axios from 'axios'

const Users_URL = 'https://jsonplaceholder.typicode.com/users'

const getAllUsers = () => {
    return axios.get(Users_URL);
}

export default { getAllUsers }