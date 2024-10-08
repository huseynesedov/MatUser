import { BaseApi } from "../const/api";
import { apiRoutes } from "../const/apiroutes";

export const AdminApi = {
    // Updated usage of the apiRoutes.user object
    AddCustomerUser(data) {
        return BaseApi.post(apiRoutes.user.addCustomerUser, data);
    },
    AddSalesmanUser(data) {
        return BaseApi.post(apiRoutes.user.addSalesmanUser, data);
    },
    DeleteUser(userId) {
        return BaseApi.delete(apiRoutes.user.deleteUser, { data: { id: userId } });
    },
    GetUserById(userId) {
        return BaseApi.get(apiRoutes.user.getUserById, { params: { id: userId } });
    },
    GetForUpdateById(userId) {
        return BaseApi.get(apiRoutes.user.getForUpdateById, { params: { id: userId } });
    },
    GetUserTable(params) {
        return BaseApi.get(apiRoutes.user.getUserTable, { params });
    },
    GetUserPersonalInformationById(userId) {
        return BaseApi.get(apiRoutes.user.getUserPersonalInformationById,  { id: userId  });
    },
    UpdateUser(data) {
        return BaseApi.put(apiRoutes.user.updateUser, data);
    },
    UpdateUserPassword(data) {
        return BaseApi.put(apiRoutes.user.updateUserPassword, data);
    }
};
