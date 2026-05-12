import React, { useEffect, useState, useCallback } from 'react';
import './style.scss';
import { Spin, Modal, Button, Select } from 'antd';
import Images from '../../../Assets/images/js/Images';
import ReturnItems from '../../Elements/ReturnItem/index';
import { useNavigate } from "react-router-dom";
import { BasketApi } from "../../../api/basket.api";
import { useAuth } from "../../../AuthContext";
import { useTranslation } from 'react-i18next';
import { CatalogApi } from "../../../api/catalog.api";

const { Option } = Select;

const Return = () => {
    const { logout, openNotification } = useAuth();

    const [loading, setLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState({});
    const [returnItems, setReturnItems] = useState([]);
    const [returnItemStatus, setReturnItemStatus] = useState([]);

    const handleAPIError = (error) => {
        openNotification('Xəta baş verdi', error?.response?.data?.message, true);
        if (error?.response?.data.status === 2017) {
            logout();
        }
    };

    const getReturnItems = useCallback(() => {
        setLoading(true);
        BasketApi.GetListByCurrentCustomer()
            .then(items => setReturnItems(items || []))
            .catch(handleAPIError)
            .finally(() => setLoading(false));
    }, [logout]);

    const GetReturnDetailStatusList = useCallback(() => {
        setLoading(true);
        CatalogApi.GetReturnProductStatusList()
            .then(items => setReturnItemStatus(items))
            .catch(handleAPIError)
            .finally(() => setLoading(false));
    }, [logout]);

    const getTotalPrice = useCallback(() => {
        setLoading(true);
        BasketApi.GetTotalInfoByCurrentCustomer()
            .then(items => setTotalPrice(items))
            .catch(handleAPIError)
            .finally(() => setLoading(false));
    }, [logout]);




    useEffect(() => {
        getReturnItems();
        getTotalPrice();
        GetReturnDetailStatusList();
    }, [getReturnItems, getTotalPrice, GetReturnDetailStatusList]);





    return (
        <>
            <div className="container-fluid d-flex justify-content-center">
                <div className="myRow mt-5">
                    <p className="text-44 f-24 fb-600">
                        Geri qaytarılma
                    </p>
                </div>
            </div>

            <div className={'w-100'}>
                <Spin className={'w-100'} spinning={loading}>
                    {
                        returnItems.length === 0 ?
                            <div style={{ height: '60vh' }} className="d-flex justify-content-center align-items-center empty-return">Geri qaytarılma yoxdur</div>
                            : <div className="container-fluid d-flex justify-content-center mt-5">
                                <div className="myRow d-flex align-items-start justify-content-between">
                                    <div className="w-100 position-relative rounded"
                                         style={{ padding: "0rem 0rem 0.8rem 0rem" }}>
                                        <ReturnItems totalPrice={totalPrice} returnItemStatus={returnItemStatus} setReturnItems={setReturnItems} getReturnItems={getReturnItems} getTotalPrice={getTotalPrice} returnItems={returnItems} />
                                    </div>
                                </div>
                            </div>
                    }
                </Spin>
            </div>

        </>
    );
};

export default Return;
