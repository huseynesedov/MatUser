import axios from "axios";
import siteUrl from "./const";
import { AccountApi } from "../api/account.api";

const BASE_URL = siteUrl;

const createConfig = (params, contentType) => {
    let token = localStorage.getItem('token');

    let config = {};
    if (params) {
        config["params"] = params;
    }
    if (token) {
        config["headers"] = { "Content-Type": contentType, "Authorization": `Bearer ${token}` };
    }
    return config;
};

const createJsonConfig = (params) => {
    return createConfig(params, "application/json;charset=UTF-8");
};

const createFormDataConfig = (params) => {
    return createConfig(params, "multipart/form-data");
};

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});


axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response && error.response.data.status === 2017 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    const { data } = await AccountApi.RefreshToken({ refreshToken });

                    localStorage.setItem('token', data.accessToken);
                    localStorage.setItem('refreshToken', data.refreshToken);

                    originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
                    return axiosInstance(originalRequest);
                    
                } catch (refreshError) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('loggedIn');
                    localStorage.removeItem('roleId');
                    return Promise.reject(refreshError);
                }
            }
        }
        // window.location.reload();
        return Promise.reject(error);
    }
);

export const BaseApi = {
    get(url, params) {
        let fullUrl = `${BASE_URL}${url}`;
        let config = createJsonConfig(params);
        return axiosInstance.get(fullUrl, config).then(response => response.data);
    },
    post(url, params, queryParams) {
        let fullUrl = `${BASE_URL}${url}`;
        let config = createJsonConfig(queryParams);
        return axiosInstance.post(fullUrl, params, config).then(response => response.data);
    },
    postFormData(url, params, queryParams) {
        let fullUrl = `${BASE_URL}${url}`;
        let formData = new FormData();
        Object.keys(params).forEach(key => {
            let value = params[key];
            formData.append(key, value);
        });
        let config = createFormDataConfig(queryParams);
        return axiosInstance.post(fullUrl, formData, config).then(response => response.data);
    },
    postFormDataFile(url, params) {
        let fullUrl = `${BASE_URL}${url}`;
        let formData = new FormData();
        Object.keys(params).forEach(key => {
            let value = params[key];
            formData.append(key, value);
        });
        let config = createFormDataConfig();
        return axiosInstance.post(fullUrl, formData, config).then(response => response.data);
    },
    delete(url, params) {
        let fullUrl = `${BASE_URL}${url}`;
        let config = createJsonConfig(params);
        return axiosInstance.delete(fullUrl, config).then(response => response.data);
    },
    deleteNew(url, params) {
        let fullUrl = `${BASE_URL}${url}`;
        let config = createJsonConfig();
        return axiosInstance.delete(fullUrl, { ...config, data: params }).then(response => response.data);
    },
    put(url, params) {
        let fullUrl = `${BASE_URL}${url}`;
        let config = createJsonConfig();
        return axiosInstance.put(fullUrl, params, config).then(response => response.data);
    },
    getBaseUrl() {
        return BASE_URL;
    }
};
