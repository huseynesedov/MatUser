import React, { useEffect, useState } from "react";
import './listStyle.scss'; // Stil dosyanızı burada dahil edin
import { Helmet } from "react-helmet";
import Images from "../../../Assets/images/js/Images";

import ShoppingCards from "../../Elements/ShoppingCards/ProductsPage";
import { CatalogApi } from "../../../api/catalog.api";
import { ProductApi } from "../../../api/product.api";
import { useAuth } from "../../../AuthContext";
import { useSearchParams } from "react-router-dom";
import {Pagination, Tooltip} from "antd";
import Filters from "./Filters";
import PermissionWrapper from "../../Elements/PermissionWrapper/PermissionWrapper";

function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [filters, setFilters] = useState();
    const [vehicleBrands, setVehicleBrands] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [storageData, setStorageData] = useState([]);
    const [manufacturerId, setManufacturerId] = useState('');
    const [productTypeId, setProductTypeId] = useState('');
    const [productGroupData, setProductGroupData] = useState([]);
    const [productTypeData, setProductTypeData] = useState([]);
    const [productBrendData, setProductBrendData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { openNotification, logout } = useAuth()

    const [reset, setReset] = useState(false);


    const handlePageSizeChange = (current, size) => {
        setPageSize(size);
    };

    useEffect(() => {
        getProductGroupData()
    }, [manufacturerId, productTypeId]);

    useEffect(() => {
        setLoading(true)
        ProductApi.GetSearchTable(
            {
                searchText:searchParams.get('search'),
                pagingRequest:  {
                    page: page > 0 ? page - 1 : 0,
                        pageSize,
                        filters,
                }
            }
        ).then((res) => {
            setData(res.data)
            console.log(res.data)
            setCount(res.count)
        }).catch((err) => {
            if (err.response?.data.status === 2017) {
                logout()
            }
            setData([])
            openNotification('Xəta baş verdi', err.response.data.message, true)
        })
            .finally(() => {
                setLoading(false)
            })
    }, [filters, searchParams, page, pageSize]);

    const getBrendData = () => {
        CatalogApi.GetManufacturerList().then((manufacturerList) => {
            setProductBrendData(manufacturerList)
        })
    }


    const getFilterData = () => {
        CatalogApi.GetOrderTypeList().then((orderTypeList) => {
            setFilterData(orderTypeList)
        })
    }

    const getStorageData = () => {
        CatalogApi.storageGetList().then((storageList) => {
            setStorageData(storageList)
        })
    }

    const getProductTypeData = () => {
        CatalogApi.GetProductTypeList().then((productTypeList) => {
            setProductTypeData(productTypeList)
        })
    }

    const getVehicleBrandData = () => {
        CatalogApi.GetVehicleBrandListAsync().then((vehicleBrands) => {
            setVehicleBrands(vehicleBrands)
        })
    }
    const getProductGroupData = () => {
        if (!manufacturerId && productTypeId) {
            CatalogApi.GetProductGroupListByProductType({
                typeId: productTypeId,
            }).then(res => {
                setProductGroupData(res)
            })
        }
        else if (manufacturerId && productTypeId) {
            CatalogApi.GetProductGroupList({
                typeId: productTypeId,
                manufacturerId
            }).then(res => {
                setProductGroupData(res)
            })
        }
    }

    const handlePageChange = (page) => {
        setPage(page)
    }

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    useEffect(() => {
        getBrendData()
        getFilterData()
        getStorageData()
        getProductTypeData()
        getVehicleBrandData()
    }, [reset]);


    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>MAT Software - Filter</title>
            </Helmet>


            <div className="container-fluid mt-5">
                <div className="myRow w-100 flex-nowrap align-items-start mt-5 d-flex justify-content-between">
                    <div className="myContainer2 rounded">

                        <Filters
                            filterData={filterData}
                            setManufacturerId={setManufacturerId}
                            setProductTypeId={setProductTypeId}
                            onFilterChange={handleFilterChange}
                            storageData={storageData}
                            productTypeData={productTypeData}
                            productBrendData={productBrendData}
                            vehicleBrands={vehicleBrands}
                            productGroupData={productGroupData}
                        />


                    </div>

                    <div className="myContainer1 rounded">
                        <div className="">
                            <PermissionWrapper
                                topModuleCode="$USER"
                                subModuleCode="$PRODUCT_SUB_MODULE"
                                pageCode="$PRODUCT"
                                rightCode="$GET"
                            >
                                <ShoppingCards loading={loading} data={data} reset={reset} setReset={setReset}/>
                            </PermissionWrapper>
                        </div>
                        <div className="d-flex w-100 justify-content-center my-4">
                            <Pagination current={page}
                                        total={count}
                                        pageSize={pageSize}
                                        onShowSizeChange={handlePageSizeChange}
                                        onChange={handlePageChange}
                                        showSizeChanger={true}
                                        pageSizeOptions={['21', '40', '50', '100']} // Options for page size
                            />
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Home;
