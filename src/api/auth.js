import axios from 'axios';

const API_URL = 'http://94.74.86.174:8080/api';

export const register = async (username, email, password) => {
  return await axios.post(`${API_URL}/register`, { username, email, password });
};

export const login = async (username, password) => {
  return await axios.post(`${API_URL}/login`, { username, password });
};
