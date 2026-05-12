import React, { useState, useEffect } from 'react';
import { ProductApi } from "../../../api/product.api";
import { useAuth } from "../../../AuthContext"
import { Skeleton } from "antd";
import GridCard from "../CardItem/grid";

const ShoppingGridCards = ({ detailedId }) => {
    const [data, setData] = useState([]);
    const [page] = useState(1);
    const [loading, setLoading] = useState(false);

    const { logout, openNotification } = useAuth()


    useEffect(() => {
        setLoading(true)
        if (detailedId) {
            ProductApi.GetProductGroupsById({
                id: detailedId
            }).then((res) => {
                setData(res)
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
            }).catch((error) => {
                if (error.response.data.status === 2017) {
                    logout()
                }
                openNotification('Xəta baş verdi', error.response.data.message, true)
            }).finally(() => {
                setLoading(false)
            })
        }


    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch when page or detailedId changes; stable API fns
    }, [page, detailedId]);

    return (
        <div className="container-fluid mt-5">
            <div className="row">
                {loading ?
                    Array.from({ length: 8 }).map((_, idx) => (
                        <Skeleton key={idx} active paragraph={{ rows: 4 }} />
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
