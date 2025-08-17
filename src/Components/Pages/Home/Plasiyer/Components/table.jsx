import { useState, useEffect } from "react";
import { Pagination, Table } from "antd";
import { BaseApi } from "../../../../../const/api";

const UserListTable = ({ selectedCity, selectedRegion, searchText }) => {
  const [loading, setLoading] = useState(false);


  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);

  const getOrdersByStatus = (page, filter = false) => {
    if (!selectedCity && !selectedRegion && !searchText) return;

    setLoading(true);

    let filters = [];

    if (filter) {
      if (selectedCity) {
        filters.push({ value: selectedCity, fieldName: "cityIdHash", equalityType: "Equal" });
      }
      if (selectedRegion && selectedRegion !== "0") {
        filters.push({ value: selectedRegion, fieldName: "DistrictIdHash", equalityType: "Equal" });
      }
    }

    BaseApi.post("/admin/v1/Salesman/GetCustomerListBySalesman", {
      searchText,
      pagingRequest: { page, pageSize, filters },
    })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setData(
            res.data.map((item, index) => ({
              key: index + 1 + (page - 1) * pageSize,
              idHash: item.idHash || "-",
              code: item.code || "-",
              title: item.companyName || "-",
              city: item.cityName || " ",
              telephone: item.mobileNumber || " ",
            }))
          );
          setCount(res.count);
        }
      })
      .catch((error) => console.error("Error fetching orders:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getOrdersByStatus(currentPage - 1, true);
  }, [selectedCity, selectedRegion, searchText, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const createUniqueFilters = (data, key) =>
    [...new Set(data.map((item) => item[key]))].map((value) => ({ text: value, value }));

  const columns = [
    {
      title: "Kod",
      dataIndex: "code",
      key: "code",
      filters: createUniqueFilters(data, "code"),
      onFilter: (value, record) => record.code === value,
    },
    {
      title: "Başlıq",
      dataIndex: "title",
      key: "title",
      filters: createUniqueFilters(data, "title"),
      onFilter: (value, record) => record.title === value,
    },
    {
      title: "Şəhər",
      dataIndex: "city",
      key: "city",
      filters: createUniqueFilters(data, "city"),
      onFilter: (value, record) => record.city === value,
    },
    {
      title: "Telefon",
      dataIndex: "telephone",
      key: "telephone",
      filters: createUniqueFilters(data, "telephone"),
      onFilter: (value, record) => record.telephone === value,
    },
    {
      title: "",
      dataIndex: "idHash",
      key: "idHash",
      render: (_, record) => <button onClick={() => handleVisit(record)} value={record.idHash}>Ziyarət et</button>,
    },
    {
      title: "",
      dataIndex: "delivery",
      key: "delivery",
      render: (_, record) => <button onClick={() => handleDelivery(record)}>Çatdırılma</button>,
    },
    {
      title: "",
      dataIndex: "cash",
      key: "cash",
      render: (_, record) => <button onClick={() => handleCash(record)}>Nağd Ödəniş</button>,
    },
  ];

  const handleVisit = async (record) => {
    try {
      setLoading(true);

      const currentRefreshToken = localStorage.getItem('refreshToken');
      if (!currentRefreshToken) throw new Error("Oturum yenileme token'ı yok.");

      const payload = {
        refreshTokenRequest: { refreshToken: currentRefreshToken },
        customerIdHash: record.idHash,
      };

      const response = await BaseApi.post('/account/v1/Account/SalesmanChooseCustomer', payload);

      console.log(response);
      
      const { accessToken, refreshToken } = response;

      localStorage.setItem('roleId', 'customer');
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);


        window.location.href = '/customer/';


    } catch (error) {
      console.error("Impersonate error:", error);
    } finally {
      setLoading(false);
    }
  };




  const handleDelivery = (record) => console.log("Delivery:", record);
  const handleCash = (record) => console.log("Cash:", record);

  return (
    <>
      <Table columns={columns} dataSource={data} pagination={false} loading={loading} />
      <div className="d-flex w-100 justify-content-center mt-4">
        <Pagination
          current={currentPage}
          total={count}
          onChange={handlePageChange}
          pageSize={pageSize}
          onShowSizeChange={handlePageSizeChange}
          showSizeChanger={true}
          pageSizeOptions={['5', '10', '20', '40', '50', '100']}
        />
      </div>
    </>
  );
};

export default UserListTable;
