import axios from 'axios';

const instance = axios.create({
  //   baseURL: 'http://localhost:3000',
  baseURL: 'https://rozkvitay-b.onrender.com',
});

export const startPayService = async () => {
  try {
    const response = await instance.get('/init');
    return response;
  } catch (error) {
    throw error;
  }
};

export const getPayData = async formData => {
  try {
    const { data } = await instance.post('/keys', formData);
    return data;
  } catch (error) {
    throw error;
  }
};

setInterval(startPayService, 300000);
startPayService();
