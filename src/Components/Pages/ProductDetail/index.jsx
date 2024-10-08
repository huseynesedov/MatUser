import React, {useEffect, useState} from 'react';
import Images from '../../../Assets/images/js/Images';
import './detail.scss';
import DetailElements from '../../Elements/DetailElements';
import ShoppingCards from '../../Elements/ShoppingCards';
import {ProductApi} from "../../../api/product.api";
import {useParams} from "react-router-dom";
import {useAuth} from "../../../AuthContext";
import { useTranslation } from 'react-i18next';
import moment from "moment";

const Index = () => {
    let { chrevron_right, ShareSosial } = Images;
    const { id } = useParams(); // URL'den ID'yi alırıq
    let idHash = id
    const { t } = useTranslation()
    const { logout} = useAuth()
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    let [loading, setLoading] = useState(true); // Default şəkil
    let [error, setError] = useState(false); // Default şəkil
    const [oemData, setOemData] = useState([]); // Ürün bilgilerini saklayacak state
    const [crossList, setCrossList] = useState([]); // Ürün bilgilerini saklayacak state
    const [vehicleList, setVehicleList] = useState([]); // Ürün bilgilerini saklayacak state
    const [productStockMovements, setProductStockMovements] = useState([]); // Ürün bilgilerini saklayacak state
    const [selectedImage, setSelectedImage] = useState(''); // Default şəkil

    const fetchOem = async () => {
        setLoading(true)
        if (id) {
            try {
                const response = await ProductApi.GetOemByProductId({ id: idHash });
                console.log("API response: fetchOem", response);
                setOemData(response);
                setLoading(false)
                setError(false)
            } catch (error) {
                if(error.response.status === 401){
                    logout()
                }
                setError(true)
                setLoading(false)
                console.error("Error fetching product data:", error);
            }
        }
    };


    const GetProductStockMovements = async () => {
        setLoading(true)
        if (id) {
            try {
                const response = await ProductApi.GetProductStockMovements({
                    productIdHash: idHash,
                    pagingRequest: {
                    page: 0,
                        pageSize: 100,
                        filters: [
                     ]
                  }
                });
                setProductStockMovements(response.data);
                setLoading(false)
                setError(false)
            } catch (error) {
                if(error.response.status === 401){
                    logout()
                }
                setError(true)
                setLoading(false)
                console.error("Error fetching product data:", error);
            }
        }
    };
    const fetchVehicleList = async () => {
        setLoading(true)
        if (id) {
            try {
                const response = await ProductApi.GetVehicleListByProductId({ id: idHash });
                console.log("API response: fetchVehicleList", response);
                setVehicleList(response);
                setLoading(false)
                setError(false)
            } catch (error) {
                if(error.response.status === 401){
                    logout()
                }
                setError(true)
                setLoading(false)
                console.error("Error fetching product data:", error);
            }
        }
    };
    const fetchCrossList = async () => {
        setLoading(true)
        if (id) {
            try {
                const response = await ProductApi.GetCrossListByProductId({ id: idHash });
                console.log("API response: fetchCrossList", response);
                setCrossList(response);
                setLoading(false)
                setError(false)
            } catch (error) {
                if(error.response.status === 401){
                    logout()
                }
                setError(true)
                setLoading(false)
                console.error("Error fetching product data:", error);
            }
        }
    };


    useEffect(() => {
        console.log("URL'den alınan idHash:", idHash);
        fetchOem();
        fetchVehicleList();
        fetchCrossList();
        GetProductStockMovements()
    }, [idHash]);




    return (
        <>
            <div className="container-fluid d-flex justify-content-center">
                <div className="myRow mt-4 align-items-start flex-column">
                    <p className="text-44 f-14 d-flex fb-600">
                        {t("Product-Detail.home")}
                        <img src={chrevron_right} alt=""/>
                        Yag
                        <img src={chrevron_right} alt=""/>
                        Delphi Oil
                        <img src={chrevron_right} alt=""/>
                        <span className="t-01">Shel oil 675347834</span>
                    </p>
                    <div className="border-bottom-line mt-4" style={{width: '100%'}}></div>
                </div>
            </div>

            <div className="container-fluid d-flex ">
                <div className="myRow mt-5 flex-column">
                    <div className="rounded-circle d-flex align-items-center justify-content-center p-48"
                         style={{marginRight: "90px"}}>
                        <button className="none">
                            <img src={ShareSosial} alt=""/>
                        </button>
                    </div>
                </div>
            </div>

            <div className="container-fluid d-flex justify-content-center">
                <DetailElements/>
            </div>

            <div className="container-fluid d-flex justify-content-center mt-5">
                <div className="myRow mt-3">
                    <div className="mat-TwoPage">
                        <button className={`mat-ButtonInfo ${currentPage === 1 ? 'Active' : ''}`}
                                onClick={() => handlePageClick(1)}>
                            {t("Product-Detail.products.name")}
                        </button>
                        <button className={`mat-ButtonBack ${currentPage === 2 ? 'Active' : ''}`}
                                onClick={() => handlePageClick(2)}>
                            {t("Product-Detail.qem.name")}
                        </button>
                        <button className={`mat-ButtonBack ${currentPage === 3 ? 'Active' : ''}`}
                                onClick={() => handlePageClick(3)}>
                            {t("Product-Detail.cross.name")}
                        </button>
                        <button className={`mat-ButtonBack ${currentPage === 4 ? 'Active' : ''}`}
                                onClick={() => handlePageClick(4)}>
                            {t("Product-Detail.nv.name")}
                        </button>
                        <button className={`mat-ButtonBack ${currentPage === 5 ? 'Active' : ''}`}
                                onClick={() => handlePageClick(5)}>
                            {t("Product-Detail.stock.name")}
                        </button>
                    </div>
                </div>
            </div>

            {currentPage === 1 && (
                <div className="container-fluid  d-flex justify-content-center ">
                    <div className="myRow">
                        <div className="ShopingCartsCenterMain">
                            <ShoppingCards/>
                        </div>
                    </div>
                </div>
            )}

            {currentPage === 2 && (
                <div className="container-fluid mt-5 d-flex justify-content-center">
                    <div className="myRow">
                        <table className="table MyTable  table-bordered mt-3">
                            <tbody>
                            <tr>
                                <th style={{padding: "12px 27px 5px 19px"}} className='text-44'
                                    scope="col">{t("Product-Detail.qem.brand")}</th>
                                <th style={{padding: "12px 27px 5px 19px"}} colSpan={2}
                                    scope="col">{t("Product-Detail.qem.qem")}</th>
                            </tr>
                            {oemData.map((d, i) => {
                                return <tr key={i}>
                                    <td style={{padding: "12px 27px 5px 19px"}}>{d.vehicleBrandName}</td>
                                    <td style={{padding: "12px 27px 5px 19px"}} colSpan={2}>{d.oemCode}</td>
                                </tr>
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {currentPage === 3 && (
                <div className="container-fluid mt-5 d-flex justify-content-center">
                    <div className="myRow">
                        <table className="table MyTable  table-bordered mt-3">
                            <tbody>
                            <tr>
                                <th style={{padding: "12px 27px 5px 19px"}} className='text-44'
                                    scope="col">{t("Product-Detail.cross.manufacture")}</th>
                                <th style={{padding: "12px 27px 5px 19px"}}
                                    scope="col">{t("Product-Detail.cross.oem")}</th>
                            </tr>
                            {crossList.map((d, i) => {
                                return <tr key={i}>
                                    <td style={{padding: "12px 27px 5px 19px"}}>{d.manufacturerName}</td>
                                    <td style={{padding: "12px 27px 5px 19px"}} colSpan={2}>{d.oemCode}</td>
                                </tr>
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {currentPage === 4 && (
                <div className="container-fluid mt-5 d-flex justify-content-center">
                    <div className="myRow">
                        <table className="table MyTable  table-bordered mt-3">
                            <tbody>
                            <tr>
                                <th style={{padding: "12px 27px 5px 19px"}} className='text-44'
                                    scope="col">{t("Product-Detail.nv.car")}</th>
                                <th style={{padding: "12px 27px 5px 19px"}} colSpan={2}
                                    scope="col">{t("Product-Detail.nv.model")}</th>
                                <th style={{padding: "12px 27px 5px 19px"}} colSpan={2}
                                    scope="col">{t("Product-Detail.nv.type")}</th>
                                <th style={{padding: "12px 27px 5px 19px"}} colSpan={2}
                                    scope="col">{t("Product-Detail.nv.year")}</th>
                                <th style={{padding: "12px 27px 5px 19px"}} colSpan={2}
                                    scope="col">{t("Product-Detail.nv.engine")}</th>
                                <th style={{padding: "12px 27px 5px 19px"}} colSpan={2}
                                    scope="col">{t("Product-Detail.nv.hp")}</th>
                                <th style={{padding: "12px 27px 5px 19px"}} colSpan={2}
                                    scope="col">{t("Product-Detail.nv.kw")}</th>
                            </tr>

                            {vehicleList.map((d, i) => {
                                return <tr key={i}>
                                    <td style={{padding: "12px 27px 5px 19px"}}>{d.vehicleBrandName}</td>
                                    <td style={{padding: "12px 27px 5px 19px"}} colSpan={2}>{d.vehicleModelName}</td>
                                    <td style={{padding: "12px 27px 5px 19px"}} colSpan={2}>{d.type}</td>
                                    <td style={{padding: "12px 27px 5px 19px"}} colSpan={2}>{d.date}</td>
                                    <td style={{padding: "12px 27px 5px 19px"}} colSpan={2}>{d.engineCode}</td>
                                    <td style={{padding: "12px 27px 5px 19px"}} colSpan={2}>{d.hp}</td>
                                    <td style={{padding: "12px 27px 5px 19px"}} colSpan={2}>{d.kw}</td>
                                </tr>
                            })}

                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {currentPage === 5 && (
                <div className="container-fluid mt-5 d-flex justify-content-center">
                    <div className="myRow">
                        <table className="table MyTable  table-bordered mt-3">
                            <tbody>
                            <tr>
                                <th style={{padding: "12px 27px 5px 19px"}} className='text-44'
                                    scope="col">{t("Product-Detail.stock.date")}</th>
                                <th style={{padding: "12px 27px 5px 19px"}} colSpan={2}
                                    scope="col">{t("Product-Detail.stock.quantlty")}</th>
                                <th style={{padding: "12px 27px 5px 19px"}} colSpan={2}
                                    scope="col">{t("Product-Detail.stock.file")}</th>
                                <th style={{padding: "12px 27px 5px 19px"}} colSpan={2}
                                    scope="col">{t("Product-Detail.stock.sales")}</th>
                            </tr>

                            {productStockMovements.map((d, i) => {
                                return <tr key={i}>
                                    <td style={{padding: "12px 27px 5px 19px"}}>{moment(d.confirmDate).format('DD-MM-YYYY HH:MM')}</td>
                                    <td style={{padding: "12px 27px 5px 19px"}} colSpan={2}>{d.quantityOfProduct}</td>
                                    <td style={{padding: "12px 27px 5px 19px"}} colSpan={2}>{d.orderNumber}</td>
                                    <td style={{padding: "12px 27px 5px 19px"}} colSpan={2}>{d.salesPrice} AZN</td>
                                </tr>
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
};

export default Index;
