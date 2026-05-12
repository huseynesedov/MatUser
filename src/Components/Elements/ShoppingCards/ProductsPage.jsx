import React from 'react';
import { Space, Spin } from "antd";
import CardItem from "../CardItem/index";
const ShoppingCards = ({data , loading}) => {

    const newData = data.map(item => {
        return { ...item };
    });

    return (
        <div className="container-fluid">
            <div className="row">
                {!loading ?
                    <>
                        {
                        newData.length > 0 ? newData.map(d => <CardItem classes={'col-lg-4 col-md-6'} d={d}/>) :
                            <div
                                className='d-flex flex-column align-items-center w-100 h-100 justify-content-center'>
                                <img
                                    height={'500px'}
                                    src="https://cdn.dribbble.com/users/721524/screenshots/4117132/media/6dff4135f851cd4af82839d83e00d1d6.png?resize=800x600&vertical=center"
                                    alt=""/>
                                <h4>Məhsul Tapılmadı</h4>
                            </div>

                    }

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
