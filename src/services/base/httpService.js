import axios from 'axios';
import { config } from '../../config';

export class HttpService {
  constructor(baseURL = config.api.baseUrl) {
    this.http = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    this.http.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.http.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  async get(url, config) {
    const response = await this.http.get(url, config);
    return response.data;
  }

  async post(url, data, config) {
    const response = await this.http.post(url, data, config);
    return response.data;
  }
}
