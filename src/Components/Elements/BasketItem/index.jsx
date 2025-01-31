import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Images from "../../../Assets/images/js/Images";
import { Select } from 'antd';
import { BasketApi } from "../../../api/basket.api";
import { useAuth } from "../../../AuthContext";
import { Spin } from 'antd'
import { useTranslation } from 'react-i18next';
import PermissionWrapper from "../PermissionWrapper/PermissionWrapper";

const { Option } = Select;

const ReturnItems = ({ basketItems, getBasketItems, getTotalPrice, setBasketItems, basketItemStatus }) => {
    let { FiTag, Down, Location, TagTwo, TabloDelete, Add_Bin } = Images;
    const dispatch = useDispatch();
    const { openNotification } = useAuth()
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const groupedData = basketItems?.length ? basketItems.reduce((acc, item) => {
        if (!acc[item.productType.description]) {
            acc[item.productType.description] = [];
        }
        acc[item.productType.description].push(item);
        return acc;
    }, {}) : []

    const handleDelete = (id) => {
        setLoading(true)
        BasketApi.DeleteById({ id }).then(() => {
            openNotification('Uğurlu əməliyyat..', `Məhsul silindi`, false)
            setTimeout(() => {
                getBasketItems()
                getTotalPrice()
                setBasketItems([])
                setLoading(false)
            }, 1000)
        })
            .catch((err) => {
                openNotification('Xəta baş verdi', err.response.data.message, true)
                setLoading(false)
            })
    };

    const handleDeleteAll = (category) => {
        setLoading(true)
        BasketApi.DeleteAll().then(() => {
            openNotification('Uğurlu əməliyyat..', `Bütün məhsullar silindi`, false)
            setTimeout(() => {
                getBasketItems()
                getTotalPrice()
                setBasketItems([])
                setLoading(false)
            }, 1000)
        })
            .catch((err) => {
                openNotification('Xəta baş verdi', err.response.data.message, true)
                setLoading(false)
            })
    };

    const handleDeleteSelected = (category) => {
        setLoading(true)
        BasketApi.DeleteByIds(selectedItems).then(() => {
            openNotification('Uğurlu əməliyyat..', `Bütün məhsullar silindi`, false)
            getBasketItems()
            getTotalPrice()
        })
            .catch((err) => {
                openNotification('Xəta baş verdi', err.response.data.message, true)
            })
            .finally(() => {
                setLoading(false)
            })
    };

    function encodeQueryParam(param) {
        return encodeURIComponent(param);
    }

    const handleCheckboxChange = (id) => {
        console.log(basketItemStatus , id)
          console.log(encodeQueryParam(id))
        if (selectedItems.includes(id)) {
            setLoading(true)
            BasketApi.UpdateStatus({
                id:encodeQueryParam(id),
                statusId: basketItemStatus[1].valueHash
            }).then(() => {
                setSelectedItems(selectedItems.filter(selectedItem => selectedItem !== id))
                getBasketItems()
                getTotalPrice()
            }).catch((err) => {
                openNotification('Xəta baş verdi', err.response.data.message, true)
            }).finally(() => {
                setLoading(false)
            })
        }
        else {
            setLoading(true)
            BasketApi.UpdateStatus({
                id:encodeQueryParam(id),
                statusId: basketItemStatus[0].valueHash
            }).then(() => {
                setSelectedItems([
                    ...selectedItems,
                    id
                ])
                getBasketItems()
                getTotalPrice()
            }).catch((err) => {
                openNotification('Xəta baş verdi', err.response.data.message, true)
            }).finally(() => {
                setLoading(false)
            })
        }
    };


    const handleCategoryChange = (checked, id) => {
        debugger;
        console.log(checked, id)
        if (checked) {
            setLoading(true)
            BasketApi.UpdateStatusByProductTypeId({
                productTypeId: id,
                statusId: basketItemStatus[1].valueHash
            }).then(() => {
                getBasketItems()
                getTotalPrice()
            }).catch((err) => {
                openNotification('Xəta baş verdi', err.response.data.message, true)
            }).finally(() => {
                setLoading(false)
            })
        }
        else {
            setLoading(true)
            BasketApi.UpdateStatusByProductTypeId({
                productTypeId: id,
                statusId: basketItemStatus[0].valueHash
            }).then(() => {
                getBasketItems()
                getTotalPrice()
            }).catch((err) => {
                openNotification('Xəta baş verdi', err.response.data.message, true)
            }).finally(() => {
                setLoading(false)
            })
        }
    };

    const handleQuantityUpdate = (productId, PQuantity, increment) => {

        let quantity = increment ? PQuantity + 1 : Math.max(PQuantity - 1, 0);

        if (quantity === PQuantity) return;


        BasketApi.UpdateQuantity({ quantity: `${quantity}`, productId: encodeQueryParam(productId) })
            .then(() => {
                getBasketItems();
                getTotalPrice();
            })
            .catch(err => {
                openNotification('Xəta baş verdi', err.response.data.message, true);
            })
    };

    useEffect(() => {
        if (basketItems.length > 0) {
            let arr = basketItems.map((item) => {
                if (item.basketDetailStatus === 1) {
                    return item.idHash;
                }
                return null;
            }).filter(Boolean);

            setSelectedItems(arr);
        }
    }, [basketItems]);

    // useEffect(() => {
    //     if (basketItems.length > 0) {
    //         let arr = basketItems.map((item) => {
    //             if (item.basketDetailStatus === 1) {
    //                 return item.idHash
    //             }
    //         })

    //         console.log(arr)
    //         setSelectedItems(
    //             arr
    //         )
    //     }
    // }, [basketItems.length])

    return (
        <>
            <Spin spinning={loading}>
                {Object.keys(groupedData).map((category, categoryIndex) => (
                    <div className="w-100 position-relative gy-4 rounded" style={{ padding: "0rem 0rem 0.8rem 0rem" }} key={categoryIndex}>
                        <div className="d-flex pe-3 my-3 justify-content-between">
                            <div className={'d-flex align-items-center'}>
                                <div className="checkbox me-2">
                                    <div key={categoryIndex}>
                                        <input
                                            type="checkbox"
                                            id={`checkbox-${category}`}
                                            checked={groupedData[category].every((s) => s.basketDetailStatus === 1)}
                                            onChange={() => {
                                                const isChecked = groupedData[category].every((s) => s.basketDetailStatus === 1);
                                                handleCategoryChange(isChecked, groupedData[category][0].productType.idHash);
                                            }}
                                        />
                                        <label htmlFor={`checkbox-${category}`} className="checkmark" />
                                    </div>

                                </div>
                                <div className="text-44 fb-600">
                                    {category}
                                </div>
                            </div>
                            {categoryIndex === 0 && (
                                <div className="d-flex">
                                    <PermissionWrapper
                                        topModuleCode="$USER"
                                        subModuleCode="$BASKET_SUB_MODULE"
                                        pageCode="$BASKET_DETAIL"
                                        rightCode="$DELETE"
                                    >
                                        <button className="AllDel me-3" onClick={() => handleDeleteAll(category)}>
                                            <img src={Add_Bin} alt="" />
                                            <p className='ms-2'>{t("Basket.table.delete")}</p>
                                        </button>
                                        <button className="AllDel" onClick={() => handleDeleteSelected(category)}>
                                            <img src={Add_Bin} alt="" />
                                            <p className='ms-2'>{t("Basket.table.remove")}</p>
                                        </button>
                                    </PermissionWrapper>
                                </div>
                            )}
                        </div>

                        <div className="myContainer">
                            {groupedData[category].map((Data, index) => (
                                <div className="row align-items-center border border-1 rounded bg-white" key={index}
                                  >
                                    <div className="col-2 d-flex justify-content-between align-items-center">
                                        <div className="ms-2 checkbox">
                                            <input
                                                type="checkbox"
                                                id={Data.idHash}
                                                checked={selectedItems.includes(Data.idHash)}
                                                onChange={() => handleCheckboxChange(Data.idHash)}
                                            />
                                            <label htmlFor={Data.idHash} className="checkmark" />
                                        </div>
                                        <img className={'me-4'} src={Data.product.defaultContent} width="47px" height="43px"
                                            alt="" />
                                    </div>
                                    <div className="col-7 mt-3">
                                        <div className="w-100 d-flex justify-content-between">
                                            <div className='d-flex w-75 pe-2'>
                                                <img style={{ height: '20px' }} src={FiTag} alt="" />
                                                <p className="OemNo text-44 ms-2">
                                                    {Data.product.code}
                                                </p>
                                            </div>
                                            <div className="d-flex">
                                                <p className="Oem">
                                                    OEM № :
                                                    <span className="OemNo">
                                                        {Data.product.oemCode}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between w-100 mt-2">
                                            <div className='d-flex mb-2 align-items-center'>
                                                {
                                                    Data.productStorages?.length > 0 ?
                                                        <div
                                                            className="Location2 d-flex mx-4 align-items-center">
                                                            <Select
                                                                size={'small'}
                                                                defaultValue="location"
                                                                style={{ width: 120 }}
                                                                bordered={false} s
                                                                dropdownStyle={{ borderRadius: '8px' }}
                                                                className="custom-select"
                                                                suffixIcon={<img src={Down} alt="" />}
                                                            >
                                                                {
                                                                    Data.productStorages.map(function (productStorages) {
                                                                        return <Option value="location">
                                                                            <img src={Location} alt="" />
                                                                            <span
                                                                                style={{ marginLeft: '8px' }}>{productStorages.code}</span>
                                                                        </Option>
                                                                    })
                                                                }
                                                            </Select>
                                                        </div>

                                                        : ''
                                                }

                                                <div className="Brend ms-3 d-flex align-items-center">
                                                    <img src={TagTwo} alt="" />
                                                    <p className="BrendTitle ms-1">
                                                        {Data.product.manufacturerName}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center me-5">
                                                {Data.product.vehicleBrands.map((d) => {
                                                    return <React.Fragment key={d.vehicleBrandIdHash}>
                                                        <div className="ImgCenters">
                                                            <img
                                                                src={d.vehicleBrandContent}
                                                                alt="" />
                                                        </div>
                                                        <p className="brendNo ms-2">
                                                            {d.vehicleBrandIdName}
                                                        </p>
                                                    </React.Fragment>
                                                })}
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <h3 className="BrandingName">
                                                {Data.product.manufacturerName}
                                                <span className="BrandingNameTwo">
                                                    {'   '} {Data.product.name}
                                                </span>
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="col-3 d-flex align-items-center">
                                        <div className="counterCenter">
                                            <PermissionWrapper
                                                topModuleCode="$USER"
                                                subModuleCode="$BASKET_SUB_MODULE"
                                                pageCode="$BASKET_DETAIL"
                                                rightCode="$PUT"
                                            >
                                                <button className="del"
                                                    onClick={() => handleQuantityUpdate(Data.product.idHash, Data.quantity, false)}>
                                                    -
                                                </button>
                                            </PermissionWrapper>
                                            <input type="text" name="" id="" className="counter mx-3"
                                                value={Data.quantity} readOnly />
                                            <PermissionWrapper
                                                topModuleCode="$USER"
                                                subModuleCode="$BASKET_SUB_MODULE"
                                                pageCode="$BASKET_DETAIL"
                                                rightCode="$PUT"
                                            >
                                                <button className="plus"
                                                    onClick={() => handleQuantityUpdate(Data.product.idHash, Data.quantity, true)}>
                                                    +
                                                </button>
                                            </PermissionWrapper>
                                        </div>
                                        <div className='d-flex flex-column align-items-end'>
                                            <PermissionWrapper
                                                topModuleCode="$USER"
                                                subModuleCode="$BASKET_SUB_MODULE"
                                                pageCode="$BASKET_DETAIL"
                                                rightCode="$DELETE"
                                            >
                                                <button className="none" onClick={() => handleDelete(Data.idHash)}>
                                                    <img width="24px" className='' src={TabloDelete} alt="" />
                                                </button>
                                            </PermissionWrapper>
                                            <div className="prices2 mt-2">
                                                {Data.salesPrice ? (
                                                    <>
                                                        <p className="Price fb-800">
                                                            {Data.salesPrice.formattedPrice} {Data.salesPrice.currencyName}
                                                        </p>
                                                        {Data.price !== Data.formattedDiscountedPrice && (
                                                            <del>
                                                                <p className="DelPrice">
                                                                    <del>
                                                                        {Data.formattedDiscountedPrice}
                                                                    </del>
                                                                </p>
                                                            </del>
                                                        )}
                                                    </>
                                                ) : (
                                                    <p className="OriginalPrice">
                                                        {Data.salesPrice.formattedPrice} {Data.salesPrice.currencyName}
                                                    </p>
                                                )}
                                                {Data.formattedDiscountPrice > 0 ? (
                                                    <p className="DelPrice">
                                                        <del>
                                                            {Data.del_price}
                                                        </del>
                                                    </p>
                                                ) : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </Spin>
        </>
    );
};

export default ReturnItems;
