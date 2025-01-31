import Slider from "react-slick";
import React, { useEffect, useState } from "react";
import { CatalogApi } from "../../../api/catalog.api";
import { useTranslation } from "react-i18next";
import { Tooltip } from "antd";

const BrandList = () => {
    const settings = {
        className: "center",
        infinite: true,
        centerPadding: "60px",
        slidesToShow: 10,
        autoplay: true,
        autoplaySpeed: 2000,
        swipeToSlide: true,
        responsive: [
            {
                breakpoint: 1200, // Laptop ve büyük tabletler
                settings: {
                    slidesToShow: 6,
                }
            },
            {
                breakpoint: 992, // Küçük tabletler
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 768, // Telefonlar
                settings: {
                    slidesToShow: 3,
                    centerPadding: "10px"
                }
            }
        ]
    };
    

    const { t } = useTranslation();
    const [list, setList] = useState([])

    useEffect(() => {
        CatalogApi.GetManufacturerList().then((res) => {
            let arr = res.map((r) => {
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
                        {list.map((s, i) => {
                            return (
                                <Tooltip placement={'top'} title={s.displayText}>
                                    <div key={i} className="BrandCircle cursor-pointer">
                                        <img className="BrandImg"
                                            src={s.url}
                                            alt={s.displayText} />
                                    </div>
                                </Tooltip>
                            )
                        })}
                    </Slider>
                </div>
            </div>
        </div>
    </div>
}

export default BrandList;
