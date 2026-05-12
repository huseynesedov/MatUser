import React, { useEffect, useState } from "react";
import { Collapse, Input, Form, Radio, Checkbox } from "antd";
import Images from "../../../Assets/images/js/Images";
const { Panel } = Collapse;

const Filters = ({
    storageData,
    productTypeData,
    productBrendData,
    vehicleBrands,
    productGroupData,
    onFilterChange,
    setManufacturerId,
    setProductTypeId,
}) => {
    const { Filtr, Stok, AiOutlineUngroup, FiTag2, BiCar, List24, down } = Images;
    const [form] = Form.useForm();

    // States for filtered data
    const [filteredProductBrendData, setFilteredProductBrendData] = useState(productBrendData);
    const [filteredVehicleBrands, setFilteredVehicleBrands] = useState(vehicleBrands);
    const [filteredProductGroupData, setFilteredProductGroupData] = useState(productGroupData);

    useEffect(() => {
        // Initialize filtered data and default product type selection
        setFilteredProductBrendData(productBrendData);
        setFilteredVehicleBrands(vehicleBrands);
        setFilteredProductGroupData(productGroupData);
    }, [productBrendData, vehicleBrands, productGroupData, productTypeData]);

    useEffect(() => {
        setTimeout(() => {
            if (productTypeData && productTypeData.length > 0) {
                form.setFieldsValue({ productType: productTypeData[0].valueHash });
                handleFormChange({}, { productType: productTypeData[0].valueHash });
            }
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync default product type when catalog loads
    }, [productTypeData])

    const handleFormChange = (_, allValues) => {
        // Process checkboxes for campaignType
        console.log(allValues)
        const campaignTypeFilters = [];
        if (allValues.campaignType && allValues.campaignType.includes("hasCampaign")) {
            campaignTypeFilters.push({ fieldName: "hasCampaign", value: true, equalityType: "Equal" });
        }
        if (allValues.campaignType && allValues.campaignType.includes("isNew")) {
            campaignTypeFilters.push({ fieldName: "isNew", value: true, equalityType: "Equal" });
        }
        if (allValues.campaignType && allValues.campaignType.includes("hasStorage")) {
            campaignTypeFilters.push({ fieldName: "hasStorage", value: true, equalityType: "Equal" });
        }


        // Map field names to corresponding field values
        const fieldMapping = {
            storage: "storages.storageIdHash",
            productType: "productTypeIdHash",
            vehicleBrand: "vehicleBrands.vehicleBrandIdHash",
            manufacturerId: "manufacturerIdHash",
            productGroup: "name",
        };

        // Process other form values for filters
        const otherFilters = Object.entries(allValues)
            .filter(
                ([fieldName, value]) =>
                    value !== "ALL" && value !== undefined && value !== null && value !== "" && fieldName !== "campaignType"
            )
            .map(([fieldName, value]) => ({
                fieldName: fieldMapping[fieldName] || fieldName,
                value,
                equalityType: "Equal",
            }));


        const filters = [...campaignTypeFilters, ...otherFilters];

        onFilterChange(filters);
    };

    const handleSearch = (value, data, setFilteredData) => {
        setFilteredData(
            data.filter((item) =>
                item.displayText.toLowerCase().includes(value.toLowerCase())
            )
        );
    };

    const customExpandIcon = (panelProps) => (
        <img
            src={down}
            alt="Arrow Icon"
            style={{
                transform: panelProps.isActive ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s",
            }}
        />
    );

    return (
        <Form
            form={form}
            layout="vertical"
            className="w-100"
            initialValues={{
                storage: "ALL",
                manufacturerId: "ALL",
                vehicleBrand: "ALL",
                productGroup: "ALL",
            }}
            onValuesChange={handleFormChange}
        >
            <Collapse
                expandIcon={customExpandIcon}
                expandIconPosition="end"
            >
                {/* Campaign Filters */}
                <Panel
                    header={
                        <div className="d-flex align-items-center">
                            <img src={Filtr} alt="Filter Icon" className="me-2" />
                            <span>Filter</span>
                        </div>
                    }
                    key="1"
                >
                    <Form.Item name="campaignType">
                        <Checkbox.Group className="w-100">
                            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                                <ul className="list-unstyled">
                                    <li>
                                        <Checkbox value="hasCampaign">Aksiya</Checkbox>
                                    </li>
                                    <li>
                                        <Checkbox value="isNew">Yeni Məhsul</Checkbox>
                                    </li>
                                    <li>
                                        <Checkbox value="hasStorage">Mövcuddur</Checkbox>
                                    </li>
                                </ul>
                            </div>
                        </Checkbox.Group>
                    </Form.Item>
                </Panel>

                {/* Stock Filters */}
                <Panel
                    header={
                        <div className="d-flex align-items-center">
                            <img src={Stok} alt="Stock Icon" className="me-2" />
                            <span>Stok</span>
                        </div>
                    }
                    key="2"
                >
                    <Form.Item name="storage">
                        <Radio.Group>
                            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                                <ul className="list-unstyled">
                                    <li>
                                        <Radio value="ALL">Hamısı</Radio>
                                    </li>
                                    {storageData.map((item) => (
                                        <li key={item.valueHash}>
                                            <Radio value={item.valueHash}>{item.displayText}</Radio>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Radio.Group>
                    </Form.Item>
                </Panel>

                {/* Product Types */}
                <Panel
                    header={
                        <div className="d-flex align-items-center">
                            <img src={AiOutlineUngroup} alt="Product Type Icon" className="me-2" />
                            <span>Məhsulun Novu</span>
                        </div>
                    }
                    key="3"
                >
                    <Form.Item name="productType">
                        <Radio.Group>
                            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                                <ul className="list-unstyled">
                                    {productTypeData.map((item, index) => (
                                        <li onClick={() => {
                                            setProductTypeId(item.valueHash)
                                        }} key={item.valueHash}>
                                            <Radio
                                                value={item.valueHash}
                                                defaultChecked={index === 0} // Default the first option
                                            >
                                                {item.displayText}
                                            </Radio>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Radio.Group>
                    </Form.Item>
                </Panel>

                {/* Brands */}
                <Panel
                    header={
                        <div className="d-flex align-items-center">
                            <img src={FiTag2} alt="Brand Icon" className="me-2" />
                            <span>Brend</span>
                        </div>
                    }
                    key="4"
                >
                    <Input
                        placeholder="Brend axtar..."
                        onChange={(e) =>
                            handleSearch(e.target.value, productBrendData, setFilteredProductBrendData)
                        }
                        className="mb-2"
                    />
                    <Form.Item name="manufacturerId">
                        <Radio.Group>
                            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                                <ul className="list-unstyled">
                                    <li>
                                        <Radio value="ALL">Hamısı</Radio>
                                    </li>
                                    {filteredProductBrendData.map((item) => (
                                        <li onClick={() => {
                                            setManufacturerId(item.valueHash)
                                        }} key={item.valueHash}>
                                            <Radio value={item.valueHash}>{item.displayText}</Radio>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Radio.Group>
                    </Form.Item>
                </Panel>

                {/* Vehicle Brands */}
                <Panel
                    header={
                        <div className="d-flex align-items-center">
                            <img src={BiCar} alt="Vehicle Brand Icon" className="me-2" />
                            <span>Avtomobil Markası</span>
                        </div>
                    }
                    key="5"
                >
                    <Input
                        placeholder="Marka axtar..."
                        onChange={(e) =>
                            handleSearch(e.target.value, vehicleBrands, setFilteredVehicleBrands)
                        }
                        className="mb-2"
                    />
                    <Form.Item name="vehicleBrand">
                        <Radio.Group>
                            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                                <ul className="list-unstyled">
                                    <li>
                                        <Radio value="ALL">Hamısı</Radio>
                                    </li>
                                    {filteredVehicleBrands.map((item) => (
                                        <li key={item.valueHash}>
                                            <Radio value={item.valueHash}>{item.displayText}</Radio>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Radio.Group>
                    </Form.Item>
                </Panel>

                {/* Product Groups */}
                <Panel
                    header={
                        <div className="d-flex align-items-center">
                            <img src={List24} alt="Product Group Icon" className="me-2" />
                            <span>Məhsul Grup</span>
                        </div>
                    }
                    key="6"
                >
                    <Input
                        placeholder="Məhsul grup axtar..."
                        onChange={(e) =>
                            handleSearch(e.target.value, productGroupData, setFilteredProductGroupData)
                        }
                        className="mb-2"
                    />
                    <Form.Item name="productGroup">
                        <Radio.Group>
                            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                                <ul className="list-unstyled">
                                    <li>
                                        <Radio value="ALL">Hamısı</Radio>
                                    </li>
                                    {filteredProductGroupData.map((item) => (
                                        <li key={item.valueHash}>
                                            <Radio value={item.valueHash}>{item.displayText}</Radio>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Radio.Group>
                    </Form.Item>
                </Panel>
            </Collapse>
        </Form>
    );
};

export default Filters;
