import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Pagination, Spin, DatePicker, Button, Row, Col, Input } from "antd";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { CatalogApi } from "../../../api/catalog.api";
import { OrderApi } from "../../../api/order.api";
import PermissionWrapper from "../../Elements/PermissionWrapper/PermissionWrapper";
import Images from "../../../Assets/images/js/Images";

const statusColors = {
  '3LlDuXpKEl0=': '#48BB78',
  'xFsQPkFTRN0=': '#FFCC00',
  'a1LJadsYP0o=': '#E53E3E',
  'sEED7RZFk_I=': '#FFCC00',
  'TdxqvP8RuFw=': '#E53E3E',
};

const ProductStatus = ({ orderStatusName, orderStatusIdHash }) => {
  const bgColor = statusColors[orderStatusIdHash] || 'white';
  return (
    <div style={{
      borderRadius: '6px',
      color: 'white',
      backgroundColor: bgColor,
      width: '171px',
      textAlign: 'center',
      fontSize: '15px',
      display: 'inline-block',  // içeriğe göre genişlesin
      padding: '5px 10px',      // boşluk ekle
    }}>
      <p style={{ margin: '0px 10px' }}>{orderStatusName}</p>
    </div>
  );
};

const Orders = () => {
  const { t } = useTranslation();
  const roleId = localStorage.getItem('roleId');

  const [currentPage, setCurrentPage] = useState('xFsQPkFTRN0=');
  const [pageSize, setPageSize] = useState(20);
  const [currentDataPage, setCurrentDataPage] = useState(1);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [orderNumber, setOrderNumber] = useState('');

  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingOrderStatus, setLoadingOrderStatus] = useState(false);
  const [products, setProducts] = useState([]);
  const [orderStatusList, setOrderStatusList] = useState([]);
  const [count, setCount] = useState(0);

  const disableFromDate = (current) => toDate ? current > toDate : false;
  const disableToDate = (current) => fromDate ? current < fromDate : false;

  const clearFilter = () => {
    setFromDate(null);
    setToDate(null);
    setOrderNumber('');
  };

  const getOrdersByStatus = async (statusId, page = 0, filter = false) => {
    setLoadingOrders(true);
    let filters = [];

    if (filter) {
      if (fromDate) filters.push({ value: fromDate, fieldName: "createdDate", equalityType: "GreaterOrEqual" });
      if (toDate) filters.push({ value: toDate, fieldName: "createdDate", equalityType: "LessOrEqual" });
      if (orderNumber) filters.push({ value: orderNumber.trim(), fieldName: "orderNumber", equalityType: "Contains" });
    }

    try {
      const res = await OrderApi.GetSearchTable({
        page,
        pageSize,
        filters: [{ value: statusId, fieldName: "orderStatusIdHash", equalityType: "Equal" }, ...filters],
      });
      setProducts(res.data);
      setCount(res.count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentDataPage(page);
    getOrdersByStatus(currentPage, page - 1, true);
  };

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
  };

  const handlePageClick = (id) => {
    setCurrentPage(id);
    getOrdersByStatus(id, 0, true);
  };

  const getOrderStatusList = async () => {
    setLoadingOrderStatus(true);
    try {
      const s = await CatalogApi.GetOrderStatusList();
      setOrderStatusList(s);
      clearFilter();
      getOrdersByStatus(s[0].valueHash, 0);
    } finally {
      setLoadingOrderStatus(false);
    }
  };

  useEffect(() => { getOrderStatusList(); }, []);

  const columns = [
    { title: t("Orders.table.number"), dataIndex: "orderNumber", key: "orderNumber" },
    { title: t("Orders.table.date"), dataIndex: "createdDate", key: "createdDate", render: (d) => moment(d).format('DD-MM-YYYY HH:mm') },
    { title: t("Orders.table.date2"), dataIndex: "confirmDate", key: "confirmDate" },
    { title: t("Orders.table.status"), dataIndex: "orderStatusName", key: "status", align: "center", render: (_, record) => <ProductStatus {...record} /> },
    { title: t("Orders.table.record"), dataIndex: "note", key: "note", align: "center" },
    { title: t("Orders.table.deliveriy"), dataIndex: "shipmentNote", key: "shipmentNote", align: "center", width: 150 },
    { title: t("Orders.table.explanation"), dataIndex: "causeOfDeletion", key: "causeOfDeletion", align: "center" },
    { title: t("Orders.table.warehouse"), dataIndex: "storageCode", key: "storageCode", align: "center" },
    { title: t("Orders.table.total"), key: "total", align: "center", render: (_, record) => `${record.total} ${record.currencyName}` },
    {
      title: "", key: "action", align: "center",
      render: (_, record) => (
        <PermissionWrapper topModuleCode="$USER" subModuleCode="$ORDER_SUB_MODULE" pageCode="$ORDER_DETAIL" rightCode="$GET">
          <Link to={`/${roleId ? roleId.toLowerCase() : ''}/Orders/OrderDetail/${record.idHash}`}>
            <div className="view"><p>{t("Orders.view.view-name")}</p></div>
          </Link>
        </PermissionWrapper>
      )
    }
  ];

  const { chrevron_right } = Images;

  return (
    <>

      <PermissionWrapper topModuleCode="$USER" subModuleCode="$ORDER_SUB_MODULE" pageCode="$ORDER" rightCode="$GET">

        <div className="container-fluid d-flex justify-content-center mt-4">
          <div className="myRow align-items-start flex-column">
            <p className="text-44 f-14 d-flex fb-600">
              <Link to={`/${roleId ? roleId.toLowerCase() : ''}`}>{t("Global.home")}</Link>
              <img src={chrevron_right} alt="" />
              <span className="t-01">{t("Orders.view.order-name")}</span>
            </p>
            <div className="border-bottom-line mt-4" style={{ width: '100%' }}></div>
          </div>
        </div>

        <Spin spinning={loadingOrderStatus}>
          <div className="container-fluid d-flex justify-content-center mt-4">
            <div className="myRow mt-3">
              <div className="mat-TwoPage">
                {orderStatusList?.map(d => (
                  <button key={d.valueHash}
                    className={`mat-ButtonInfo me-4 fb-500 ${currentPage === d.valueHash ? 'Active' : ''}`}
                    onClick={() => handlePageClick(d.valueHash)}>
                    {d.displayText}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Spin>

        <div className="container-fluid d-flex justify-content-center mt-5">
          <div className="myRow mt-3">
            <Row gutter={16} className="mb-3">
              <Col><DatePicker disabledDate={disableFromDate} value={fromDate} onChange={setFromDate} placeholder="From Date" style={{ width: 150 }} /></Col>
              <Col><DatePicker disabledDate={disableToDate} value={toDate} onChange={setToDate} placeholder="To Date" style={{ width: 150 }} /></Col>
              <Col><Input value={orderNumber} onChange={e => setOrderNumber(e.target.value)} placeholder="Search by order number" style={{ width: 200 }} /></Col>
              <Col>
                <Button onClick={clearFilter} style={{ marginRight: 8 }}>Sil</Button>
                <Button type="primary" style={{ background: '#182390' }} onClick={() => getOrdersByStatus(currentPage, 0, true)}>Axtar</Button>
              </Col>
            </Row>

          </div>
        </div>

        <Spin spinning={loadingOrders}>
          <div className="container-fluid d-flex justify-content-center">
            <div className="myRow mt-3">
              <Table
                columns={columns}
                dataSource={products}
                rowKey="id"
                pagination={false}
                scroll={{ x: 'max-content' }}
              />
            </div>
          </div>
        </Spin>

        <div className="d-flex w-100 justify-content-center mt-4">
          <Pagination
            current={currentDataPage}
            total={count}
            onChange={handlePageChange}
            pageSize={pageSize}
            onShowSizeChange={handlePageSizeChange}
            showSizeChanger
            pageSizeOptions={['5', '10', '20', '40', '50', '100']}
          />
        </div>

      </PermissionWrapper>

    </>
  );
};

export default Orders;
