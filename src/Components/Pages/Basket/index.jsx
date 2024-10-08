import React, {useEffect, useState} from 'react';
import './style.scss';
import  { Spin } from 'antd'
import Images from '../../../Assets/images/js/Images';
import BasketItems from '../../Elements/BasketItem/index';
import {useNavigate} from "react-router-dom";
import {BasketApi} from "../../../api/basket.api";
import {useAuth} from "../../../AuthContext";
import { useTranslation } from 'react-i18next';
import {OrderApi} from "../../../api/order.api";
import { Select } from "antd";
import {CatalogApi} from "../../../api/catalog.api";
const { Option } = Select
const Basket = () => {
    const { logout} = useAuth()
    const { Down } = Images;
    const { t } = useTranslation();
    const navigate = useNavigate()
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


    const getBasketItems = () => {
        setLoading(true)
        BasketApi.GetListByCurrent().then((items)=>{
            console.log(items)
            setBasketItems(items.basketDetailList ? items.basketDetailList : [])
        }).catch((error)=>{
            if(error?.response?.status === 401){
                logout()
            }
        }).finally(function(){
            setLoading(false)
        })
    }

    const GetBasketDetailStatusList = () => {
        console.log('GetBasketDetailStatusList')
        setLoading(true)
        CatalogApi.GetBasketDetailStatusList().then((items)=>{
            setBasketItemStatus(items)
        }).catch((error)=>{
            console.log(error)
            if(error?.response?.status === 401){
                logout()
            }
        }).finally(function(){
            setLoading(false)
        })
    }

    const getTotalPrice = () => {
        setLoading(true)
        BasketApi.GetTotalPrice().then((items)=>{
            console.log(items , "Total")
            setTotalPrice(items[0])
        }).catch((error)=>{
            if(error?.response?.status === 401){
                logout()
            }
        }).finally(function(){
            setLoading(false)
        })
    }


    const getShipmentTypeList = ( ) => {
        CatalogApi.GetShipmentTypeList().then((res)=>{
            setShipmentTypeList(res)
        })
    }

    const getPaymentTypeList = ( ) => {
        CatalogApi.GetPaymentTypeList().then((res)=>{
            setPaymentTypeList(res)
        })
    }


    const createOrder = () => {
        setLoading(true)
        OrderApi.AddOrder({
            paymentTypeIdHash,
            shipmentTypeIdHash,
            note,
            salesmanNote: " "
        }).then(() => {
            openNotification('Uğurlu əməliyyat' , 'Sifariş yaradıldı'  , false)
            setTimeout(()=>{
                navigate('/orders')
            } , 1000)
        }).catch((err)=>{
            openNotification('Xəta baş verdi' , err.response.data.message  , true )
            if(err?.response?.status === 401){
                logout()
            }
        }).finally(()=>{
            setLoading(false)
        })
    }




    useEffect(()=>{
        getBasketItems()
        getTotalPrice()
        getPaymentTypeList()
        getShipmentTypeList()
        GetBasketDetailStatusList()
    }, [])

    const { openNotification }= useAuth()


    const handleButtonClick = () => {
        setOpen(!open);
    };



    let { down, Liner } = Images;

    // const items = useSelector(state => state.cart.items);
    // if (basketItems.length === 0) {
    //     return <div className="empty-basket">Səbət boşdur</div>;
    // }
    return (
        <>
            <div className="container-fluid d-flex justify-content-center">
                <div className="myRow mt-5">
                    <p className="text-44 f-24 fb-600">
                        {t("Basket.order")}
                    </p>
                </div>
            </div>

            <div className={'w-100'}>
                <Spin className={'w-100'} spinning={loading}>
                    {
                        basketItems.length === 0 ?
                            <div style={{height:'60vh'}} className="d-flex justify-content-center align-items-center empty-basket">Səbət boşdur</div>
                            : <div className="container-fluid d-flex justify-content-center mt-5">
                                <div className="myRow d-flex align-items-start justify-content-between">
                                    <div className="myContainer w-75 position-relative rounded"
                                         style={{padding: "0rem 0rem 0.8rem 0rem"}}>
                                        <BasketItems basketItemStatus={basketItemStatus} setBasketItems={setBasketItems} getBasketItems={getBasketItems} getTotalPrice={getTotalPrice}  basketItems={basketItems} />
                                    </div>

                                    <div className="myContainer2 rounded">
                                        <div className="col ">
                                            <div className="row mt-5 ">
                                                <div className="myRow2">
                                                    <Select
                                                        size={'large'}
                                                        placeholder={'Çatdırılma növü'}
                                                        style={{ width: '100%' }}
                                                        dropdownStyle={{ borderRadius: '8px' }}
                                                        className="custom-select mx-5"
                                                        showSearch // Enables the search functionality
                                                        optionFilterProp="children" // Search will be based on the option's displayed text
                                                        filterOption={(input, option) =>
                                                            (option?.children?.props?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                                        } // Custom filter logic (optional)
                                                        allowClear // Optional: Allows clearing the selection
                                                        suffixIcon={<img className='me-2' src={down} alt="" />}
                                                        onChange={(event, value) => {
                                                            setShipmentTypeIdHash(value.value)
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
                                            <div className="row mt-3 ">
                                                <div className="myRow2">
                                                    <Select
                                                        size={'large'}
                                                        placeholder={'Ödəniş növü'}
                                                        style={{ width: '100%' }}
                                                        dropdownStyle={{ borderRadius: '8px' }}
                                                        className="custom-select mx-5"
                                                        showSearch // Enables the search functionality
                                                        optionFilterProp="children" // Search will be based on the option's displayed text
                                                        filterOption={(input, option) =>
                                                            (option?.children?.props?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                                        } // Custom filter logic (optional)
                                                        allowClear // Optional: Allows clearing the selection
                                                        suffixIcon={<img className='me-2' src={down} alt="" />}
                                                        onChange={(event, value) => {
                                                            setPaymentTypeIdHash(value.value)
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
                                            <img className='mt-4 w-100' src={Liner} alt=""/>

                                            {/* TextArea */}
                                            <div className="row">
                                                <div className="myRow3">
                                                    <p className="text-44 mt-3 fb-600">
                                                        {t("Basket.table2.record")}
                                                    </p>
                                                    <textarea onChange={(e)=>{
                                                        setNote(e.target.value);
                                                    }} className="OrderTextarea rounded mt-4 textarea"
                                                              id="exampleFormControlTextarea1"
                                                              placeholder={t("Basket.table2.record")}></textarea>
                                                </div>
                                            </div>

                                            {/* Line */}
                                            <img className='mt-4 w-100' src={Liner} alt=""/>

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
                                                            {totalPrice?.basketDetailTotalPrice?.formattedTotalPrice } {' '}
                                                            {totalPrice?.currency?.name }
                                                        </p>
                                                    </div>
                                                    <div
                                                        className="d-flex align-items-center mt-2 justify-content-between">
                                                        <p className="text-44 fb-500">
                                                            {t("Basket.table2.discount")}
                                                        </p>
                                                        <p className="t-8F fb-500">
                                                            {totalPrice?.basketDetailTotalPrice?.formattedTotalDiscountPrice } {' '}
                                                            {totalPrice?.currency?.name }
                                                        </p>
                                                    </div>
                                                    <div
                                                        className="d-flex align-items-center mt-4 justify-content-between">
                                                        <p className="text-44 fb-600">
                                                            {t("Basket.table2.value")}
                                                        </p>
                                                        <p className="t-8F fb-500">
                                                            {totalPrice?.basketDetailTotalPrice?.formattedTotalDiscountedPrice } {' '}
                                                            {totalPrice?.currency?.name }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mt-5 mb-5">
                                                <div onClick={() => {
                                                    createOrder()
                                                }} className="col d-flex align-items-center justify-content-center">
                                                    <button className="ProductEvaluate2">  {t("Basket.table2.confirim")}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                    }
                </Spin>
            </div>

        </>
    );
};

export default Basket;
