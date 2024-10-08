import React, { useState, useEffect } from 'react';
import { Spin } from  'antd'
import { useParams, Link } from 'react-router-dom';
import Images from '../../../Assets/images/js/Images';
import { FaHeart } from "react-icons/fa";
import { ProductApi } from "../../../api/product.api";
import {BasketApi} from "../../../api/basket.api";
import  {useAuth} from "../../../AuthContext";
import { useTranslation } from "react-i18next";

const DetailElements = () => {
    const { t } = useTranslation();
    const { openNotification  , logout} = useAuth()
    const { id } = useParams(); // URL'den ID'yi alırıq
    let idHash = id
    const { Location_gray, FiTag, Star_Yellow, Star_Gray, Liner, Heart2 } = Images;
    const [features , setFeatures] = useState(  [
        { name: t("Product-Detail.table.car"), value: "" },
        { name: t("Product-Detail.table.manufacturer"), value: "" },
        { name: t("Product-Detail.table.qem"), value: "" },
        { name: t("Product-Detail.table.code"), value: "" },
        { name: t("Product-Detail.table.name"), value: "" },
        { name: t("Product-Detail.table.brand"), value: "" },
        { name: t("Product-Detail.table.carbrand"), value: "" },
        { name: t("Product-Detail.table.availability"), value: "" }
    ], )
    let [quantity, setQuantity] = useState(1); // Default şəkil
    let [loading, setLoading] = useState(true); // Default şəkil
    let [error, setError] = useState(false); // Default şəkil
    const [hoverRating, setHoverRating] = useState(0); // hover edildikdə tutulan rating
    const [isFavorite, setIsFavorite] = useState(false); // Favorite state
    const [productData, setProductData] = useState({}); // Ürün bilgilerini saklayacak state
    const [selectedImage, setSelectedImage] = useState(''); // Ürün bilgilerini saklayacak state


    const fetchProductData = async () => {
        setLoading(true)
        if (id) {
            try {
                const response = await ProductApi.GetProductById({ id: idHash });
                console.log("API response:", response);
                setProductData(response);
                setSelectedImage(response?.defaultContent);
                setFeatures([
                    { name: t("Product-Detail.table.car"), value:  response?.vehicleBrands.map((s)=>{
                            return <span> {s?.vehicleBrandIdName}, </span>
                        })},
                    { name: t("Product-Detail.table.manufacturer"), value: response?.manufacturerCode},
                    { name: t("Product-Detail.table.qem"), value: response?.oemCode},
                    { name: t("Product-Detail.table.code"), value: response?.code},
                    { name: t("Product-Detail.table.name"), value: response?.name},
                    { name: t("Product-Detail.table.brand"), value: response?.manufacturerName },
                    { name: t("Product-Detail.table.carbrand"), value: response?.vehicleModels.map((s)=>{
                            return <span> {s.vehicleModelIdName}, </span>
                        })},
                    { name: t("Product-Detail.table.availability"), value: response?.status ? 'Var' : 'Yoxdur' }
                ])
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
        fetchProductData();
    }, [idHash]);


    useEffect(() => {
        // Eğer ürün varsa ve carouselImages dizisi tanımlı ise ilk resmi seç
        // if (productData && productData.carouselImages && productData.carouselImages.length > 0) {
        //     setSelectedImage(productData.carouselImages[0].img);
        // }
        setSelectedImage(productData?.picture);

    }, [productData]);

    if (error) {
        return (
            <div className='d-flex flex-column align-items-center w-100 h-100 justify-content-center'>
                <img src="https://cdn.dribbble.com/users/721524/screenshots/4117132/media/6dff4135f851cd4af82839d83e00d1d6.png?resize=800x600&vertical=center" alt="" />
                <h1>Məhsul Tapılmadı !!!!</h1>
            </div>
        );
    }

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const handleMouseEnter = (ratingValue) => {
        setHoverRating(ratingValue);
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const addToBasket  = async () => {
        await  BasketApi.AddToBasket( {
            productId: idHash,
            quantity
        }).then(() =>{
            openNotification('Əlavə edildi' , `${productData.name} səbətə əlavə edildi` , false )
        }).catch((err)=>{
            openNotification('Xəta baş verdi' , err.response.data.message , true )
        })
    }


    // Rating dəyəri
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <img
                    key={i}
                    src={i <= rating ? Star_Yellow : Star_Gray}
                    alt={`${i <= rating ? 'yellow' : 'gray'}-star`}
                />
            );
        }
        return stars;
    };

    return (
        <>
            {loading ?
                <Spin size={'large'}/>
                :
                <div className="myRow mt-3">
                    <div className="row align-items-center justify-content-between border rounded"
                         style={{width: "39.3%", height: "655px"}}>
                        {/* imgs carousel */}
                        <div className="col-1 d-flex flex-column justify-content-between ms-3 p-0"
                             style={{width: "97px", height: "420px"}}>
                            {productData?.contents?.length > 0 ? productData.contents.map((imageObj, index) => (
                                <button key={index} className="none" onClick={() => handleImageClick(imageObj)}>
                                    <div className="d-flex border rounded w-100"
                                         style={{height: "97px", padding: "6px"}}>
                                        <img className="w-100" src={imageObj} alt={`carousel-img-${index}`}/>
                                    </div>
                                </button>
                            )) : ''
                            }
                            <div className="d-flex border rounded w-100" style={{height: "97px", padding: "6px"}}>
                                <img className="w-100 h-100" src={productData?.defaultContent}
                                     alt={`carousel-img-0`}/>
                            </div>
                        </div>

                        {/* img container start */}
                            <div className="col-1 me-5" style={{width: "325px", height: "300px"}}>
                                <img className="w-100" src={productData?.defaultContent} alt="selected-carousel"/>
                            </div>
                            {/* img container end */}
                            </div>
                            <div className="row flex-column flex-wrap" style={{width: "61%"}}>
                        <div className="d-flex justify-content-between flex-wrap">
                        <div className="col-1 d-flex flex-column" style={{width: "490px"}}>
                            <span className="d-flex">
                                <img src={FiTag} alt=""/>
                                <p className="OemNo text-44 ms-2">{productData.oemCode}</p>
                            </span>
                                <span className="mt-1 text-44">
                                <p className="Oem Oem2 d-flex align-items-baseline">
                                    OEM № : <span className="OemNo OemNo2">{productData.oemCode}</span>
                                </p>
                            </span>
                                <span>
                                <h3 className="BrandingName BrandingName2 mt-2">
                                    {productData.name}
                                    <span className="BrandingNameTwo">{productData.description}</span>
                                </h3>
                            </span>
                            </div>

                            <div className="col w-100 d-flex justify-content-end">
                                <div className="d-flex flex-column">
                                <span className="d-blok">
                                    <div className="d-flex align-items-center">
                                        <p className="me-2 fb-500 f-14">{hoverRating > 0 ? hoverRating.toFixed(1) : productData.rating}</p>
                                        <span onMouseEnter={() => handleMouseEnter(5)} onMouseLeave={handleMouseLeave}>
                                            {renderStars(hoverRating > 0 ? hoverRating : productData.rating)}
                                        </span>
                                    </div>
                                </span>
                                    <span className="d-flex mt-3 justify-content-end">
                                    <p className="f-14 t_decoration text-44">{productData.reviews} {t("Product-Detail.assessment")}</p>
                                </span>
                                </div>
                            </div>
                        </div>

                                <img className='mt-4' src={Liner} alt=""/>

                        <div className="row mt-4">
                            <div className="col">
                                <p className="f-24 text-44 fb-500">{t("Product-Detail.features")}</p>
                            </div>
                        </div>

                                <div className="row mt-3">
                            <div className="col">
                                <table className='MyTable2'>
                                    <tbody>
                                    {features.map((feature, index) => (
                                        <tr key={index} className="border-E9">
                                            <th className="row-header f-14">{feature.name}</th>
                                            <td className="ms-1">{feature.value} </td>
                                        </tr>
                                    ))}
                                    <tr className="border-E9">
                                        <th className="row-header f-14">Mövcudluğu</th>
                                        <td className="ms-1 d-flex align-items-center">
                                            <img src={Location_gray} alt=""/>
                                            <p className="ms-1"> Baku</p>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="row mt-5 d-flex">
                            <div className="col d-flex justify-content-between">
                                <div className="counterCenter2">
                                    <button onClick={() => {
                                        setQuantity(quantity -= 1)
                                    }} className="del2">-
                                    </button>
                                    <input value={quantity} onChange={(e) => {
                                        setQuantity(e.target.value)
                                    }} type="text" name="" id="" className="counter2"/>
                                    <button onClick={() => {
                                        setQuantity(quantity += 1)
                                    }} className="plus2">+
                                    </button>
                                </div>

                                <div className="col-8 d-flex justify-content-between align-items-center">
                                    <div onClick={() => {
                                        addToBasket()
                                    }}
                                         className="d-flex buttonSebet  cursor-pointer align-items-center justify-content-center"
                                         style={{width: "426px", height: "46px"}}>
                                        <button className="none">{t("Global.basket")}</button>
                                    </div>
                                    <Link to="">
                                    <div className="d-flex">
                                            <div className="Heart2" onClick={toggleFavorite}>
                                                {/* Heart border gray */}
                                                {isFavorite ? (
                                                    <FaHeart className='text-danger f_28'/>
                                                ) : (
                                                    <img src={Heart2} alt="Heart"/>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default DetailElements;
