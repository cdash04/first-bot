import axios, { AxiosRequestConfig } from 'axios';

const baseApiConfig: AxiosRequestConfig = {
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
};

export const apiClient = axios.create({
  baseURL: process.env.APP_API_URL,
  ...baseApiConfig,
});
