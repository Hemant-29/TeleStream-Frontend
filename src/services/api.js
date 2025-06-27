import axios from 'axios'

const base_url = "http://localhost:5000/api/v1";

export const getRequest = async (path) => {
    try {
        const response = await axios.get(`${base_url}/${path}`);
        const data = await response.json();
        console.log("response:", data);
        return data.results;
    } catch (error) {
        console.error("An error occurred:", error)
    }
}

