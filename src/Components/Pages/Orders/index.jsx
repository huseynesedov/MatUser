import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import '@progress/kendo-theme-default/dist/all.css';
import "./style.scss";
import Images from "../../../Assets/images/js/Images";
import { CatalogApi } from "../../../api/catalog.api";
import { OrderApi } from "../../../api/order.api";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { DatePicker, Button, Row, Col, Pagination, Spin, Input } from 'antd';
import { useAuth } from "../../../AuthContext";
import PermissionWrapper from "../../Elements/PermissionWrapper/PermissionWrapper";




const statusColors = {
  '3LlDuXpKEl0=': '#48BB78', //beklemede
  'xFsQPkFTRN0=': '#FFCC00', // onaylandi
  'a1LJadsYP0o=': '#E53E3E', // Silindi
  'sEED7RZFk_I=': '#FFCC00', // Havuzda bekleyen
  'TdxqvP8RuFw=': '#E53E3E', // Havuzda birleshdirildi
};

const ProductStatus = ({ status, orderStatusName, orderStatusIdHash }) => {
  const bgColor = statusColors[orderStatusIdHash] || 'white';
  console.log(bgColor);
  const style = {
    marginBottom: '50px',
    borderRadius: '6px',
    color: 'white',
    backgroundColor: bgColor,
    width: '171px',
    textAlign: 'center',
    fontSize: '15px',
  };

  return (
    <div style={style}>
      <p style={{ margin: '0px 10px' }}>{orderStatusName}</p>
    </div>
  );
};

const Orders = () => {
  const { t } = useTranslation();
  const { roleId } = useAuth();

  const [currentPage, setCurrentPage] = useState('xFsQPkFTRN0=');
  const [pageSize, setPageSize] = useState(20);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  const [currentDataPage, setCurrentDataPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [orderStatusList, setOrderStatusList] = useState([]);
  const [count, setCount] = useState();

  const disableFromDate = (current) => {
    return toDate ? current && current > toDate : false;
  };


  const disableToDate = (current) => {
    return fromDate ? current && current < fromDate : false;
  };
  const clearFilter = () => {
    setFromDate(null)
    setToDate(null)
    setOrderNumber(null)
  }


  const getOrdersByStatus = async (value, page, filter) => {
    setLoading(true);
    let arr = [];

    if (filter) {
      if (fromDate) {
        arr.push({
          value: fromDate,
          fieldName: "createdDate",
          equalityType: "GreaterOrEqual",
        });
      }

      if (toDate) {
        arr.push({
          value: toDate,
          fieldName: "createdDate",
          equalityType: "LessOrEqual",
        });
      }

      if (orderNumber) {
        arr.push({
          value: orderNumber.trim(),
          fieldName: "orderNumber",
          equalityType: "Contains",
        });
      }
    }

    try {
      const res = await OrderApi.GetSearchTable({
        page,
        pageSize,
        filters: [
          {
            value,
            fieldName: "orderStatusIdHash",
            equalityType: "Equal",
          },
          ...arr,
        ],
      });

      setProducts(res.data); // Sayfaya veri ekleniyor
      setCount(res.count);
    } catch (error) {
      console.error("Siparişleri çekerken hata oluştu:", error);
    }
  };

  // **products değiştiğinde loading'i kapat**
  useEffect(() => {
    if (products.length > 0) {
      setLoading(false);
    }
  }, [products]);



  // it is for pagination
  const handlePageChange = (page) => {
    setCurrentDataPage(page);
    setTimeout(() => {
      getOrdersByStatus(currentPage, page - 1, true)
    })
  };



  const getOrderStatusList = () => {
    setLoading(true);
    CatalogApi.GetOrderStatusList().then((s) => {
      setOrderStatusList(s)
      clearFilter()
      getOrdersByStatus(s[0].valueHash, 0)
    }).catch((error) => {
      // if(error.response.status === 400){
      //   logout()
      // }
    }).finally(() => {
      setLoading(false)
    })
  }

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
  };

  useEffect(() => {
    getOrderStatusList()
  }, []);

  // it is for tabpanes
  const handlePageClick = (id) => {
    setCurrentPage(id);
    getOrdersByStatus(id, 0, true)
  };


  const { chrevron_right } = Images;

  return (
    <>
      <PermissionWrapper
        topModuleCode="$USER"
        subModuleCode="$ORDER_SUB_MODULE"
        pageCode="$ORDER"
        rightCode="$GET"
      >
        <div className="container-fluid d-flex justify-content-center mt-4">
          <div className="myRow align-items-start flex-column">
            <p className="text-44 f-14 d-flex fb-600">
              <Link to={`/${roleId ? roleId.toLowerCase() : ''}`}>
                <span className="text-44">
                  {t("Global.home")}
                </span>
              </Link>
              <img src={chrevron_right} alt="" />
              <p className="t-01">
                {t("Orders.view.order-name")}
              </p>
            </p>
            <div className="border-bottom-line mt-4" style={{ width: '100%' }}></div>
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

        <div className="container-fluid  mt-5">
          <div className="myRow ps-5 mt-2 ms-1 align-items-start flex-column">
            <Row gutter={16}>
              <Col>
                <DatePicker disabledDate={disableFromDate} value={fromDate} onChange={(e) => {
                  setFromDate(e)
                }} placeholder="From Date" style={{ width: 150 }} />
              </Col>
              <Col>
                <DatePicker disabledDate={disableToDate} value={toDate} onChange={(e) => {
                  setToDate(e)
                }} placeholder="To Date" style={{ width: 150 }} />
              </Col>
              <Col>
                <Input value={orderNumber} onChange={(e) => {
                  setOrderNumber(e.target.value)
                }} placeholder="Search by order number" style={{ width: 200 }} />
              </Col>
              <Col>
                <Button onClick={() => {
                  clearFilter()
                }} style={{ marginRight: 8 }}>Sil</Button>
                <Button onClick={
                  () => {
                    getOrdersByStatus(currentPage, 0, true)
                  }
                } style={{ background: '#182390' }} type="primary">Axtar</Button>
              </Col>
            </Row>
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
                      <th style={{ textAlign: "center" }}>{t("Orders.table.status")}</th>
                      <th>{t("Orders.table.record")}</th>
                      <th style={{ textAlign: "center", width: '150px' }}>{t("Orders.table.deliveriy")}</th>
                      <th style={{ textAlign: "center" }}>{t("Orders.table.explanation")}</th>
                      <th style={{ textAlign: "center" }}>{t("Orders.table.warehouse")}</th>
                      <th style={{ textAlign: "center" }}>{t("Orders.table.total")}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.map((product, i) => (
                      <tr key={product.id}>
                        <td>{product.orderNumber}</td>
                        <td>{moment(product.createdDate).format('DD-MM-YYYY HH:MM')}</td>
                        <td>{product.confirmDate}</td>
                        <td style={{ textAlign: "center" }}>
                          <ProductStatus orderStatusName={product.orderStatusName} orderStatusIdHash={product.orderStatusIdHash} />
                        </td>
                        <td style={{ textAlign: "center" }}>{product.note}</td>
                        <td style={{ textAlign: "center", width: '150px' }}>{product.shipmentNote}</td>
                        <td style={{ textAlign: "center" }}>{product.causeOfDeletion}</td>
                        <td style={{ textAlign: "center" }}>{product.storageCode}</td>
                        <td style={{ textAlign: "center" }}>{product.total} {product.currencyName}</td>
                        <PermissionWrapper
                          topModuleCode="$USER"
                          subModuleCode="$ORDER_SUB_MODULE"
                          pageCode="$ORDER_DETAIL"
                          rightCode="$GET"
                        >
                          <td className="d-flex align-items-center">
                            <Link className="text-decoration-none mb-5"
                              to={`/${roleId ? roleId.toLowerCase() : ''}/Orders/OrderDetail/${product.idHash}`}
                            >
                              <div className="view mb-5">
                                <p>{t("Orders.view.view-name")}</p>
                              </div>
                            </Link>
                          </td>
                        </PermissionWrapper>
                      </tr>
                    ))}
                  </tbody>
                </Table>


                <div className="d-flex  w-100 justify-content-center mt-4">
                  <Pagination current={currentDataPage}
                    total={count}
                    onChange={handlePageChange}
                    pageSize={pageSize}
                    onShowSizeChange={handlePageSizeChange}
                    showSizeChanger={true}
                    pageSizeOptions={['5', '10', '20', '40', '50', '100']} // Opt
                  />
                </div>
              </div>
            </div>
          </Spin>
        </div>

      </PermissionWrapper>
    </>
  )
    ;
};

export default Orders;
