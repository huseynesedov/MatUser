import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Images from '../../../Assets/images/js/Images';
import { useAuth } from "../../../AuthContext";
import { Tooltip, Spin, List, Modal, Select, Table, Button, InputNumber } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import { BasketApi } from "../../../api/basket.api";
import { useTranslation } from 'react-i18next';
import moment from "moment";
import PermissionWrapper from "../PermissionWrapper/PermissionWrapper";

const { Option } = Select;

const CardItem = ({ d, classes }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { roleId } = useAuth();

    const [quantity, setQuantity] = useState(d.minOrderAmount || 1);
    const [isModelModalVisible, setIsModelModalVisible] = useState(false);
    const [isReturnModalVisible, setIsReturnModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [responseData, setResponseData] = useState([]);
    const { FiTag, Location, Return, Vector2, Heart, Endirim } = Images;
    const { openNotification, updateReturnData, returnData } = useAuth();

    useEffect(() => {
        setQuantity(d.minOrderAmount);
    }, [d.minOrderAmount]);

    // Handle Add to Basket
    const handleAddToCart = async (product) => {
        setLoading(true);
        BasketApi.AddToBasket({
            productId: product.idHash,
            quantity,
        })
            .then(() => {
                openNotification('Əlavə edildi', `${product.name} səbətə əlavə edildi`, false);
            })
            .catch((err) => {
                openNotification('Xəta baş verdi', err.response?.data?.message || 'Server xətası', true);
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 5000);
            });
    };

    // Show Return Product Modal
    const showReturnModal = () => {
        setIsReturnModalVisible(true);
        setLoading(true);

        BasketApi.ReturnProduct({ productIdHash: d.idHash })
            .then((response) => {
                setResponseData(response.map((r, index) => {
                    return {
                        ...r,
                        index: index + 1,
                        returnQuantity: r.quantity
                    }
                }));
            })
            .catch((error) => {
                openNotification('Xəta baş verdi', error.response?.data?.message || 'Server xətası', true);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Handle Add Return Product Card
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

    // Handle quantity increment
    const incrementQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    // Handle quantity decrement
    const decrementQuantity = () => {
        if (quantity > d.minOrderAmount) {
            setQuantity(prevQuantity => prevQuantity - 1);
        } else {
            openNotification('Xəta', `Minimal sifariş sayı ${d.minOrderAmount} olmalıdır.`, false);
        }
    };

    // Handle inline quantity change in the table
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

    // Columns for the Return Product Table
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

    return (
        <div className={`d-block text-decoration-none position-relative ${classes}`} key={d.idHash}>
            <div className="CartCenterMain">
                {d.price?.formattedDiscountPrice > 0 && (
                    <div className="position-absolute" style={{ left: "-21px", top: "-17px" }}>
                        <img src={Endirim} alt="Discount" />
                        <p className="text-white position-absolute discount">{d.price?.discountRate} endirim</p>
                    </div>
                )}


                <div className="ImgTitleMain">
                    <div className="ImgBrendingTitle">
                        <Link to={`/${roleId ? roleId.toLowerCase() : ''}/detail/${d.idHash}`}>
                            <div className="ImgFocus">
                                <img style={{ objectFit: "contain" }} src={`${d.defaultContent}`} alt="Product" />
                            </div>
                        </Link>
                        <div className="TitleCenter ms-3">
                            <Link to={`/${roleId ? roleId.toLowerCase() : ''}/detail/${d.idHash}`}>
                                <span className="Tag">
                                    <img src={FiTag} alt="FiTag" />
                                    <p className="OemNo product text-44">{d.code}</p>
                                </span>
                            </Link>
                            <div className="d-flex">
                                {d.vehicleBrands.map((s, index) => (
                                    <span className="TagTwo" key={index}>
                                        <Tooltip title={s.vehicleBrandIdName}>
                                            <div className="ImgCenters">
                                                <img src={`${s.vehicleBrandContent}`} alt="Brand" />
                                            </div>
                                        </Tooltip>
                                    </span>
                                ))}
                                <Tooltip
                                    onClick={() => setIsModelModalVisible(true)}
                                    placement="topRight"
                                    title="Models"
                                >
                                    <InfoCircleOutlined className="text-dark ms-2" />
                                </Tooltip>
                            </div>

                        </div>
                    </div>
                    <div className="OemTextCenter">
                        <p className="Oem">
                            OEM № :
                            <p className="OemNo">
                                {d.oemCode}
                            </p>
                        </p>
                    </div>
                </div>


                <div className="LocationBrendNameCenter">
                    <div className="d-flex w-100 flex-wrap justify-content-between my-2" style={{ padding: "0 10px", marginLeft: "9px", gap: "10px" }}>
                        <div className="d-flex LocationBrend">
                            {d?.storages?.length > 0 && (
                                <div className="Location">
                                    <p className="LocationName d-flex">
                                        <Select
                                            size="small"
                                            style={{
                                                backgroundColor: '#f0f0f0',
                                                border: 'none',
                                                borderRadius: '30px',
                                                padding: '5px 0px',
                                            }}
                                            dropdownStyle={{ backgroundColor: '#f0f0f0' }}
                                            className="custom-select2"
                                            defaultValue={d?.storages[0]?.storageIdHash}
                                            optionFilterProp="children"
                                        >
                                            {d?.storages?.map((s) => (
                                                <Option key={s.valueHash}
                                                    value={s.storageIdHash}
                                                >
                                                    <img src={Location} alt="Location" />
                                                    <span style={{ marginLeft: '8px' }}>{s.storageCode}</span>
                                                </Option>
                                            ))}
                                        </Select>
                                    </p>
                                </div>
                            )}
                            <div className="Brend">
                                <img height="18px" src={d.manufacturerContent} alt="Manufacturer" />
                                <p className="BrendTitle">{d.manufacturerName}</p>
                            </div>
                        </div>

                        <PermissionWrapper
                            topModuleCode="$USER"
                            subModuleCode="$BASKET_SUB_MODULE"
                            pageCode="$RETURN_PRODUCT_CARD"
                            rightCode="$GET"
                        >
                            <div className="cursor-pointer Returun">
                                <a onClick={() => {
                                    showReturnModal()
                                }} className="text-decoration-none" >
                                    <img src={Return} alt="Return" />
                                    <p className="ReturunTitle">{t("Global.return")}</p>
                                </a>
                            </div>
                        </PermissionWrapper>
                    </div>
                </div>

                <Link to={`/${roleId ? roleId.toLowerCase() : ''}/detail/${d.idHash}`} className="BrendingDetailTitle text-decoration-none">
                    <div className="BrendTitleCenter mt-2">
                        <h3 className="BrandingName">
                            {d.name}
                            <p className="BrandingNameTwo">
                                {d.description}
                            </p>
                        </h3>
                    </div>
                </Link>
                <div className="d-flex w-100 mt-2">
                    <div className="PriceCounter">
                        <div className="prices">
                            {d.price?.formattedDiscountPrice > 0 ? (
                                <>
                                    <p className="DelPrice">
                                        <del>{d.price?.value} {d.price?.currencyName}</del>
                                    </p>
                                    <p className="Price fb-800">
                                        {d.price?.formattedDiscountPrice} {d.price?.currencyName}
                                    </p>
                                </>
                            ) : (
                                <p className="Price fb-800">
                                    {d.price?.value} {d.price?.currencyName}
                                </p>
                            )}
                        </div>


                        <div className="counterCenter">
                            <button className="del" onClick={decrementQuantity}>-</button>
                            <input
                                value={quantity}
                                pattern="[0-9]*"
                                onChange={(e) => {
                                    const newQuantity = e.target.value.replace(/[^0-9]/g, '');
                                    setQuantity(Number(newQuantity) >= d.minOrderAmount ? Number(newQuantity) : d.minOrderAmount);
                                }}
                                className="counter mx-3"
                                style={{ width: `${Math.max(3, quantity.toString().length)}ch` }}
                            />
                            <button className="plus" onClick={incrementQuantity}>+</button>
                        </div>
                    </div>
                </div>

                <PermissionWrapper
                    topModuleCode="$USER"
                    subModuleCode="$BASKET_SUB_MODULE"
                    pageCode="$BASKET_DETAIL"
                    rightCode="$POST"
                >
                    <div className="BasketLikeCenter my-2">
                        <button disabled={loading} className="Basket" onClick={() => handleAddToCart(d)}>
                            {loading ? <Spin className="custom-spin" size="small" /> : ''}
                            <img src={Vector2} alt="Add to Basket" />
                            <p className="BasketTitle">{t("Global.basket")}</p>
                        </button>
                    </div>
                </PermissionWrapper>
            </div>

            {/* Models Modal */}
            <Modal
                title="Vehicle Models"
                visible={isModelModalVisible}
                onCancel={() => setIsModelModalVisible(false)}
                footer={null}
            >
                <List size="large" bordered>
                    {d.vehicleModels.map((item, index) => (
                        <List.Item key={index}>{item.vehicleModelIdName}</List.Item>
                    ))}
                </List>
            </Modal>

            <Modal
                width="95vw"
                style={{ top: 20 }}
                title="Geri qaytarılma"
                visible={isReturnModalVisible}
                onCancel={() => setIsReturnModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setIsReturnModalVisible(false)}>Bağla</Button>,
                ]}
            >
                {loading ? (
                    <Spin size="large" style={{ display: 'block', margin: '0 auto' }} />
                ) : (
                    <Table
                        className={'w-100'}
                        columns={columns}
                        dataSource={responseData}
                        rowKey="productIdHash"
                        pagination={false}
                        bordered
                    />
                )}
            </Modal>
        </div>
    );
};

export default CardItem;