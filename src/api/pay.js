import axios from "axios";

const instance = axios.create({
  baseURL: "/",
  timeout: 1000,
  //baseURL: "https://liqpay-web-project.onrender.com",
});

export const startPayService = async () => {
  try {
    const response = await instance.get("/init");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getPayData = async (formData) => {
  try {
    const { data } = await instance.post("/keys", formData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const sendPayStatus = async (formData) => {
  try {
    const { data } = await instance.post("/status", formData).then(() => {
      window.location.href = "/complete.html";
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const sendInvoice = async (formData) => {
  try {
    const { data } = await instance.post("/invoice", formData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const createInvoice = async (formData) => {
  try {
    const { data } = await instance.post("/create-invoice", formData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const initInvoicePage = async (orderId) => {
  try {
    const response = await instance.get(`/i/${orderId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

setInterval(startPayService, 300000);
startPayService();
