import { BaseApi } from "../const/api";
import { apiRoutes } from "../const/apiroutes";

export const AccountApi = {
    AdminLogin(data) {
        return BaseApi.post(apiRoutes.account.adminLogin, data);
    },
    Decrypt(params) {
        return BaseApi.get(apiRoutes.account.decrypt, { ...params });
    },
    Encrypt(params) {
        return BaseApi.get(apiRoutes.account.encrypt, { ...params });
    },
    Login(data) {
        return BaseApi.post(apiRoutes.account.login, data);
    },
    SalesmanLogin(data) {
        return BaseApi.post(apiRoutes.account.SalesmanLogin, data);
    },
    RefreshToken(data) {
        return BaseApi.post(apiRoutes.account.refreshToken, data);
    },
    Test(params) {
        return BaseApi.get(apiRoutes.account.test, { ...params });
    }
};
