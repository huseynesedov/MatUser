import React, { useState } from "react";
import ShoppingCards from "../../Elements/ShoppingCards/index";
import ShoppingGridCards from "../../Elements/ShoppingCards/gridMain";
import { useTranslation } from "react-i18next";
import './home.css'
import { Helmet } from "react-helmet";
import images from "../../../Assets/images/js/Images";
import PermissionWrapper from "../../Elements/PermissionWrapper/PermissionWrapper";
import Images from "../../../Assets/images/js/Images";

function Home() {
  let { foodg, elba } = images
  const { t } = useTranslation();

  const [isGridTwo, setIsGridTwo] = useState(false);
  const toggleGrid = () => {
    setIsGridTwo((prev) => !prev);
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>MAT Software - Home</title>
      </Helmet>


      <div className="Container h-100">
        <div className="myRow line">

          <div className="BrendImgCenter">
            <div className="CenterImg">
              <img src={foodg} alt="" />
            </div>
            <div className="CenterImg">
              <img src={elba} alt="" />
            </div>
          </div>

          <div className="ShopingCartsCenterMain mt-5">
            <div className="ShopingTextAndIcon">
              <h2>{t("Home.brand")}</h2>

              <img src={Images.Grid_icon}
                onClick={toggleGrid}
                style={{ cursor: "pointer" }}
                alt="" />
            </div>

            <div>
              {isGridTwo ? (
                /* Grid 2 */
                <PermissionWrapper
                  topModuleCode="$USER"
                  subModuleCode="$PRODUCT_SUB_MODULE"
                  pageCode="$PRODUCT"
                  rightCode="$GET"
                >
                  <ShoppingGridCards />
                </PermissionWrapper>
              ) : (
                /* Grid 1 */
                <PermissionWrapper
                  topModuleCode="$USER"
                  subModuleCode="$PRODUCT_SUB_MODULE"
                  pageCode="$PRODUCT"
                  rightCode="$GET"
                >
                  <ShoppingCards />
                </PermissionWrapper>
              )}
            </div>
          </div>
        </div>
      </div>


    </>
  );
}

export default Home;
