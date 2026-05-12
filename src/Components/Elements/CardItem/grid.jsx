import React, { useEffect, useState } from 'react';

import { useMediaQuery } from "react-responsive";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import moment from "moment";

import { Option } from 'antd/es/mentions';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, InputNumber, Spin, Table, Modal, Select, List, Tooltip, notification } from 'antd';


import { BasketApi } from '../../../api/basket.api';
import { useAuth } from '../../../AuthContext';

import PermissionWrapper from '../PermissionWrapper/PermissionWrapper';
import Images from '../../../Assets/images/js/Images';
import { callBasketApi } from '../../../utils/basketService';

const GridCard = ({ data }) => {
    const navigate = useNavigate();

    const { t } = useTranslation();
    const [quantityMap, setQuantityMap] = useState(data.minOrderAmount || 1);
    const [isReturnModalVisible, setIsReturnModalVisible] = useState(false);
    const [loading, setLoading] = useState({});
    const [responseData, setResponseData] = useState([]);
    const { openNotification, updateReturnData, returnData } = useAuth();
    const [isModelModalVisible, setIsModelModalVisible] = useState(false);
    const [selectedModel, setSelectedModel] = useState(null);

    const roleId = localStorage.getItem('roleId');

    const handleRowClick = (record) => {
        navigate(`/${roleId}/detail/${record.idHash}`);
    };






    useEffect(() => {
        if (data && Array.isArray(data)) {
            const initialQuantities = data.reduce((acc, item) => {
                acc[item.idHash] = item.minOrderAmount || 1;
                return acc;
            }, {});

            console.log("Initial Quantities:", initialQuantities); // Kontrol için log ekleyelim
            setQuantityMap(initialQuantities);
        }
    }, [data]);



    const handleAddToCart = async (product) => {
        setLoading(true);

        try {
            await callBasketApi('AddToBasket', {
                productId: product.idHash,
                quantity: quantityMap[product.idHash] || 1,
            });

            openNotification('Əlavə edildi', `${product.name} səbətə əlavə edildi`, false);
        } catch (err) {
            openNotification('Xəta baş verdi', err.response?.data?.message || 'Server xətası', true);
        } finally {
            setTimeout(() => setLoading(false), 0);
        }
    };



    const handleTableQuantityChange = (value, record) => {
        const updatedData = responseData.map(item => {
            if (item.invoiceNumber === record.invoiceNumber) {
                console.log(value);
                console.log(item.price);
                const newTotalPrice = value * item.price;
                return { ...item, returnQuantity: value, totalPrice: newTotalPrice };
            }
            return item;
        });
        setResponseData(updatedData);
    };




    const handleAddReturnProductCard = (text, record) => {
        setLoading(true);
        BasketApi.AddReturnProductCard({ ...record })
            .then((res) => {
                openNotification('Əlavə edildi', 'Məhsul kartı geri bildirməyə əlavə edildi', false);
                setIsReturnModalVisible(false);
                updateReturnData(res)
                setTimeout(() => {
                    navigate('/return')
                })
            })
            .catch((error) => {
                console.error('error', error)
                openNotification('Xəta baş verdi', error.response?.data?.message, true);
            })
            .finally(() => {
                setLoading(false);
            });
    };


    const showReturnModal = (product) => {
        setIsReturnModalVisible(true);
        setLoading(true);

        BasketApi.ReturnProduct({ productIdHash: product.idHash })
            .then((response) => {
                setResponseData(response.map((r, index) => ({
                    ...r,
                    index: index + 1,
                    returnQuantity: r.quantity
                })));
            })
            .catch((error) => {
                openNotification('Xəta baş verdi', error.response?.data?.message || 'Server xətası', true);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const columns = [
        { title: '', dataIndex: 'index', key: 'index' },
        { title: 'Product Name', dataIndex: 'productName', key: 'productName' },
        { title: 'Product Code', dataIndex: 'productCode', key: 'productCode' },
        { title: 'Invoice Number', dataIndex: 'invoiceNumber', key: 'invoiceNumber' },
        {
            title: 'Invoice Date', dataIndex: 'invoiceDate', key: 'invoiceDate',
            render: (text, record) => (
                <>{moment(text).format('DD.MM.YYYY HH:MM')}</>
            ),
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Return Quantity',
            dataIndex: 'returnQuantity',
            key: 'returnQuantity',
            render: (text, record) => (
                <InputNumber
                    min={1}
                    value={record.returnQuantity}
                    onChange={(value) => handleTableQuantityChange(value, record)}
                />
            ),
        },
        {
            title: 'Price', dataIndex: 'price', key: 'price',
            render: (text, record) => (
                <>{text} azn</>
            ),
        },
        { title: 'Total Price', dataIndex: 'totalPrice', key: 'totalPrice' },
        {
            title: '', dataIndex: 'productIdHash', key: 'productIdHash',
            render: (text, record) => (

                <PermissionWrapper
                    topModuleCode="$USER"
                    subModuleCode="$BASKET_SUB_MODULE"
                    pageCode="$RETURN_PRODUCT_CARD"
                    rightCode="$POST"
                >
                    <Button key="submit" type="primary" loading={loading} onClick={() => {
                        handleAddReturnProductCard(text, record)
                    }}>
                        Səbətə At
                    </Button>
                </PermissionWrapper>
            ),
        },
    ];





    const columnss = [
        {
            title: 'Məhsul kodu', dataIndex: 'code', key: 'code',
            render: (_, record) => (
                <>
                    {record.price?.formattedDiscountPrice > 0 && (
                        <div className="position-absolute" style={{ left: "-6px", top: "-25px", transform: "rotate(37deg)" }}>
                            <img src={Images.Endirim} alt="Discount" />
                            <p className="text-white position-absolute discount">{record.price?.discountRate} endirim</p>
                        </div>
                    )}
                    <p>{record.code}</p>
                </>
            )
        },
        {
            title: 'Məhsul adı və brendi',
            key: 'name',
            render: (_, record) => (
                <>
                    <p>{record.name}</p>
                    <p>{record.description}</p>
                </>
            )
        }
        ,
        { title: 'OEM No', dataIndex: 'oemCode', key: 'oemCode' },
        { title: 'Marka', dataIndex: 'manufacturerName', key: 'manufacturerName' },
        {
            title: 'Model', dataIndex: 'model', key: 'model',
            render: (_, record) => (
                <>
                    <div className='infoBlock' style={{ fontSize: "20px" }}>
                        <Tooltip
                            onClick={(e) => {
                                e.stopPropagation(); // Satırın tıklama event'ini durdur
                                const models = record?.vehicleModels?.map(model => model?.vehicleModelIdName);
                                setSelectedModel(models);
                                setIsModelModalVisible(true);
                            }}
                            placement="topRight"
                            title="Models"
                            className='infoBlock2'
                        >
                            <InfoCircleOutlined className="text-dark infoBlock2 ms-2" />
                        </Tooltip>
                    </div>
                </>
            )

        },
        {
            title: 'Sayı', dataIndex: 'number', key: 'number',
            render: (_, record) => (
                <div className="counterCenter">
                    <button
                        className="del"
                        onClick={() => setQuantityMap(prev => {
                            const currentValue = prev[record.idHash] || record.number;

                            if (currentValue === 1) {
                                openNotification('Xəta', `Minimal sifariş sayı ${record.minOrderAmount} olmalıdır.`, false);
                                return prev; // Eğer 1 ise, state'i değiştirme
                            }

                            return { ...prev, [record.idHash]: currentValue - 1 };
                        })}
                    >
                        -
                    </button>

                    <input
                        value={quantityMap[record.idHash] ?? record.number}
                        onChange={(e) => {
                            let value = e.target.value.replace(/[^0-9]/g, ''); // Sadece rakamları al
                            value = value === '' ? '' : Math.max(Number(value), 1); // Boş bırakılabilir, min 1

                            if (value === '') {
                                value = '1'; // Boşsa 1 yap
                            } else {
                                value = Math.max(Number(value), 1); // Min 1 olsun
                            }




                            setQuantityMap(prev => ({
                                ...prev,
                                [record.idHash]: value
                            }));
                        }}
                        className="counter mx-3"
                    />

                    <button
                        className="plus"
                        onClick={() => setQuantityMap(prev => ({
                            ...prev,
                            [record.idHash]: (prev[record.idHash] || record.number) + 1
                        }))}
                    >+</button>
                </div>
            )
        },
        {
            title: 'Anbar', dataIndex: 'storages', key: 'storages',
            render: (_, record) => (
                <div className="d-flex LocationBrend infoBlock2">
                    {record?.storages?.length > 0 && (
                        <div className="Location infoBlock2">
                            <p className="LocationName infoBlock2 d-flex">
                                <Select
                                    size="small"
                                    style={{
                                        backgroundColor: '#f0f0f0',
                                        border: 'none',
                                        borderRadius: '30px',
                                        padding: '5px 0px',
                                    }}
                                    dropdownStyle={{ backgroundColor: '#f0f0f0' }}
                                    className="custom-select2 infoBlock2"
                                    defaultValue={record?.storages[0]?.storageIdHash}
                                    optionFilterProp="children"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {record?.storages?.map((s) => (
                                        <Option key={s.valueHash}
                                            value={s.storageIdHash}
                                            className='infoBlock2'
                                        >
                                            <img className='infoBlock2' src={Images.Location} alt="Location" />
                                            <span className='infoBlock2' style={{ marginLeft: '8px' }}>{s.storageCode}</span>
                                        </Option>
                                    ))}
                                </Select>
                            </p>
                        </div>
                    )}
                </div>
            )
        },
        { title: 'Qiymət €', dataIndex: 'priceEUR', key: 'priceEUR', },
        {
            title: 'Qiymət ₼', dataIndex: 'value', key: 'value', width: 120,
            render: (_, record) => (
                <>

                    {record.price?.formattedDiscountPrice > 0 ? (
                        <>
                            <p className="DelPrice">
                                <del>{record.price?.value} {record.price?.currencyName}</del>
                            </p>
                            <p className="Price fb-800">
                                {record.price?.formattedDiscountPrice} {record.price?.currencyName}
                            </p>
                        </>
                    ) : (
                        <p className="Price fb-800">
                            {record.price?.value} {record.price?.currencyName}
                        </p>
                    )}
                    {record.price?.formattedDiscountPrice > 0 && (
                        <div className="position-absolute" style={{ left: "-1px", top: "-20px", transform: "rotate(37deg)" }}>
                            <img src={Images.Endirim} alt="Discount" />
                            <p className="text-white position-absolute discount">{record.price?.discountRate} endirim</p>
                        </div>
                    )}
                </>)
        },
        {
            title: ' ',
            key: 'basket',
            render: (_, record) => (
                <button
                    disabled={loading[record.idHash]}
                    className="Basket2"
                    onClick={async () => {
                        setLoading(prev => ({ ...prev, [record.idHash]: true })); // Sadece tıklanan satır için loading aktif
                        await handleAddToCart(record);
                        setLoading(prev => ({ ...prev, [record.idHash]: false })); // İşlem tamamlanınca loading kapat
                    }}
                >
                    {loading[record.idHash] && <Spin size="small" />} {/* Daha temiz render */}
                    <img src={Images.Vector2} className='tobasket' alt="Add to Basket" />
                    <p className="BasketTitle">basket</p>
                </button>
            )
        },

        {
            title: ' ',
            key: 'return',
            render: (_, record) => (
                <PermissionWrapper topModuleCode="$USER" subModuleCode="$BASKET_SUB_MODULE" pageCode="$RETURN_PRODUCT_CARD" rightCode="$GET">
                    <div className="cursor-pointer Returun2" onClick={() => showReturnModal(record)}>
                        <img src={Images.Return} className='returnn' alt="Return" />
                        <p className="ReturunTitle">{t("Global.return")}</p>
                    </div>
                </PermissionWrapper>
            )
        }
    ];



    const isMobile = useMediaQuery({ maxWidth: 768 }); // 768px altında mobil kabul ediliyor

    // Responsive ayarlarla kolonları filtreleme
    const responsiveColumns = isMobile
        ? columnss.filter(col => !['unnecessaryColumn', 'anotherColumn'].includes(col.key)) // Gereksiz kolonları gizle
        : columnss;
    return (
        <>
            <Table
                columns={responsiveColumns}
                dataSource={data}
                pagination={false}
                rowKey="idHash"
                bordered
                scroll={{ x: 1350 }} // Küçük ekranlarda yatay kaydırma desteği
                onRow={(record) => ({
                    onClick: (e) => {
                        const blockedTags = ['INPUT', 'BUTTON', 'SELECT', 'IMG', 'Select', 'Option', 'img', 'Tooltip'];
                        const blockedClasses = ['Basket2', 'Returun2', 'custom-select2', 'ant-btn', 'ReturunTitle', 'infoBlock', 'returnn', 'infoBlock2', 'tobasket', 'BasketTitle', 'LocationBrend', 'LocationName', 'Location'];

                        if (blockedTags.includes(e.target.tagName) || blockedClasses.some(cls => e.target.classList.contains(cls))) {
                            e.stopPropagation();
                            return;
                        }

                        handleRowClick(record);
                    },
                })}
            />
            <Modal width="95vw" title="Geri qaytarılma" open={isReturnModalVisible} onCancel={() => setIsReturnModalVisible(false)}
                footer={[<Button key="back" onClick={() => setIsReturnModalVisible(false)}>Bağla</Button>]}
            >
                {loading ? <Spin size="large" /> : <Table columns={columns} dataSource={responseData} rowKey="idHash" pagination={false} bordered />}
            </Modal>

            {/* Models Modal */}
            <Modal
                title="Vehicle Models"
                visible={isModelModalVisible}
                onCancel={() => setIsModelModalVisible(false)}
                footer={null}
            >
                <List size="large" bordered>
                    {selectedModel ? (
                        <List.Item>{selectedModel}</List.Item>
                    ) : (
                        data.map((item, index) => (
                            item?.vehicleModels?.map((vehicleModel, vehicleIndex) => (
                                <List.Item key={`${index}-${vehicleIndex}`}>
                                    {vehicleModel?.vehicleModelIdName}
                                </List.Item>
                            ))
                        ))
                    )}
                </List>
            </Modal>


        </>
    );
};

export default GridCard;
