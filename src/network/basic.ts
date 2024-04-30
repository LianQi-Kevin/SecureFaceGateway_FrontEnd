import axios from "axios";

const basic_axios = axios.create({
    baseURL: 'http://localhost:12538',
    timeout: 5000,
    headers: {
        'Access-Control-Allow-Origin': '*',
    }
})

export default basic_axios;