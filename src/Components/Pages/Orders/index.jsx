import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import '@progress/kendo-theme-default/dist/all.css';
import "./style.scss";
import Images from "../../../Assets/images/js/Images";
import {CatalogApi} from "../../../api/catalog.api";
import {OrderApi} from "../../../api/order.api";
import {Pagination, Spin} from "antd"
import moment from "moment";
import { useTranslation } from "react-i18next";

const statusColors = {
  '3LlDuXpKEl0=': '#48BB78', //beklemede
  'xFsQPkFTRN0=': '#FFCC00', // onaylandi
  'a1LJadsYP0o=': '#E53E3E', // Silindi
  'sEED7RZFk_I=': '#FFCC00', // Havuzda bekleyen
  'TdxqvP8RuFw=': '#E53E3E', // Havuzda birleshdirildi
};

const ProductStatus = ({ status , orderStatusName,  orderStatusIdHash }) => {
  const bgColor = statusColors[orderStatusIdHash] || 'white';

  console.log(bgColor);
  const style = {
    marginBottom: '50px',
    borderRadius: '6px',
    color: 'white',
    backgroundColor: bgColor,
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <div style={style}>
      <p style={{ margin: '0px 10px' }}>{orderStatusName}</p>
    </div>
  );
};

const Orders = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState('xFsQPkFTRN0=');
  const [currentDataPage, setCurrentDataPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [orderStatusList, setOrderStatusList] = useState([]);
  const [count, setCount] = useState();



  const getOrdersByStatus = (value, page) =>{
      setLoading(true)
      OrderApi.GetSearchTable({
        page,
        pageSize: 2,
        filters: [
          {
            value,
            fieldName: "orderStatusIdHash",
            equalityType: "Equal"
          }
        ]
      }).then((res) => {
        console.log(res)
        setProducts(res.data)
        setCount(res.count)
      }).finally(()=>{
        setLoading(false)
      })
  }

  // it is for pagination
  const handlePageChange = (page) => {
    setCurrentDataPage(page);
    setTimeout(() => {
      getOrdersByStatus(currentPage , page-1)
    })
  };



  const getOrderStatusList = () =>{
      CatalogApi.GetOrderStatusList().then((s) =>{
        setOrderStatusList(s)
        getOrdersByStatus(s[0].valueHash, 0)
      }).finally(()=>{
        setLoading(false)
      })
  }



  useEffect(() => {
    getOrderStatusList()
  }, []);

  // it is for tabpanes
  const handlePageClick = (id) => {
    setCurrentPage(id);
    getOrdersByStatus(id ,  0)
  };

  const { chrevron_right } = Images;

  return (
      <>
      <div className="container-fluid d-flex justify-content-center mt-4">
        <div className="myRow align-items-start flex-column">
          <p className="text-44 f-14 d-flex fb-600">
            {t("Global.home")}
            <img src={chrevron_right} alt=""/>
            <p className="t-01">
              {t("Orders.view.order-name")}
            </p>
          </p>
          <div className="border-bottom-line mt-4" style={{width: '100%'}}></div>
        </div>
      </div>

      <div className="container-fluid d-flex justify-content-center mt-4">
        <div className="myRow mt-3">
          <div className="mat-TwoPage">
            {orderStatusList?.map((d, index) => {
              return <button key={d.valueHash}
                             className={`mat-ButtonInfo me-4 fb-500 ${currentPage === d.valueHash ? 'Active' : ''}`}
                             onClick={() => handlePageClick(d.valueHash)}>
                {d.displayText}
              </button>
            })}
          </div>
        </div>
      </div>


      <div className={'w-100'}>
        <Spin className={'w-100'} spinning={loading}>
          <div className="container-fluid flex-column align-items-center d-flex justify-content-center">
            <div className="myRow mt-5">
              <Table className="OrderTable">
                <thead>
                <tr>
                  <th>{t("Orders.table.number")}</th>
                  <th>{t("Orders.table.date")}</th>
                  <th>{t("Orders.table.date2")}</th>
                  <th>{t("Orders.table.status")}</th>
                  <th>{t("Orders.table.record")}</th>
                  <th>{t("Orders.table.deliveriy")}</th>
                  <th>{t("Orders.table.explanation")}</th>
                  <th>{t("Orders.table.warehouse")}</th>
                  <th>{t("Orders.table.total")}</th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                {products?.map((product, i) => (
                    <tr key={product.id}>
                      <td>{product.orderNumber}</td>
                      <td>{moment(product.createdDate).format('DD-MM-YYYY HH:MM')}</td>
                      <td>{product.confirmDate}</td>
                      <td className="d-flex">
                        <ProductStatus orderStatusName={product.orderStatusName} orderStatusIdHash={product.orderStatusIdHash}/>
                      </td>
                      <td style={{textAlign: "center"}}>{product.note}</td>
                      <td style={{textAlign: "center"}}>{product.shipmentNote}</td>
                      <td>{product.causeOfDeletion}</td>
                      <td>{product.storageCode}</td>
                      <td>{product.total} {product.currencyName}</td>
                      <td className="d-flex align-items-center">
                        <Link className="text-decoration-none mb-5" to={`/Orders/OrderDetail/${product.idHash}`}>
                          <div className="view mb-5">
                            <p>{t("Orders.view.view-name")}</p>
                          </div>
                        </Link>
                      </td>
                    </tr>
                ))}
                </tbody>
              </Table>


              <div className="d-flex  w-100 justify-content-center mt-4">
                <Pagination   current={currentDataPage}
                              total={count}
                              onChange={handlePageChange}
                              pageSize={2}
                />
              </div>
            </div>
          </div>
        </Spin>
      </div>

</>
)
  ;
};

export default Orders;
