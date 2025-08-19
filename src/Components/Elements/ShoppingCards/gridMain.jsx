import React, { useState, useEffect } from 'react';
import { ProductApi } from "../../../api/product.api";
import { useAuth } from "../../../AuthContext"
import { Col, Skeleton, Space, Spin } from "antd";
import GridCard from "../CardItem/grid";

const ShoppingGridCards = ({ detailedId }) => {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const { logout, openNotification } = useAuth()


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

    console.log("dataaaa", data);


    const newData = data.map(item => {
        return { ...item };
    });


    return (
        <div className="container-fluid mt-5">
            <div className="row">
                {loading ?
                    Array.from({ length: 8 }).map((_, idx) => (
                        <Skeleton active paragraph={{ rows: 4 }} />
                    ))
                    :
                    <>
                        <div className='d-flex'>
                            <GridCard key={data.idHash} classes={'col-lg-3 col-md-6'} data={data} />
                        </div>

                    </>
                }
            </div>
        </div>
    );
};

export default ShoppingGridCards;
