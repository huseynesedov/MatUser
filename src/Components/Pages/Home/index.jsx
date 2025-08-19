import React, { useEffect, useState } from "react";
import ShoppingCards from "../../Elements/ShoppingCards/index";
import ShoppingGridCards from "../../Elements/ShoppingCards/gridMain";
import { useTranslation } from "react-i18next";
import './home.css'
import { Helmet } from "react-helmet";
import images from "../../../Assets/images/js/Images";
import PermissionWrapper from "../../Elements/PermissionWrapper/PermissionWrapper";
import Images from "../../../Assets/images/js/Images";
import { useAuth } from "../../../AuthContext";
import { ProductApi } from "../../../api/product.api";
import { Link } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

function Home({ detailedId }) {
  let { foodg, elba } = images
  const { t } = useTranslation();
  const { logout, openNotification, salesmanPage } = useAuth();

  const [isGridTwo, setIsGridTwo] = useState(false);
  const toggleGrid = () => {
    setIsGridTwo((prev) => !prev);
  };


  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    setLoading(true)
    if (detailedId) {
      ProductApi.GetProductGroupsById({
        id: detailedId
      }).then((res) => {
        setData(res)
        setCount(res.length)
      }).catch((error) => {
        if (error.response.data.status === 2017) {
          logout()
        }
        openNotification('Xəta baş verdi', error.response.data.message, true)
      }).finally(() => {
        setLoading(false)
      })
    }
    else {
      ProductApi.GetBestSeller(
        {
          page: page - 1,
          pageSize: 20
        }
      ).then((res) => {
        setData(res.data)
        setCount(res.count)
      }).catch((error) => {
        if (error.response.data.status === 2017) {
          logout()
        }
        openNotification('Xəta baş verdi', error.response.data.message, true)
      }).finally(() => {
        setLoading(false)
      })
    }


  }, [page]);


  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>MAT Software - Home</title>
      </Helmet>


      <div className="Container h-100">
        <div className="myRow line">
          <div className="w-100">
            {localStorage.getItem("role") === "$Salesman" && (
              <Link to="/salesman" className="glasBar mt-3 gap-2 d-inline-flex" onClick={salesmanPage}>
                <FaArrowLeftLong />
                <p className="myTitle">Geri Qayıt</p>
              </Link>
            )}


          </div>
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
                  <ShoppingGridCards
                    data={data}
                    count={count}
                    page={page}
                    loading={loading}
                  />
                </PermissionWrapper>
              ) : (
                /* Grid 1 */
                <PermissionWrapper
                  topModuleCode="$USER"
                  subModuleCode="$PRODUCT_SUB_MODULE"
                  pageCode="$PRODUCT"
                  rightCode="$GET"
                >
                  <ShoppingCards
                    data={data}
                    count={count}
                    page={page}
                    loading={loading}
                  />
                </PermissionWrapper>
              )}
            </div>
          </div>
        </div >
      </div >


    </>
  );
}

export default Home;
