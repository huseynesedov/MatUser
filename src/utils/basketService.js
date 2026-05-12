// utils/basketService.js

import { BasketApi, BasketSalesmanApi } from '../api/basket.api';


export const callBasketApi = async (methodName, payload) => {
    const roleId = localStorage.getItem('role');
    const api = roleId === '$Customer' ? BasketApi : BasketSalesmanApi;

    if (!api[methodName]) {
        throw new Error(`${methodName} metodu bulunamadı`);
    }

    return api[methodName](payload);
};
