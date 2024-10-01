import React from 'react';
import "./style.scss";
import Images from "../../../Assets/images/js/Images";
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Orders = () => {
    const { chrevron_right, printsvg, Liner } = Images;
    const { t } = useTranslation();

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
        <>
            <div className="container-fluid d-flex justify-content-center mt-4">
                <div className="myRow align-items-start flex-column">
                    <p className="f-14 d-flex fb-600">
                        <Link to={"/"}>
                            <span className='text-44'>
                                {t("Global.home")}
                            </span>
                        </Link>
                        <img src={chrevron_right} alt="" />
                        <Link to={"/Orders"}>
                        <span className='text-44'>

                            {t("Orders.view.order-name")}
                        </span>
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

            <div id="order-details">
                <div className="container-fluid d-flex justify-content-center mt-5">
                    <div className="myRow align-items-center justify-content-center">
                        <div className="col border rounded w-100" style={{ height: "217px" }}>
                            <div className="col w-100 d-flex bg-F2 align-items-center" style={{ height: "70px" }}>
                                <div className="col-1 justify-content-between ms-4 d-flex  align-items-center" style={{ width: "80%", height: "24px" }}>
                                    <p className="text-44">
                                        {/* Sifaris */}
                                        {t("Orders.view.table.order")} : #000000056
                                    </p>
                                    <p className="text-44">
                                        BOSCH Manager
                                    </p>
                                    <p className="text-44">
                                        {/* Tarix */}
                                        {t("Orders.view.table.date")} : 13.03.2023
                                    </p>
                                    <p className="text-44">
                                        {/* Status */}
                                        {t("Orders.view.table.status")} : Tesdiqlendi
                                    </p>
                                    <p className="text-44">
                                        {/* Gonderen */}
                                        {t("Orders.view.table.sender")} : Rasif Valiyev
                                    </p>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="col-1 d-flex align-items-center justify-content-center" style={{ width: "180px", height: "145px" }}>
                                    <div className="col-1 rounded" style={{ width: "76px", height: "76px" }}>
                                        <img className="w-100 h-100 img-thumbnail" src="https://m.media-amazon.com/images/I/61Jb7TOqaeL._SL1500_.jpg" alt="" />
                                    </div>
                                </div>
                                <div className="col-1 d-flex flex-column justify-content-between mt-3" style={{ width: "80%" }}>
                                    <div className="col d-flex justify-content-between">
                                        <div className="d-flex flex-column">
                                            <p className="text-44 fb-500 f-14">
                                                {/* Mahsul Kodu */}
                                                {t("Orders.view.table.product-code")}
                                            </p>
                                            <p className="t-8F mt-3 f-14">
                                                20K15
                                            </p>
                                        </div>
                                        <div className="d-flex flex-column" style={{ width: "91px" }}>
                                            <p className="text-44 fb-500 f-14">
                                                {/* Mahsul Adi */}
                                                {t("Orders.view.table.product-name")}
                                            </p>
                                            <p className="t-8F mt-3 f-14">
                                                Shell Rotella 550041918
                                            </p>
                                        </div>
                                        <div className="d-flex flex-column">
                                            <p className="text-44 fb-500 f-14">
                                                {/* Brend */}
                                                {t("Orders.view.table.brand")}
                                            </p>
                                            <p className="t-8F mt-3 f-14">
                                                Japko
                                            </p>
                                        </div>
                                        <div className="d-flex flex-column text-center">
                                            <p className="text-44 fb-500 f-14">
                                                {/* Say */}
                                                {t("Orders.view.table.number")}
                                            </p>
                                            <p className="t-8F mt-3 f-14">
                                                20
                                            </p>
                                        </div>
                                        <div className="d-flex flex-column text-end">
                                            <p className="text-44 fb-500 f-14">
                                                {/* Vahid */}
                                                {t("Orders.view.table.unit")}
                                            </p>
                                            <p className="t-8F mt-3 f-14">
                                                Ad
                                            </p>
                                        </div>
                                        <div className="d-flex flex-column text-end">
                                            <p className="text-44 fb-500 f-14">
                                                {/* Qiymet */}
                                                {t("Orders.view.table.price")}
                                            </p>
                                            <p className="t-8F mt-3 f-14">
                                                256
                                            </p>
                                        </div>
                                        <div className="d-flex flex-column text-end">
                                            <p className="text-44 fb-500 f-14">
                                                {/* Mablag */}
                                                {t("Orders.view.table.amount")}
                                            </p>
                                            <p className="t-8F mt-3 f-14">
                                                256
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-fluid d-flex justify-content-center mt-5">
                    <div className="myRow align-items-start mt-5">
                        <div className="col-6" style={{ width: "585px" }}>
                            <p className="f-16 text-44 fb-500">
                                {t("Orders.view.order-note")}
                            </p>
                            <textarea className="form-control mt-3 textarea" id="exampleFormControlTextarea1" placeholder=""></textarea>
                        </div>
                        <div className="col-4 d-flex flex-column">
                            <div className="d-flex flex-column justify-content-between" style={{ height: "168px" }}>
                                <div className="col d-flex justify-content-between">
                                    <p className="f-14 text-44 fb-500">
                                        {/* Mebleg */}
                                        {t("Orders.view.amount")}
                                    </p>
                                    <p className="f-14 t-8F">
                                        2.5EUR
                                    </p>
                                </div>
                                <div className="col d-flex justify-content-between">
                                    <p className="f-14 text-44 fb-500">
                                        {/* Endirim */}
                                        {t("Orders.view.discount")}
                                    </p>
                                    <p className="f-14 t-8F">
                                        0.00EUR
                                    </p>
                                </div>
                                <div className="col d-flex justify-content-between">
                                    <p className="f-14 text-44 fb-500">
                                        {/* Alt cami */}
                                        {t("Orders.view.lower")}
                                    </p>
                                    <p className="f-14 t-8F">
                                        0.00EUR
                                    </p>
                                </div>
                                <div className="col d-flex justify-content-between">
                                    <p className="f-14 text-44 fb-500">
                                        {/* ADV */}
                                        {t("Orders.view.adv")}
                                    </p>
                                    <p className="f-14 t-8F">
                                        2.5EUR
                                    </p>
                                </div>
                            </div>
                            <img className='mt-2' src={Liner} alt="" />
                            <div className="d-flex flex-column justify-content-between mt-4" style={{ height: "135px" }}>
                                <div className="col d-flex justify-content-between">
                                    <p className="f-14 text-44 fb-500">
                                        {/* Shipment Type */}
                                        {t("Orders.view.shipment")}
                                    </p>
                                    <p className="f-14 t-8F">
                                        Normal
                                    </p>
                                </div>
                                <div className="col d-flex flex-column justify-content-between">
                                    <p className="f-14 text-44 fb-500">
                                        {/* Shipment Address */}
                                        {t("Orders.view.address")}
                                    </p>
                                    <p className="f-14 mt-2 t-8F">
                                        Street:  S. Bedelbeyli Kuc. 104 Az1000, City:  Absheron ,State:  Absheron ,Zipcode:  AZ1000
                                    </p>
                                </div>
                                <img className='mt-2' src={Liner} alt="" />

                            </div>
                            <div className="col mt-4 d-flex justify-content-between">
                                <p className="f-18 text-44 fb-500">
                                    {/* Shipment Type */}
                                    {t("Orders.view.type")}

                                </p>
                                <p className="f-16 text-black">
                                    2,77 EUR
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Orders;
