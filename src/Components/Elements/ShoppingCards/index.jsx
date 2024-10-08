import React, { useState, useEffect } from 'react';
import { ProductApi } from "../../../api/product.api";
import { useAuth } from "../../../AuthContext"
import {Pagination, Space, Spin} from "antd";
import CardItem from "../CardItem";
const ShoppingCards = () => {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const { logout  , openNotification }= useAuth()

    const handlePageChange = (page) =>{
        setPage(page)
    }

    useEffect(() => {
        setLoading(true)
        ProductApi.GetBestSeller(
            {
                page: page-1,
                pageSize: 20
            }
        ).then((res) => {
            setData(res.data)
            setCount(res.count)
        }).catch((error)=>{
            if(error.response.status === 401){
                logout()
            }
            openNotification('Xəta baş verdi'  ,  error.response.data.message , true)
        }).finally(() =>{
            setLoading(false)
        })

    }, [page]);


    const newData = data.map(item => {
        return { ...item};
    });

    return (
        <div className="container-fluid mt-5">
            <div className="row">
                {!loading ?
                    <>
                        {newData.map(d => <CardItem classes={'col-lg-3 col-md-6'} d={d}/>)}
                        <div className="d-flex  w-100 justify-content-center mt-4">
                            <Pagination current={page}
                                        total={count}
                                        onChange={handlePageChange}
                                        pageSize={20}
                            />
                        </div>
                    </>
                    : <>
                        <div className={'w-100 d-flex justify-content-center'}>
                            <Space size="middle">
                                <Spin size="large"/>
                            </Space>
                        </div>
                    </>}
            </div>
        </div>
    );
};

export default ShoppingCards;
