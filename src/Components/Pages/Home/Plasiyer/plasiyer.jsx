import React, { useEffect, useState } from 'react'
import UserListTable from './Components/table'
import { Collapse, Input, Form, Radio, Spin } from "antd";
import Images from '../../../../Assets/images/js/Images';
import { BaseApi } from '../../../../const/api';
const { Panel } = Collapse;

const Plasiyer = () => {
  const [form] = Form.useForm();

  // City
  const [city, setCity] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [loadingCity, setLoadingCity] = useState(false);

  // Region
  const [region, setRegion] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [searchRegionTerm, setSearchRegionTerm] = useState("");
  const [loadingRegion, setLoadingRegion] = useState(false);

  // Search
  const [searchText, setSearchText] = useState("");
  const [basket, setBasket] = useState(false);


  // Şehirleri yükle (sayfa açılışında bir kez)
  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCity(true);
      try {
        const cityResponse = await BaseApi.get("/catalog/v1/City/GetCityListByCustomer");
        if (Array.isArray(cityResponse)) setCity(cityResponse);
        else console.error("Invalid city response:", cityResponse);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingCity(false);
      }
    };
    fetchCities();
  }, []);

  // Şehre bağlı olarak regionları yükle
  useEffect(() => {
    if (!selectedCity) {
      setRegion([]);
      setSelectedRegion(null);
      return;
    }

    const fetchRegions = async () => {
      setLoadingRegion(true);
      try {
        const regionResponse = await BaseApi.post("/catalog/v1/City/GetDistrictListByCityId", { cityIdHash: selectedCity });
        if (Array.isArray(regionResponse)) setRegion(regionResponse);
        else console.error("Invalid region response:", regionResponse);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingRegion(false);
      }
    };
    fetchRegions();
  }, [selectedCity]);

  // City filtre
  const filteredCities = city.filter(item =>
    (item.displayText || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCityChange = (value) => {
    setSelectedCity(value);
    setSelectedRegion(null); // city değişince region sıfırlansın
    form.setFieldsValue({ manufacturerId: value, regionId: null });
  };

  // Region filtre
  const filteredRegion = region.filter(item =>
    (item.displayText || "").toLowerCase().includes(searchRegionTerm.toLowerCase())
  );

  const handleRegionChange = (value) => {
    setSelectedRegion(value);
    form.setFieldsValue({ regionId: value });
  };

  return (
    <div className="container mt-5">
      <div className="row">
        {/* City Panel */}
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
                    <div style={{
                      maxHeight: "200px",
                      minHeight: "200px",
                      overflowY: "auto",
                      minWidth: "269px",
                      width: "100%",
                      position: "relative"
                    }}>
                      {loadingCity && (
                        <div style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(255,255,255,0.7)",
                          zIndex: 10
                        }}>
                          <Spin size="large" />
                        </div>
                      )}

                      <ul className="list-unstyled">
                        {filteredCities.length > 0 ? (
                          filteredCities.map(item => (
                            <li key={item.valueHash}>
                              <Radio value={item.valueHash}>{item.displayText}</Radio>
                            </li>
                          ))
                        ) : (
                          <li>Şəhər tapılmadı</li>
                        )}
                      </ul>
                    </div>
                  </Radio.Group>
                </Form.Item>
              </Form>
            </Panel>
          </Collapse>
        </div>

        {/* Region Panel */}
        <div className="col-md-6 col-lg-3 mb-3">
          <Collapse expandIconPosition="end" defaultActiveKey={["2"]}>
            <Panel
              header={
                <div className="d-flex align-items-center">
                  <img src={Images.FiTag2} alt="Brand Icon" className="me-2" />
                  <span>Rayon</span>
                </div>
              }
              key="2"
            >
              <Form form={form} initialValues={{ regionId: null }}>
                <Input
                  placeholder="Rayon axtar..."
                  className="mb-2"
                  value={searchRegionTerm}
                  onChange={(e) => setSearchRegionTerm(e.target.value)}
                />

                <Form.Item name="regionId">
                  <Radio.Group onChange={(e) => handleRegionChange(e.target.value)}>
                    <div style={{
                      maxHeight: "200px",
                      minHeight: "200px",
                      overflowY: "auto",
                      minWidth: "269px",
                      width: "100%",
                      position: "relative"
                    }}>
                      {loadingRegion && (
                        <div style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(255,255,255,0.7)",
                          zIndex: 10
                        }}>
                          <Spin size="large" />
                        </div>
                      )}

                      <ul className="list-unstyled">
                        {selectedCity && selectedCity !== "0" && (
                          <li><Radio value="0">Hamısı</Radio></li>
                        )}

                        {filteredRegion.length > 0 ? (
                          filteredRegion.map(item => (
                            <li key={item.valueHash}>
                              <Radio value={item.valueHash}>{item.displayText}</Radio>
                            </li>
                          ))
                        ) : (
                          <li>Rayon tapılmadı</li>
                        )}
                      </ul>
                    </div>
                  </Radio.Group>
                </Form.Item>
              </Form>
            </Panel>
          </Collapse>
        </div>

        {/* Search Input */}
        <div className="col-lg-6 mb-3">
          <div className="d-flex align-items-center mt-3">
            <img src={Images.FiTag2} alt="Brand Icon" className="me-2" />
            <span>Kod\Başlıq</span>
          </div>
          <Input.Group compact className="mb-2 mt-3 d-flex">
            <Input
              placeholder="Axtar..."
              className="position-relative flex-grow-1"
              style={{ minHeight: "50px" }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Input.Group>
          <div className="d-flex mt-4">
            <input
              type="checkbox"
              style={{ width: "24px" }}
              checked={basket}
              onChange={(e) => setBasket(e.target.checked)}
            />

            <p className='fs-18 fw-600 ms-3 mb-0'>Səbətdəki məhsullar</p>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <UserListTable
          selectedCity={selectedCity}
          selectedRegion={selectedRegion}
          searchText={searchText}
          basket={basket}
        />
      </div>
    </div>
  )
}

export default Plasiyer;
