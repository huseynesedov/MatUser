import React, { useEffect, useState } from "react";

import "./style.css";

import images from "../../../Assets/images/js/Images";
import NewAddres from "../../Elements/ProfileElement/Address/index";


import ProdcutItem from "../../Elements/ProfileElement/ProductItem/index";
import { AdminApi } from "../../../api/admin.api";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../AuthContext";
import { useTranslation } from "react-i18next";
import { Space, Spin } from "antd";

const Profile = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    let { user, mail, location, tel, pen, NewAddress, Add_Bin, SearchBar } = images;

    const [ShowNewAddres, setShowNewAddres] = useState(false);
    const [isFlex, setIsFlex] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const handleClick = () => {
        setShowNewAddres(true);
        setIsFlex(!isFlex);
    };
    const handleHideClick = () => {
        setIsFlex(!isFlex);
        setShowNewAddres(false);
    };
    const handlePage1Click = () => {
        setCurrentPage(1);
    };
    const handlePage2Click = () => {
        setCurrentPage(2);
    };



    const [data, setData] = useState([]); // Gələn məlumatları burada saxlayırıq
    const { logout } = useAuth(); // useAuth içindən logout funksiyasını çağırırıq
    const [decodedToken, setDecodedToken] = useState(null); // Dekod olunmuş token-i saxlayırıq
    const [idHash, setIdHash] = useState(null); // Token'den gelen id'yi saklamak için


    const decodeJwt = (token) => {
        try {
            const payloadBase64 = token.split(".")[1]; // Token-in ikinci hissəsi payload hissəsidir
            const decodedPayload = atob(payloadBase64); // Base64 formatından decode edirik
            return JSON.parse(decodedPayload); // JSON formatına çeviririk
        } catch (error) {
            console.error("Token decoding error:", error); // Hata varsa konsolda göstəririk
            return null;
        }
    };

    useEffect(() => {
        // localStorage-dən token almaq
        const savedToken = localStorage.getItem("token"); // 'token' açarı ilə saxlanmış olanı götür
        if (savedToken) {
            const decoded = decodeJwt(savedToken); // Token-i decode edirik
            setDecodedToken(decoded); // Dekod olunmuş məlumatı state-ə yazırıq
            setTimeout(() => {
                UserData(decoded.UserIdHash); // idH
            }, 1000)
            if (decoded) {
                setDecodedToken(decoded); // Dekod olunmuş məlumatı state-ə yazırıq
                setIdHash(decoded?.id); // Token'den gelen id'yi idHash olaraq belirliyoruz
            }
        }

    }, []);

    const UserData = async (idHash) => {
        setLoading(true); // API çağrısı başlamadan önce loading'i true yapıyoruz
        console.log(idHash);
        if (idHash) {
            try {
                const response = await AdminApi.GetUserPersonalInformationById(idHash); // idHash kullanıyoruz
                console.log("API response:", response); // API cevabını konsola yazdırıyoruz
                setData({ ...response, idHash }); // response ile birlikte idHash'i de kaydediyoruz
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.warn("Unauthorized access, logging out..."); // 401 hatasında çıkış yapılıyor
                    logout();
                } else {
                    console.error("Error fetching user data:", error); // Diğer hatalar
                }
            } finally {
                setLoading(false); // API çağrısı tamamlandıktan sonra loading'i false yapıyoruz
            }
        }
    };




    const [isDisabled, setIsDisabled] = useState(true);

    // Function to toggle the disabled state
    const handleEditClick = () => {
        setIsDisabled(!isDisabled);
    };



    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        companyTel: '',
        city: '',
        district: '',
        street: '',
        address: ''
    });


    useEffect(() => {
        if (data) {
            setFormData({
                name: data.companyName || '',
                surname: data.surname || '',
                companyTel: data.companyTel || '',
                city: data.city || '',
                district: data.district || '',
                street: data.street || '',
                address: data.companyAddress || ''
            });
        }
    }, [data]);


    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });
    };


    return <>
        <div className="mat-container">
            <div className="mat-row">
                {!loading ?
                    <div className="mat-row2">

                        <div className="mat-p">
                            <p className="matP">
                                {t("User.user-name")}
                            </p>
                        </div>
                        <div className="mat-profilInformationContainer">
                            <div className="mat-ProfilContainer">

                                <div className="mat-ProfilCenter">

                                    <div className="mat-Profil">
                                        <img src={user} alt="" />
                                    </div>
                                    <div className="mat-UserInformationCenter">
                                        <div className="mat-UserName">
                                            <p className="UserName">
                                                {data ? data.companyName : ''}
                                            </p>
                                        </div>
                                        <div className="mat-UserInformation d-flex">
                                            <span className="d-flex mat-UserMail">
                                                <img src={mail} alt="" />
                                                <p className="mat-UserMailText"> {data ? data.companyEmail : ''}</p>
                                            </span>
                                            <span className="d-flex mat-UserMail ml-20">
                                                <img src={location} alt="" />
                                                <p className="mat-UserMailText"> {data ? data.countryName : ''} , {data ? data.cityName : ''}</p>
                                            </span>
                                            <span className="d-flex mat-UserMail ml-20">
                                                <img src={tel} alt="" />
                                                <p className="mat-UserMailText">{data ? data.companyTel : ''}</p>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mat-TwoPage">

                                    <button className={`mat-ButtonInfo ${currentPage === 1 ? "Active" : ""}`} onClick={handlePage1Click}>
                                        {t("User.user-name")}
                                    </button>
                                    <button className={`mat-ButtonBack ${currentPage === 2 ? "Active" : ""}`} onClick={handlePage2Click}>
                                        {t("User.back")}
                                    </button>
                                </div>

                            </div>
                        </div>


                        <div className="mat-UserInformationContainer w-100">
                            {currentPage === 1 && (

                                <div className="mat2-ProfilContainer">
                                    {/* <div className="row ">
                                    <div className="col d-flex flex-row-reverse">
                                        <button type="button" className="UserEditİnfo" onClick={handleEditClick}>
                                            <img src={pen} alt="" />
                                            <span>{t("User.info-edit")}</span>
                                        </button>
                                    </div>
                                </div> */}


                                    <div className="row">
                                        <div className="col-5">
                                            <form>
                                                <div className="form-group">
                                                    <label htmlFor="name" className="black-4">
                                                        {t("User.table.name")}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        disabled={isDisabled}
                                                        className="form-control w-402p input-place mt-2"
                                                        id="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </form>
                                        </div>
                                        <div className="col-5">
                                            <div className="form-group">
                                                <label htmlFor="surname" className="black-4">
                                                    {t("User.table.surname")}
                                                </label>
                                                <input
                                                    type="text"
                                                    disabled={isDisabled}
                                                    className="form-control w-402p input-place mt-2"
                                                    id="surname"
                                                    value={formData.surname}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-5">
                                            <form>
                                                <div className="form-group">
                                                    <label htmlFor="companyTel" className="black-4">
                                                        {t("User.table.phone")}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        disabled={isDisabled}
                                                        className="form-control w-402p input-place mt-2"
                                                        id="companyTel"
                                                        value={formData.companyTel}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </form>
                                        </div>
                                        <div className="col-5">
                                            <div className="form-group">
                                                <label htmlFor="city" className="black-4">
                                                    {t("User.table.city")}
                                                </label>
                                                <input
                                                    type="text"
                                                    disabled={isDisabled}
                                                    className="form-control w-402p input-place mt-2"
                                                    id="city"
                                                    value={formData.cityName}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-5">
                                            <form>
                                                <div className="form-group">
                                                    <label htmlFor="district" className="black-4">
                                                        {t("User.table.district")}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        disabled={isDisabled}
                                                        className="form-control w-402p input-place mt-2"
                                                        id="district"
                                                        value={formData.districtName}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </form>
                                        </div>
                                        <div className="col-5">
                                            <div className="form-group">
                                                <label htmlFor="street" className="black-4">
                                                    {t("User.table.street")}
                                                </label>
                                                <input
                                                    type="text"
                                                    disabled={isDisabled}
                                                    className="form-control w-402p input-place mt-2"
                                                    id="street"
                                                    value={formData.companyAddress}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row d-flex flex-direction-colum">
                                        <div className="col-9">
                                            <div className="form-group">
                                                <label htmlFor="address" className="black-4">
                                                    {t("User.table.address")}
                                                </label>
                                                <textarea
                                                    disabled={isDisabled}
                                                    className="form-control mt-2 textarea"
                                                    id="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            {/* <div className="col mt-4">
                                            <div className="col d-flex flex-row-reverse ">
                                                <img src={Add_Bin} alt="" className={`${isFlex ? 'd-flex' : ''} Add_Bin`} onClick={handleHideClick} />
                                            </div>
                                            {ShowNewAddres && <NewAddres />}
                                            <button onClick={handleClick} className="AddNewAddres">
                                                <img src={NewAddress} alt="" />
                                                <span>Yeni Addres Yazın</span>
                                            </button>
                                        </div> */}
                                        </div>
                                    </div>
                                </div>

                            )}

                            {currentPage === 2 && (
                                <div className="mat3-ProfilContainer">

                                    {/* <div className="row mt-5 ">
                                    <div className="col ">
                                        <button type="button" className="ProductSearch">
                                            <input type="text"
                                                className="SearchInput"

                                                placeholder="Məhsul Axdarışı" />

                                            <img src={SearchBar} alt="" className="SearchBarIcon" />
                                        </button>
                                    </div>
                                </div> */}



                                    <div className="row d-flex  justify-content-between mt-5">

                                        {/* <ProdcutItem /> */}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                    : <>
                        <div className={'w-100 d-flex justify-content-center align-items-center'}>
                            <Space size="middle">
                                <Spin size="large" />
                            </Space>
                        </div>
                    </>}
            </div>
        </div>


    </>
}

export default Profile;
