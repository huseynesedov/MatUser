import React, { useState } from "react";

import "./style.scss";

import images from "../../../Assets/images/js/Images";

import BrandExpo from "../../Elements/BusinessElements/Brands/index";
import DebetExpo from "../../Elements/BusinessElements/DebetCard";
import { useTranslation } from "react-i18next";

const Profile = () => {
    const { t } = useTranslation();

    let { Hiuser, mail, location, tel } = images


    const [currentPage, setCurrentPage] = useState(1);


    const handlePage1Click = () => {
        setCurrentPage(1);
    };
    const handlePage2Click = () => {
        setCurrentPage(2);
    };

    return <>
        <div className="mat-container">
            <div className="mat-row">
                <div className="mat-row2">

                    <div className="mat-p">
                        <p className="matP">
                            {t("Company.company-name")}
                        </p>
                    </div>

                    <div className="mat-profilInformationContainer">
                        <div className="mat-ProfilContainer">

                            <div className="mat-ProfilCenter">

                                <div className="mat-Profil">
                                    <img src={Hiuser} alt="" />
                                </div>
                                <div className="mat-UserInformationCenter">
                                    <div className="mat-UserName">
                                        <p className="UserName">
                                            Bosch Manager
                                        </p>
                                    </div>
                                    <div className="mat-UserInformation d-flex">
                                        <span className="d-flex mat-UserMail">
                                            <img src={mail} alt="" />
                                            <p className="mat-UserMailText"> Demo@gmail.com</p>
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

                                <button className={`mat-ButtonInfo ${currentPage === 1 ? "Active" : ""}`} onClick={handlePage1Click}>{t("Company.brand")}</button>
                                <button className={`mat-ButtonBack ${currentPage === 2 ? "Active" : ""}`} onClick={handlePage2Click}>{t("Company.bank")}</button>
                            </div>

                        </div>
                    </div>

                    <div className="mat-UserInformationContainer w-100">
                        {currentPage === 1 && (

                            <div className="mat3-ProfilContainer">


                                <div className="row gy-4 mt-5">

                                    <BrandExpo />

                                </div>



                            </div>

                        )}

                        {currentPage === 2 && (
                            <div className="mat3-ProfilContainer">

                                <div className="row gy-4  mt-5 ">

                                    <DebetExpo />

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
