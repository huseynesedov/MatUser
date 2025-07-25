import React, { useEffect, useState } from 'react'
import UserListTable from './Components/table'
import { Collapse, Input, Form, Radio, Button, Spin } from "antd";
import Images from '../../../../Assets/images/js/Images';
import { BaseApi } from '../../../../const/api';
const { Panel } = Collapse;

const Plasiyer = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  //City
  const [city, setCity] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState(null); // Seçilen şeher

  // City-region
  const [region, setRegion] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null); // Seçilen şeher
  const [searchRegionTerm, setSearchRegionTerm] = useState("");

  // Search
  const [searchText, setSearchText] = useState("");

  const getCityAndRegionList = async () => {
    setLoading(true);

    try {
      const cityResponse = await BaseApi.get("/catalog/v1/City/GetCityListByCustomer");
      if (cityResponse && Array.isArray(cityResponse)) {
        setCity(cityResponse);
      } else {
        console.error("Invalid response format:", cityResponse);
      }

      if (selectedCity) {
        const regionResponse = await BaseApi.post("/catalog/v1/City/GetDistrictListByCityId", { cityIdHash: selectedCity });
        if (regionResponse && Array.isArray(regionResponse)) {
          setRegion(regionResponse);
        } else {
          console.error("Invalid response format:", regionResponse);
        }
      }
    } catch (error) {
      console.error("Error fetching city or region list:", error);
    } finally {
      setLoading(false);
    }
  };

  // City
  const filteredCities = city.filter((item) =>
    (item.displayText || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCityChange = (value) => {
    setSelectedCity(value);
    form.setFieldsValue({ manufacturerId: value });
  };

  // city-region
  const filteredRegion = region.filter((item) =>
    (item.displayText || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRegionChange = (value) => {
    setSelectedRegion(value);
    form.setFieldsValue({ regionId: value });
  };



  useEffect(() => {
    getCityAndRegionList();
  }, [selectedCity]);




  return (
    <>
      <div className="container mt-5">
        <div className="row">
          {/* İlk panel */}
          <div className="col-md-6 col-lg-3 mb-3">
            <Collapse expandIconPosition="end" defaultActiveKey={["1"]}>
              <Panel
                header={
                  <div className="d-flex align-items-center">
                    <img src={Images.FiTag2} alt="Brand Icon" className="me-2" />
                    <span>Şəhər</span>
                  </div>
                }
                key="1"
              >
                <Form form={form} initialValues={{ manufacturerId: null }}>
                  <Input
                    placeholder="Şəhər axtar..."
                    className="mb-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  <Form.Item name="manufacturerId">
                    <Radio.Group onChange={(e) => handleCityChange(e.target.value)}>
                      <div
                        style={{
                          maxHeight: "200px",
                          minHeight: "200px",
                          overflowY: "auto",
                          minWidth: "269px",
                          width: "100%",
                        }}
                      >
                        {loading ? (
                          <div style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                            zIndex: 9999
                          }}>
                            <Spin size="large" />
                          </div>
                        ) : (
                          <ul className="list-unstyled">
                            {filteredCities.length > 0 ? (
                              filteredCities.map((item) => (
                                <li key={item.valueHash}>
                                  <Radio value={item.valueHash}>{item.displayText}</Radio>
                                </li>
                              ))
                            ) : (
                              <li>Şəhər tapılmadı</li>
                            )}
                          </ul>
                        )}
                      </div>
                    </Radio.Group>
                  </Form.Item>
                </Form>


              </Panel>
            </Collapse>
          </div>

          {/* İkinci panel */}
          <div className="col-md-6 col-lg-3 mb-3">
            <Collapse expandIconPosition="end" defaultActiveKey={["2"]}>
              <Panel
                header={
                  <div className="d-flex align-items-center">
                    <img src={Images.FiTag2} alt="Brand Icon" className="me-2" />
                    <span>Şəhər</span>
                  </div>
                }
                key="2"
              >
                <Form form={form} initialValues={{ regionId: "0" }}>
                  <Input
                    placeholder="Şəhər axtar..."
                    className="mb-2"
                    value={searchRegionTerm}
                    onChange={(e) => setSearchRegionTerm(e.target.value)}
                  />

                  <Form.Item name="regionId">
                    <Radio.Group onChange={(e) => handleRegionChange(e.target.value)}>
                      <div
                        style={{
                          maxHeight: "200px",
                          minHeight: "200px",
                          overflowY: "auto",
                          minWidth: "269px",
                          width: "100%",
                        }}
                      >
                        {loading ? (
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "rgba(255, 255, 255, 0.7)",
                              zIndex: 9999,
                            }}
                          >
                            <Spin size="large" />
                          </div>
                        ) : (
                          <ul className="list-unstyled">
                            {/* ✅ “Hamısı” seçimi */}
                            {selectedCity && selectedCity !== "0" && (
                              <li>
                                <Radio value="0">Hamısı</Radio>
                              </li>
                            )}


                            {/* ✅ Şəhərlər listesi */}
                            {filteredRegion.length > 0 ? (
                              filteredRegion.map((item) => (
                                <li key={item.valueHash}>
                                  <Radio value={item.valueHash}>{item.displayText}</Radio>
                                </li>
                              ))
                            ) : (
                              <li>Şəhər tapılmadı</li>
                            )}
                          </ul>
                        )}
                      </div>
                    </Radio.Group>
                  </Form.Item>
                </Form>

              </Panel>
            </Collapse>
          </div>

          {/* Arama alanı */}
          <div className="col-lg-6 mb-3">
            <div className="d-flex align-items-center mt-3">
              <img src={Images.FiTag2} alt="Brand Icon" className="me-2" />
              <span>Kod\Başlıq</span>
            </div>
            <Input.Group compact className="mb-2 mt-3 d-flex">
              <Input
                placeholder="Şəhər axtar..."
                className="position-relative flex-grow-1"
                style={{ minHeight: "50px" }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              {/* <Button className='ms-2' type="primary" style={{ minHeight: "50px" }}>Axtar</Button> */}
            </Input.Group>
            <div className="d-flex mt-4">
              <input type="checkbox" style={{ width: "24px" }} />
              <p className='fs-18 fw-600 ms-3 mb-0'>Səbətdəki məhsullar</p>
            </div>
          </div>
        </div>
        <div className="row mt-5">
          <UserListTable selectedCity={selectedCity} selectedRegion={selectedRegion} searchText={searchText} />
        </div>
      </div >
    </>
  )
}

export default Plasiyer;