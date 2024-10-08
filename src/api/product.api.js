import { BaseApi } from "../const/api";
import { apiRoutes } from "../const/apiroutes";

export const ProductApi = {
    // Base
    DecryptBase(params) {
        return BaseApi.get(apiRoutes.product.decryptBase, { ...params });
    },
    EncryptBase(params) {
        return BaseApi.get(apiRoutes.product.encryptBase, { ...params });
    },

    // Product
    DecryptProduct(params) {
        return BaseApi.get(apiRoutes.product.decryptProduct, { ...params });
    },
    EncryptProduct(params) {
        return BaseApi.get(apiRoutes.product.encryptProduct, { ...params });
    },
    GetProductById(params) {
        return BaseApi.get(apiRoutes.product.getById, { ...params });
    },
    GetCrossListByProductId(params) {
        return BaseApi.get(apiRoutes.product.getCrossListByProductId, { ...params });
    },
    GetManufacturerAdditionalDiscountById(params) {
        return BaseApi.get(apiRoutes.product.getManufacturerAdditionalDiscountById, { ...params });
    },
    GetOemByProductId(params) {
        return BaseApi.get(apiRoutes.product.getOemByProductId, { ...params });
    },
    GetProductAdditionalDiscountById(params) {
        return BaseApi.get(apiRoutes.product.getProductAdditionalDiscountById, { ...params });
    },
    GetProductGroupsById(params) {
        return BaseApi.get(apiRoutes.product.getProductGroupsById, { ...params });
    },
    GetProductPricesById(params) {
        return BaseApi.get(apiRoutes.product.getProductPricesById, { ...params });
    },
    GetProductQuantitiesById(params) {
        return BaseApi.get(apiRoutes.product.getProductQuantitiesById, { ...params });
    },
    GetSearchTable(data) {
        return BaseApi.post(apiRoutes.product.getSearchTable, data);
    },
    GetShelfAdressesById(params) {
        return BaseApi.get(apiRoutes.product.getShelfAdressesById, { ...params });
    },
    GetVehicleBrandById(params) {
        return BaseApi.get(apiRoutes.product.getVehicleBrandById, { ...params });
    },
    GetVehicleListByProductId(params) {
        return BaseApi.get(apiRoutes.product.getVehicleListByProductId, { ...params });
    },
    GetBestSeller(data) {
        return BaseApi.post(apiRoutes.product.getBestSeller, data)
    },
    GetVehicleModelById(params) {
        return BaseApi.get(apiRoutes.product.getVehicleModelById, { ...params });
    },
    GetProductStockMovements(data) {
        return BaseApi.post(apiRoutes.product.getProductStockMovements, data);
    },
};
