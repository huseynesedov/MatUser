import React, { useState, useEffect } from 'react';
import { ProductApi } from "../../../api/product.api";
import { useAuth } from "../../../AuthContext"
import { Skeleton, Row, Col } from "antd";
import CardItem from "../CardItem/index";

const ShoppingCards = ({ detailedId }) => {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const { logout, openNotification } = useAuth();

    useEffect(() => {
        setLoading(true);
        const fetchData = detailedId 
            ? ProductApi.GetProductGroupsById({ id: detailedId })
            : ProductApi.GetBestSeller({ page: page - 1, pageSize: 20 });

        fetchData.then((res) => {
            const responseData = detailedId ? res : res.data;
            setData(responseData);
            setCount(detailedId ? res.length : res.count);
        }).catch((error) => {
            if (error.response.data.status === 2017) logout();
            openNotification('Xəta baş verdi', error.response.data.message, true);
        }).finally(() => {
            setLoading(false);
        });
    }, [detailedId, page]);

    return (
        <div className="container-fluid mt-5">
            <Row gutter={[16, 16]}>
                {loading 
                    ? Array.from({ length: 8 }).map((_, idx) => (
                        <Col key={idx} xs={24} sm={12} lg={6}>
                            <Skeleton active avatar paragraph={{ rows: 4 }} />
                        </Col>
                    ))
                    : data.map((d, idx) => (
                        <Col key={idx} xs={24} sm={12} lg={6}>
                            <CardItem d={d} />
                        </Col>
                    ))
                }
            </Row>
        </div>
    );
};

export default ShoppingCards;
