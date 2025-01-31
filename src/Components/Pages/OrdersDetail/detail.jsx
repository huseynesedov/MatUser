import React, { useEffect, useState } from 'react';
import "./style.scss";
import Images from "../../../Assets/images/js/Images";
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { Spin } from 'antd'
import { Link, useParams } from "react-router-dom";
import { OrderApi } from "../../../api/order.api";
import { useTranslation } from 'react-i18next';
import moment from "moment";
import { useAuth } from "../../../AuthContext";
import PermissionWrapper from "../../Elements/PermissionWrapper/PermissionWrapper";

const Orders = () => {
    const { chrevron_right, printsvg, Liner } = Images;
    const { id } = useParams()
    const { logout } = useAuth()
    const { t } = useTranslation();
    const [detail, setDetails] = useState({})
    const [loading, setLoading] = useState(false)

    const getOrderDetails = async () => {
        setLoading(true)
        await OrderApi.GetByOrderId({
            id
        }).then((response) => {
            console.log(response)
            setDetails(response)
        }).catch((error) => {
            if (error.response.data.status === 2017) {
                logout()
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        getOrderDetails()
    }, [])
    const handlePrint = async () => {
        const element = document.documentElement; // Capture the entire page
        const canvas = await html2canvas(element, {
            scale: 2, // Increase scale for better resolution
            scrollX: 0,
            scrollY: 0,
            useCORS: true,
        });
        canvas.toBlob(blob => {
            saveAs(blob, 'order-details222.png');
        });
    };
    return (
        <PermissionWrapper
            topModuleCode="$USER"
            subModuleCode="$ORDER_SUB_MODULE"
            pageCode="$ORDER_DETAIL"
            rightCode="$GET"
        >
        <div className={'w-100'}>
            <div className="container-fluid d-flex  justify-content-center mt-4">
                <div className="myRow align-items-start flex-column">
                    <p className="text-44 f-14 d-flex fb-600">
                        <Link className={'text-dark'} to={'/'}>
                            {t("Global.home")}
                        </Link>
                        <img src={chrevron_right} alt="" />
                        
                        <Link className={'text-dark'} to={'/Orders'}>
                            {t("Orders.view.order-name")}
                        </Link>
                        <img src={chrevron_right} alt="" />
                        <p className="t-01">
                            {t("Orders.view.order-detail")}
                        </p>
                    </p>
                    <div className="border-bottom-line mt-4" style={{ width: '1416px', marginLeft: '-11px' }}></div>
                </div>
            </div>
            <div className="container-fluid d-flex justify-content-center mt-5">
                <div className="myRow align-items-center justify-content-between">
                    <div>
                        <p className="text-44 f-24 fb-500">
                            {t("Orders.view.information")}
                        </p>
                    </div>
                    <div className="print" onClick={handlePrint} style={{ cursor: 'pointer' }}>
                        <img src={printsvg} alt="" />
                        <p className="ms-3 fb-500">
                            {t("Orders.view.print")}
                        </p>
                    </div>
                </div>
            </div>
            <Spin spinning={loading}>
                <div id="order-details w-100">
                    <div className="container-fluid d-flex justify-content-center mt-5">
                        <div className="myRow align-items-center justify-content-center">
                            <div className="col border rounded w-100">
                                <div className="col w-100 d-flex bg-F2 align-items-center" style={{ height: "70px" }}>
                                    <div className="col-1 justify-content-between ms-4 d-flex  align-items-center"
                                        style={{ width: "68%", height: "24px" }}>
                                        <p className="text-44">
                                            {t("Orders.view.table.order")} {detail?.order?.orderNumber}
                                        </p>
                                        <p className="text-44">
                                            {detail?.order?.companyName}
                                        </p>
                                        <p className="text-44">
                                            {t("Orders.view.table.date")} : {moment(detail?.order?.createDate).format('MM-DD-YYYY HH:MM')}
                                        </p>
                                        <p className="text-44">
                                            {t("Orders.view.table.status")} : {detail?.order?.orderStatusName}
                                        </p>
                                        <p className="text-44">
                                            {t("Orders.view.table.sender")} : {detail?.order?.senderName}
                                        </p>
                                    </div>
                                </div>
                                {detail?.orderDetails?.map(d => {
                                    return <div className="d-flex align-items-center">
                                        <div className="col-1 d-flex align-items-center justify-content-center"
                                            style={{ width: "180px" }}>
                                            <div className="col-1 rounded" style={{ width: "76px", height: "76px" }}>
                                                <img className="w-100 h-100 img-thumbnail" src={d.defaultContent} alt="" />
                                            </div>
                                        </div>
                                        <div className="col-1 d-flex flex-column justify-content-between mt-3"
                                            style={{ width: "80%" }}>
                                            <div className="col d-flex justify-content-between">
                                                <div className="d-flex flex-column" style={{ width: "82px", overflow: "hidden", }}>
                                                    <p className="text-44 fb-500 f-14">
                                                        {t("Orders.view.table.product-code")}
                                                    </p>
                                                    <p className="t-8F mt-3 f-14">
                                                        {d.productCode}
                                                    </p>
                                                </div>
                                                <div className="d-flex flex-column align-center" style={{ width: "91px" }}>
                                                    <p className="text-44 fb-500 f-14">
                                                        {t("Orders.view.table.product-name")}
                                                    </p>
                                                    <p className="t-8F mt-3 f-14">
                                                        {d.productName}
                                                    </p>
                                                </div>
                                                <div className="d-flex flex-column">
                                                    <p className="text-44 fb-500 f-14">
                                                        {t("Orders.view.table.brand")}
                                                    </p>
                                                    <p className="t-8F mt-3 f-14">
                                                        {d.manufacturerName}
                                                    </p>
                                                </div>
                                                <div className="d-flex flex-column text-center">
                                                    <p className="text-44 fb-500 f-14">
                                                        {t("Orders.view.table.number")}
                                                    </p>
                                                    <p className="t-8F mt-3 f-14">
                                                        {d.quantity}
                                                    </p>
                                                </div>
                                                <div className="d-flex flex-column text-end">
                                                    <p className="text-44 fb-500 f-14">
                                                        {t("Orders.view.table.unit")}
                                                    </p>
                                                    <p className="t-8F mt-3 f-14">
                                                        {d.unitName}
                                                    </p>
                                                </div>
                                                <div className="d-flex flex-column text-end">
                                                    <p className="text-44 fb-500 f-14">
                                                        {t("Orders.view.table.price")}
                                                    </p>
                                                    <p className="t-8F mt-3 f-14">
                                                        {d.unitPrice}
                                                    </p>
                                                </div>
                                                <div className="d-flex flex-column text-end">
                                                    <p className="text-44 fb-500 f-14">
                                                        {t("Orders.view.table.amount")}
                                                    </p>
                                                    <p className="t-8F mt-3 f-14">
                                                        {d.unitPrice * d.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="container-fluid d-flex justify-content-center mt-5">
                        <div className="myRow align-items-start mt-5">
                            <div className="col-6" style={{ width: "585px" }}>
                                <p className="f-16 text-44 fb-500">
                                    {t("Orders.view.order-note")}
                                </p>
                                <textarea value={detail.order?.note} className="form-control mt-3 textarea" readOnly={true} id="exampleFormControlTextarea1"
                                    placeholder=""></textarea>
                            </div>
                            <div className="col-4 d-flex flex-column">
                                <div className="d-flex flex-column justify-content-between" style={{ height: "168px" }}>
                                    <div className="col d-flex justify-content-between">
                                        <p className="f-14 text-44 fb-500">
                                            {t("Orders.view.amount")}
                                        </p>
                                        <p className="f-14 t-8F">
                                            {detail.order?.totalPrice.toFixed(2)} AZN
                                        </p>
                                    </div>
                                    <div className="col d-flex justify-content-between">
                                        <p className="f-14 text-44 fb-500">
                                            {t("Orders.view.discount")}
                                        </p>
                                        <p className="f-14 t-8F">
                                            {detail.order?.totalDiscountPrice} AZN
                                        </p>
                                    </div>
                                    <div className="col d-flex justify-content-between">
                                        <p className="f-14 text-44 fb-500">
                                            {t("Orders.view.lower")}
                                        </p>
                                        <p className="f-14 t-8F">
                                            {detail.order?.totalDiscountedPrice} AZN
                                        </p>
                                    </div>
                                    <div className="col d-flex justify-content-between">
                                        <p className="f-14 text-44 fb-500">
                                            {t("Orders.view.adv")}
                                        </p>
                                        <p className="f-14 t-8F">
                                            {detail.order?.totalVAT} AZN
                                        </p>
                                    </div>
                                </div>
                                <img className='mt-2' src={Liner} alt="" />
                                <div className="d-flex flex-column justify-content-between mt-4"
                                    style={{ height: "135px" }}>
                                    {/*<div className="col d-flex justify-content-between">*/}
                                    {/*    <p className="f-14 text-44 fb-500">*/}
                                    {/*        {t("Orders.view.shipment")}*/}
                                    {/*    </p>*/}
                                    {/*    <p className="f-14 t-8F">*/}
                                    {/*        Normal*/}
                                    {/*    </p>*/}
                                    {/*</div>*/}
                                    {/*<div className="col d-flex flex-column justify-content-between">*/}
                                    {/*    <p className="f-14 text-44 fb-500">*/}
                                    {/*        {t("Orders.view.address")}*/}
                                    {/*    </p>*/}
                                    {/*    <p className="f-14 mt-2 t-8F">*/}
                                    {/*        Street: S. Bedelbeyli Kuc. 104 Az1000, City: Absheron ,State: Absheron*/}
                                    {/*        ,Zipcode: AZ1000*/}
                                    {/*    </p>*/}
                                    {/*</div>*/}
                                    <img className='mt-2' src={Liner} alt="" />

                                </div>
                                {/*<div className="col mt-4 d-flex justify-content-between">*/}
                                {/*    <p className="f-18 text-44 fb-500">*/}
                                {/*        {t("Orders.view.type")}*/}
                                {/*    </p>*/}
                                {/*    <p className="f-16 text-black">*/}
                                {/*        2,77 EUR*/}
                                {/*    </p>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </Spin>
        </div>
        </PermissionWrapper>
    );
}

export default Orders;
