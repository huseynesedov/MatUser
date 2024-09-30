import React, { useEffect, useState } from "react";

import "./style.css";

import images from "../../../Assets/images/js/Images";
import NewAddres from "../../Elements/ProfileElement/Address/index";


import ProdcutItem from "../../Elements/ProfileElement/ProductItem/index";
import { AdminApi } from "../../../api/admin.api";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../AuthContext";

const Profile = () => {

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
            setIdHash(decoded?.id); // Token'den gelen id'yi idHash olaraq belirliyoruz
            console.log('Dekod olunmuş token:', decoded); // Tokeni konsola yazdırırıq
            setTimeout(()=>{
                UserData(decoded.UserIdHash); // idH
            } , 1000)
            if (decoded) {
                setDecodedToken(decoded); // Dekod olunmuş məlumatı state-ə yazırıq
                setIdHash(decoded?.id); // Token'den gelen id'yi idHash olaraq belirliyoruz
                console.log("Dekod olunmuş token:", decoded); // Tokeni konsola yazdırırıq
            }
        }

    }, []);

    const UserData = async (idHash) => {
        console.log(idHash)
        if (idHash) {
            try {
                const response = await AdminApi.GetUserPersonalInformationById(idHash); // idHash istifadə olunur
                console.log("API response:", response);
                console.log("Sending API request with idHash:", idHash); // API isteğinden önce idHash'i yazdırırıq
                const response = await AdminApi.GetOemByProductId({ id: idHash }); // idHash istifadə olunur
                console.log("API response:", response); // API cavabını konsola yazdırırıq
                setData({ ...response, idHash }); // response ilə birlikdə idHash-i də saxlayırıq
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.warn("Unauthorized access, logging out..."); // 401 status kodu gəldikdə logout
                    logout();
                } else {
                    console.error("Error fetching product data:", error); // Başqa hataları göstəririk
                }
            }
        } else {
            console.warn("idHash is not set, skipping API request"); // idHash boş olduğu üçün API isteği yapılmıyor
        }
    };


    return <>
        <div className="mat-container">
            <div className="mat-row">
                <div className="mat-row2">

                    <div className="mat-p">
                        <p className="matP">
                            Şəxsi Məlumatlar
                        </p>
                    </div>
                    {data ? (
                        <div className="mat-profilInformationContainer">
                            <div className="mat-ProfilContainer">

                                <div className="mat-ProfilCenter">

                                    <div className="mat-Profil">
                                        <img src={user} alt="" />
                                    </div>
                                    <div className="mat-UserInformationCenter">
                                        <div className="mat-UserName">
                                            <p className="UserName">
                                                Mahta Aghajani
                                            </p>
                                        </div>
                                        <div className="mat-UserInformation d-flex">
                                            <span className="d-flex mat-UserMail">
                                                <img src={mail} alt="" />
                                                <p className="mat-UserMailText"> {data ? data.Email : ''}</p>
                                            </span>
                                            <span className="d-flex mat-UserMail ml-20">
                                                <img src={location} alt="" />
                                                <p className="mat-UserMailText"> Azerbaijan , Baku</p>
                                            </span>
                                            <span className="d-flex mat-UserMail ml-20">
                                                <img src={tel} alt="" />
                                                <p className="mat-UserMailText">+994101001010</p>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mat-TwoPage">

                                    <button className={`mat-ButtonInfo ${currentPage === 1 ? "Active" : ""}`} onClick={handlePage1Click}>Şəxsi Məlumatlar</button>
                                    <button className={`mat-ButtonBack ${currentPage === 2 ? "Active" : ""}`} onClick={handlePage2Click}>Geri Bildirmə</button>
                                </div>

                            </div>
                        </div>

                    ) : (
                        <p>Loading...</p>
                    )}

                    
                    <div className="mat-UserInformationContainer w-100">
                        {currentPage === 1 && (

                            <div className="mat2-ProfilContainer">

                                <div className="row ">

                                    <div className="col d-flex flex-row-reverse">
                                        <button type="button" className="UserEditİnfo">
                                            <img src={pen} alt="" />
                                            <span>Məlumatı redaktə edin</span>
                                        </button>
                                    </div>
                                </div>


                                <div className="row ">
                                    <div className="col-5">
                                        <form>
                                            <div className="form-group">
                                                <label for="exampleInputName" className="black-4">Ad</label>
                                                <input type="text" className="form-control w-402p input-place mt-2" id="exampleInputName" aria-describedby="nameHelp" placeholder="Huseyn" />

                                            </div>
                                        </form>
                                    </div>
                                    <div className="col-5">
                                        <div className="form-group">
                                            <label for="exampleInputSurname" className="black-4">Soyad</label>
                                            <input type="text" className="form-control w-402p input-place mt-2" id="exampleInputSurname" aria-describedby="emailHelp" placeholder="Əsədov" />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-5">
                                        <form>
                                            <div className="form-group">
                                                <label for="exampleInputNumber" className="black-4">Telefon</label>
                                                <input type="text" className="form-control w-402p input-place mt-2" id="exampleInputNumber" aria-describedby="NumberHelp" placeholder="+994 123456789" />

                                            </div>
                                        </form>
                                    </div>
                                    <div className="col-5">
                                        <div className="form-group">
                                            <label for="exampleInputCity" className="black-4">Şəhər</label>
                                            <input type="text" className="form-control w-402p input-place mt-2" id="exampleInputCity" aria-describedby="cityHelp" placeholder="Baku" />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-5">
                                        <form>
                                            <div className="form-group">
                                                <label for="exampleInputNumber" className="black-4">Rayon</label>
                                                <input type="text" className="form-control w-402p input-place mt-2" id="exampleInputNumber" aria-describedby="NumberHelp" placeholder="Abşeron" />

                                            </div>
                                        </form>
                                    </div>
                                    <div className="col-5">
                                        <div className="form-group">
                                            <label for="exampleInputCity" className="black-4">Küçə</label>
                                            <input type="text" className="form-control w-402p input-place mt-2 focus-ring-none" id="exampleInputCity" aria-describedby="cityHelp" placeholder="Xirdalan şəh., Mexaniki dəstə, ..." />
                                        </div>
                                    </div>
                                </div>

                                <div className="row d-flex flex-direction-colum">
                                    <div className="col-9">

                                        <div className="form-group">
                                            <label for="exampleFormControlTextarea1" className="black-4">Address</label>
                                            <textarea className="form-control mt-2 textarea" id="exampleFormControlTextarea1" placeholder="
                                        Street:  Xirdalan Seh., Mexaniki Deste, 23 Az1000, Absheron 
                                        State/province/area:    Baku 
                                        Phone number:  994 12 4480063"  >

                                            </textarea>
                                        </div>
                                        <div className="col mt-4">

                                            <div className="col d-flex flex-row-reverse ">
                                                <img src={Add_Bin} alt="" className={`${isFlex ? 'd-flex' : ''} Add_Bin`} onClick={handleHideClick} />
                                            </div>

                                            {ShowNewAddres && <NewAddres />}
                                            <button onClick={handleClick} className="AddNewAddres">
                                                <img src={NewAddress} alt="" />
                                                <span>Yeni Addres Yazın</span>
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            </div>

                        )}

                        {currentPage === 2 && (
                            <div className="mat3-ProfilContainer">

                                <div className="row mt-5 ">
                                    <div className="col ">
                                        <button type="button" className="ProductSearch">
                                            <input type="text"
                                                className="SearchInput"

                                                placeholder="Məhsul Axdarışı" />

                                            <img src={SearchBar} alt="" className="SearchBarIcon" />
                                        </button>
                                    </div>
                                </div>



                                <div className="row d-flex  justify-content-between mt-5">

                                    <ProdcutItem />
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>


    </>
}

export default Profile;




