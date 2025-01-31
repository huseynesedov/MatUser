import React, { useEffect, useState } from 'react';
import './style.scss';
import { Modal, Spin, notification } from 'antd'; // notification import edilmiştir
import Images from '../../../Assets/images/js/Images';
import BasketItems from '../../Elements/BasketItem/index';
import { useNavigate } from "react-router-dom";
import { BasketApi } from "../../../api/basket.api";
import { useAuth } from "../../../AuthContext";
import { useTranslation } from 'react-i18next';
import { OrderApi } from "../../../api/order.api";
import { Select } from "antd";
import { CatalogApi } from "../../../api/catalog.api";
import PermissionWrapper from "../../Elements/PermissionWrapper/PermissionWrapper";

const { Option } = Select;
const Basket = () => {
    const { logout } = useAuth();
    const { okey } = Images;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState({});
    const [basketItems, setBasketItems] = useState([]);
    const [basketItemStatus, setBasketItemStatus] = useState([]);
    const [shipmentTypeList, setShipmentTypeList] = useState([]);
    const [paymentTypeList, setPaymentTypeList] = useState([]);
    const [paymentTypeIdHash, setPaymentTypeIdHash] = useState('');
    const [shipmentTypeIdHash, setShipmentTypeIdHash] = useState('');
    const [note, setNote] = useState('');
    const [shipmentError, setShipmentError] = useState(false); // Error state for shipment
    const [paymentError, setPaymentError] = useState(false); // Error state for payment

    // Get basket items, total price, and other data
    const getBasketItems = () => {
        setLoading(true);
        BasketApi.GetListByCurrent().then((items) => {
            setBasketItems(items.basketDetailList || []);
        }).catch((error) => {
            if (error.response.data.status === 2017) {
                logout()
            }
        }).finally(() => {
            setLoading(false);
        });
    };

    const GetBasketDetailStatusList = () => {
        setLoading(true);
        CatalogApi.GetBasketDetailStatusList().then((items) => {
            setBasketItemStatus(items);
        }).catch((error) => {
            if (error.response.data.status === 2017) {
                logout()
            }
        }).finally(() => {
            setLoading(false);
        });
    };

    const getTotalPrice = () => {
        setLoading(true);
        BasketApi.GetTotalPrice().then((items) => {
            setTotalPrice(items[0]);
        }).catch((error) => {
            if (error.response.data.status === 2017) {
                logout()
            }
        }).finally(() => {
            setLoading(false);
        });
    };

    const getShipmentTypeList = () => {
        CatalogApi.GetShipmentTypeList().then((res) => {
            setShipmentTypeList(res);
        });
    };

    const getPaymentTypeList = () => {
        CatalogApi.GetPaymentTypeList().then((res) => {
            setPaymentTypeList(res);
        });
    };

    const createOrder = () => {
        setLoading(true);
        if (!paymentTypeIdHash || !shipmentTypeIdHash) {
            setShipmentError(!shipmentTypeIdHash); // Trigger error if shipment type is not selected
            setPaymentError(!paymentTypeIdHash); // Trigger error if payment type is not selected

            // Show notifications for missing fields
            if (!shipmentTypeIdHash) {
                notification.error({
                    message: 'Çatdırılma növü seçilməyib',
                    description: 'Çatdırılma növünü seçməlisiniz!',
                });
            }
            if (!paymentTypeIdHash) {
                notification.error({
                    message: 'Ödəniş növü seçilməyib',
                    description: 'Ödəniş növünü seçməlisiniz!',
                });
            }

            setLoading(false);
            return;
        }

        OrderApi.AddOrder({
            paymentTypeIdHash,
            shipmentTypeIdHash,
            note,
            salesmanNote: " "
        }).then(() => {
            openNotification('Uğurlu əməliyyat', 'Sifariş yaradıldı', false);
            setIsModalVisible(true);
            setTimeout(() => {
                navigate('/orders');
            }, 1000);
        }).catch((err) => {
            openNotification('Xəta baş verdi', err.response.data.message, true);
            if (err.response.data.status === 2017) {
                logout()
            }
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        getBasketItems();
        getTotalPrice();
        getPaymentTypeList();
        getShipmentTypeList();
        GetBasketDetailStatusList();
    }, []);

    const { openNotification } = useAuth();

    const handleButtonClick = () => {
        setOpen(!open);
    };

    let { down, Liner } = Images;

    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleOk = () => {
        setIsModalVisible(false); // Onayla butonuna basıldığında modalı kapat
    };

    const handleCancel = () => {
        setIsModalVisible(false); // Kapat butonuna basıldığında modalı kapat
    };

    return (
        <>
            <PermissionWrapper
                topModuleCode="$USER"
                subModuleCode="$BASKET_SUB_MODULE"
                pageCode="$BASKET_DETAIL"
                rightCode="$GET"
            >
                <div className="container-fluid ">
                    <div className="myRow w-100 mt-5">
                        <p className="text-44 f-24 fb-600">
                            {t("Basket.order")}
                        </p>
                    </div>
                </div>

                <div className={'w-100'}>
                    <Spin className={'w-100'} spinning={loading}>
                        {
                            basketItems.length === 0 ?
                                <div style={{ height: '60vh' }} className="d-flex justify-content-center align-items-center empty-basket">Səbət boşdur</div>
                                : <div className="container-fluid  mt-5">
                                    <div className="myRow w-100 d-flex align-items-start justify-content-between">
                                        <div className="myContainer background-transparent w-75 position-relative rounded"
                                            style={{ padding: "0rem 0rem 0.8rem 0rem", background:'transparent !important' }}>
                                            <BasketItems basketItemStatus={basketItemStatus} setBasketItems={setBasketItems} getBasketItems={getBasketItems} getTotalPrice={getTotalPrice} basketItems={basketItems} />
                                        </div>

                                        <div className="myContainer2 background-transparent rounded">
                                            <div className="col ">
                                                <div className="row">
                                                    <div className="myRow2">
                                                        <Select
                                                            size={'large'}
                                                            placeholder={'Çatdırılma növü'}
                                                            style={{ width: '100%' }}
                                                            dropdownStyle={{ borderRadius: '8px' }}
                                                            className={`custom-select mx-5 ${shipmentError ? 'error-input' : ''}`} // Apply red border if error
                                                            showSearch
                                                            optionFilterProp="children"
                                                            filterOption={(input, option) =>
                                                                (option?.children?.props?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                                            }
                                                            allowClear
                                                            suffixIcon={<img className='me-2' src={down} alt="" />}
                                                            onChange={(event, value) => {
                                                                setShipmentTypeIdHash(value.value);
                                                                setShipmentError(false); // Reset error on change
                                                            }}
                                                        >
                                                            {shipmentTypeList.map((shipmentType) => (
                                                                <Option key={shipmentType.valueHash} value={shipmentType.valueHash}>
                                                                    <span style={{ marginLeft: '8px' }}>{shipmentType.displayText}</span>
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="row mt-3">
                                                    <div className="myRow2">
                                                        <Select
                                                            size={'large'}
                                                            placeholder={'Ödəniş növü'}
                                                            style={{ width: '100%' }}
                                                            dropdownStyle={{ borderRadius: '8px' }}
                                                            className={`custom-select mx-5 ${paymentError ? 'error-input' : ''}`} // Apply red border if error
                                                            showSearch
                                                            optionFilterProp="children"
                                                            filterOption={(input, option) =>
                                                                (option?.children?.props?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                                            }
                                                            allowClear
                                                            suffixIcon={<img className='me-2' src={down} alt="" />}
                                                            onChange={(event, value) => {
                                                                setPaymentTypeIdHash(value.value);
                                                                setPaymentError(false); // Reset error on change
                                                            }}
                                                        >
                                                            {paymentTypeList.map((orderType) => (
                                                                <Option key={orderType.valueHash} value={orderType.valueHash}>
                                                                    <span style={{ marginLeft: '8px' }}>{orderType.displayText}</span>
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                    </div>
                                                </div>

                                                {/* Line */}
                                                <img className='mt-4 w-100' src={Liner} alt="" />

                                                {/* TextArea */}
                                                <div className="row">
                                                    <div className="myRow3">
                                                        <p className="text-44 mt-3 fb-600">
                                                            {t("Basket.table2.record")}
                                                        </p>
                                                        <textarea onChange={(e) => {
                                                            setNote(e.target.value);
                                                        }} className="OrderTextarea rounded mt-4 textarea"
                                                            id="exampleFormControlTextarea1"
                                                            placeholder={t("Basket.table2.record")}></textarea>
                                                    </div>
                                                </div>

                                                {/* Line */}
                                                <img className='mt-4 w-100' src={Liner} alt="" />

                                                <div className="row">
                                                    <div className="myRow3">
                                                        <p className="text-44 mt-5 fb-600">
                                                            {t("Basket.table2.summary")}
                                                        </p>
                                                        <div
                                                            className="d-flex align-items-center mt-4 justify-content-between">
                                                            <p className="text-44 fb-500">
                                                                {t("Basket.table2.delivery")}
                                                            </p>
                                                            <p className="t-8F fb-500">
                                                                {totalPrice?.basketDetailTotalPrice?.formattedTotalPrice} {' '}
                                                                {totalPrice?.currency?.name}
                                                            </p>
                                                        </div>
                                                        <div
                                                            className="d-flex align-items-center mt-2 justify-content-between">
                                                            <p className="text-44 fb-500">
                                                                {t("Basket.table2.discount")}
                                                            </p>
                                                            <p className="t-8F fb-500">
                                                                {totalPrice?.basketDetailTotalPrice?.formattedTotalDiscountPrice} {' '}
                                                                {totalPrice?.currency?.name}
                                                            </p>
                                                        </div>
                                                        <div
                                                            className="d-flex align-items-center mt-4 justify-content-between">
                                                            <p className="text-44 fb-600">
                                                                {t("Basket.table2.value")}
                                                            </p>
                                                            <p className="t-8F fb-500">
                                                                {totalPrice?.basketDetailTotalPrice?.formattedTotalDiscountedPrice} {' '}
                                                                {totalPrice?.currency?.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <PermissionWrapper
                                                    topModuleCode="$USER"
                                                    subModuleCode="$ORDER_SUB_MODULE"
                                                    pageCode="$ORDER"
                                                    rightCode="$POST"
                                                >
                                                    <div className="row mt-5 mb-5">
                                                        <div
                                                            onClick={createOrder}
                                                            className="col d-flex align-items-center justify-content-center"
                                                        >
                                                            <button className="ProductEvaluate2">
                                                                {t("Basket.table2.confirim")}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </PermissionWrapper>

                                                <Modal
                                                    visible={isModalVisible}
                                                    footer={null}
                                                    onCancel={handleCancel}
                                                >
                                                    <div className="d-flex flex-column align-items-center justify-content-center mt-5">
                                                        <img src={Images.okey} alt="" />
                                                        <span className='text-44 mt-4' style={{ fontSize: "18px", fontWeight: "700" }}>
                                                            {t("Basket.modal.order")}
                                                        </span>
                                                        <span className="mt-4 text-44" style={{ fontSize: "16px" }}>
                                                            {t("Basket.modal.confirim-des")}

                                                        </span>

                                                        <button
                                                            onClick={handleOk}
                                                            className='mt-4 basket-ok'
                                                        >
                                                        {t("Basket.modal.ok")}

                                                        </button>
                                                    </div>
                                                </Modal>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                        }
                    </Spin>
                </div>

            </PermissionWrapper>

        </>
    );
};

export default Basket;
