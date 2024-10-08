import { BaseApi } from "../const/api";
import { apiRoutes } from "../const/apiroutes";

export const OrderApi = {
    // Base
    BaseTest(params) {
        return BaseApi.get(apiRoutes.order.baseTest, { ...params });
    },
    // Order
    AddOrder(data) {
        return BaseApi.post(apiRoutes.order.add, data);
    },
    GetByOrderId(data) {
        return BaseApi.get(`${apiRoutes.order.getByOrderId}?id=${data.id}`);
    },
    GetSearchTable(data) {
        return BaseApi.post(apiRoutes.order.getSearchTable, data);
    },
    OrderTest(params) {
        return BaseApi.get(apiRoutes.order.test, { ...params });
    },
};
