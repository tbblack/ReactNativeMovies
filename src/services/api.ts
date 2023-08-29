import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://api.themoviedb.org/3',
    params: {
        api_key: '065fc2c26d14062371826c28e80b73e4',
        language: 'pt-BR',
        include_adult: false,
    }
});