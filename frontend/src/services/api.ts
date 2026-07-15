import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5023/api', // Porta real da API!
  headers: {
    'Content-Type': 'application/json',
  },
});