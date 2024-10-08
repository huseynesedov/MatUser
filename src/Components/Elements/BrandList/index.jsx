import Slider from "react-slick";
import React, {useEffect, useState} from "react";
import {CatalogApi} from "../../../api/catalog.api";
import { useTranslation } from "react-i18next";
const BrandList = () => {
    const settings = {
        className: "center",
        infinite: true,
        centerPadding: "60px",
        slidesToShow: 10,
        autoplay: true,
        autoplaySpeed: 2000,
        swipeToSlide: true,
    };

    const { t } = useTranslation();
    const [list , setList] = useState([])

    useEffect(() => {
        CatalogApi.GetManufacturerList().then((res) =>    {
            let arr = res.map((r)=>{
                return {
                    ...r,
                    url: r.content
                }
            })
           setList(arr)
        })
    }, []);


    return <div className="Container h-100">
        <div className="myRow h-auto line">
            <div className="text-start w-100 mt-4">
                <h3 className={'font-weight-bold text-44'}>
                    {t("Home.manufacturers")}
                </h3>
            </div>
            <div className="BredsSlide">
                <div className="slider-container">
                <Slider {...settings}>
                        {list.map((s,i)=>{
                            return (
                                <div key={i} className="BrandCircle">
                                    <img className="BrandImg"
                                         src={s.url}
                                         alt=""/>
                                </div>
                            )
                        })}
                    </Slider>
                </div>
            </div>
        </div>
    </div>
}

export default BrandList;
