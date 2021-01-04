import axios from 'axios'

const Movies_URL = 'https://api.tvmaze.com/shows'

const getAllMovies = () => {
    return axios.get(Movies_URL);
}

export default { getAllMovies }