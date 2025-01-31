import React, { useEffect, useState } from 'react';
import {Button, Select, Typography, Input, Spin, Table, Space, Tooltip} from 'antd';
import {DeleteOutlined, PlusOutlined, MinusOutlined, CheckCircleOutlined, EditFilled} from "@ant-design/icons";
import { useAuth } from "../../../AuthContext";
import { BasketApi } from "../../../api/basket.api";
import PermissionWrapper from "../PermissionWrapper/PermissionWrapper";

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ReturnItems = ({ totalPrice ,returnItems, getReturnItems, getTotalPrice, setReturnItems, returnItemStatus }) => {
    const { openNotification } = useAuth();
    const [loading, setLoading] = useState(false);
    const [returnNote, setReturnNote] = useState('');
    const [error, setError] = useState(false);

    const handleChange = (e) => {
        setReturnNote(e.target.value);
        if (e.target.value.trim() === '') {
            setError(true);
        } else {
            setError(false);
        }
    };


    const renderStatusName = (id) =>{
        console.log()
        return returnItemStatus.find(s => s.valueHash === id)?.displayText
    }


    const sendReturn = () => {
        if (returnNote.trim() === ''){
            setError(true);
            return;
        }
        setLoading(true);
        BasketApi.AddReturnProduct(returnNote).then(()=>{
            openNotification('Uğurlu əməliyyat', `Məhsul göndərildi`, false);
            getReturnItems();
            getTotalPrice();
        }).catch((err) => openNotification('Xəta baş verdi', err.response.data.message, true))
            .finally(() => setLoading(false));
    }

    const handleDelete = (id) => {
        setLoading(true);
        BasketApi.DeleteReturnProductById(encodeURIComponent(id))
            .then(() => {
                openNotification('Uğurlu əməliyyat', `Məhsul silindi`, false);
                getReturnItems();
                getTotalPrice();
            })
            .catch((err) => openNotification('Xəta baş verdi', err.response.data.message, true))
            .finally(() => setLoading(false));
    };

    function encodeQueryParam(param) {
        return encodeURIComponent(param);
    }

    const handleQuantityUpdate = (productId, quantity, increment) => {
        const newQuantity = increment ? quantity + 1 : Math.max(quantity - 1, 0);
        if (newQuantity === quantity) return;
        setLoading(true);
        BasketApi.UpdateReturnProductQuantity(encodeQueryParam(productId), newQuantity)
            .then(() => {
                getReturnItems();
                getTotalPrice();
            })
            .catch((err) => openNotification('Xəta baş verdi', err?.response?.data?.message, true))
            .finally(() => setLoading(false));
    };


    const saveDataInputData = (d , record) =>{
        setLoading(true)
        BasketApi.UpdateReturnProductNote(record.idHash , d).then(() =>  {
            openNotification('Uğurla yeniləndi')
            getTotalPrice()
            getReturnItems()
        }).catch((err) => openNotification('Xəta baş verdi', err?.response?.data?.Message, true))
            .finally(() => setLoading(false));
    }



    const columns = [
        {
            title: 'Qaimə nömrəsi',
            dataIndex: 'invoiceNumber',
            key: 'invoiceNumber',
        },
        {
            title: 'Kod',
            dataIndex: 'productCode',
            key: 'productCode',
        },
        {
            title: 'Ad',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Brend',
            dataIndex: 'manufacturerName',
            key: 'manufacturerName',
        },
        {
            title: 'İstehsalçı kodu',
            dataIndex: 'manufacturerCode',
            key: 'manufacturerCode',
        },
        {
            title: 'Say',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text, record) => (
                <Space>
                    <PermissionWrapper
                        topModuleCode="$USER"
                        subModuleCode="$BASKET_SUB_MODULE"
                        pageCode="$RETURN_PRODUCT_CARD_DETAIL"
                        rightCode="$PUT"
                    >
                        <Button icon={<MinusOutlined />} onClick={() => handleQuantityUpdate(record.idHash, record.quantity, false)} />
                    </PermissionWrapper>
                    <Input value={record.quantity} readOnly style={{ width: '40px', textAlign: 'center' }} />
                    <PermissionWrapper
                        topModuleCode="$USER"
                        subModuleCode="$BASKET_SUB_MODULE"
                        pageCode="$RETURN_PRODUCT_CARD_DETAIL"
                        rightCode="$PUT"
                    >
                        <Button icon={<PlusOutlined />} onClick={() => handleQuantityUpdate(record.idHash, record.quantity, true)} />
                    </PermissionWrapper>
                </Space>
            ),
        },
        {
            title: 'Qeyd',
            dataIndex: 'note',
            key: 'note',
            render: (text, record) => {
                let data;
                return <div className={'d-flex'}>
                    <Input onChange={(e)=>{
                        data = e.target.value;
                    }} placeholder="Enter Note..." defaultValue={record.note}/>
                    <PermissionWrapper
                        topModuleCode="$USER"
                        subModuleCode="$BASKET_SUB_MODULE"
                        pageCode="$RETURN_PRODUCT_CARD_DETAIL"
                        rightCode="$PUT"
                    >
                        <Tooltip placement={'top'} title={'Yenilə'}>
                            <Button onClick={() => {
                                saveDataInputData(data , record);
                            }} className={'d-flex ms-1 justify-content-center align-items-center'}>
                                <EditFilled/>
                            </Button>
                        </Tooltip>
                    </PermissionWrapper>
                </div>

            }
        },
        {
            title: 'Qaytarış növü',
            dataIndex: 'returnProductDetailStatusIdHash',
            key: 'returnProductDetailStatusIdHash',
            render: (text, record) => (
                <>
                    {renderStatusName(text)}
                </>
            ),
        },
        {
            title: 'Dəyər',
            dataIndex: 'formattedPrice',
            key: 'formattedPrice',
        },
        {
            title: 'Ümumi Dəyər',
            dataIndex: 'formattedTotalPrice',
            key: 'formattedTotalPrice',
        },
        {
            title: 'Net Price With VAT',
            dataIndex: 'formattedTotalVAT',
            key: 'formattedTotalVAT',
        },
        {
            title: 'Əməliyyat',
            key: 'action',
            render: (_, record) => (
                <PermissionWrapper
                    topModuleCode="$USER"
                    subModuleCode="$BASKET_SUB_MODULE"
                    pageCode="$RETURN_PRODUCT_CARD_DETAIL"
                    rightCode="$DELETE"
                >
                  <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.idHash)} />
                </PermissionWrapper>
            ),
        },
    ];

    return (
        <PermissionWrapper
            topModuleCode="$USER"
            subModuleCode="$BASKET_SUB_MODULE"
            pageCode="$RETURN_PRODUCT_CARD_DETAIL"
            rightCode="$GET"
        >
           <Spin spinning={loading}>
            <div className="return-items-container">
                <Table
                    dataSource={returnItems}
                    columns={columns}
                    rowKey="idHash"
                    pagination={false}
                />
                <div className="summary-section">
                    <div className="return-reason">
                        <h3>Qaytarış səbəbi</h3>
                        <TextArea
                            rows={4}
                            placeholder="Qaytarma Qeydini daxil edin..."
                            value={returnNote}
                            onChange={handleChange}
                            status={error ? 'error' : ''}
                        />
                        {error && (
                            <Text type="danger">
                                Qeyd tələb olunur.
                            </Text>
                        )}
                    </div>
                    <div className="total-section border px-4 py-3">
                        <p>Ümumi Say:{totalPrice.productTotalQuantity} </p>
                        <p className={'mt-2'}>Ümumi Dəyər:{totalPrice.formattedTotalPrice} </p>
                        <PermissionWrapper
                            topModuleCode="$USER"
                            subModuleCode="$BASKET_SUB_MODULE"
                            pageCode="$RETURN_PRODUCT_CARD_DETAIL"
                            rightCode="$POST"
                        >
                            <Button onClick={()=>{
                                sendReturn()
                            }} style={{background:"#182390"}} className={'mt-4'} type="primary" icon={<CheckCircleOutlined />}>Göndər</Button>
                        </PermissionWrapper>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .return-items-container {
                    background-color: #fff;
                    border-radius: 8px;
                    width: 100%;
                }
                .summary-section {
                    display: flex;
                    justify-content: space-between;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                    margin-top: 20px;
                }
                .total-section {
                    text-align: right;
                }
                .return-reason {
                    width: 50%;
                }
            `}</style>
        </Spin>
        </PermissionWrapper>
    );
};

export default ReturnItems;
