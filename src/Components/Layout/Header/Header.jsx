import { Link, useLocation } from "react-router-dom";
import Images from '../../../Assets/images/js/Images';
import './nav.scss';
import React, { useState, useEffect, useRef } from "react";
import BrandList from "../../Elements/BrandList";
import { toast } from "react-toastify";
import i18n from "../../../i18n";
import { useAuth } from "../../../AuthContext";
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Dropdown } from "antd";
import { AdminApi } from "../../../api/admin.api";
import PermissionWrapper from "../../Elements/PermissionWrapper/PermissionWrapper";
import { FaArrowLeftLong } from "react-icons/fa6";

const dillerTablo = [
  { name: "AZ", code: "az", flag: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_Azerbaijan.svg" },
  { name: "EN", code: "en", flag: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg" },
  { name: "RU", code: "ru", flag: "https://upload.wikimedia.org/wikipedia/en/f/f3/Flag_of_Russia.svg" },
];

function Header() {
  const { logout, salesmanPage } = useAuth();

  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(dillerTablo[0]);
  const dropdownRef = useRef(null);

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roleId = localStorage.getItem('roleId');
  const role = localStorage.getItem('role');

  const {
    Basket,
    Heart,
    Logo,
    Voice,
    Glass,
    Clipboard,
    Vector,
    User,
    FiUser,
    Office,
    Key,
    Language,
    Return
  } = Images;

  useEffect(() => {
    if (searchParams.get('search')) {
      setTranscript(searchParams.get('search'))
    }
    const savedLanguageCode = localStorage.getItem('language');
    if (savedLanguageCode) {
      const savedLanguage = dillerTablo.find(dil => dil.code === savedLanguageCode);
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage);
        i18n.changeLanguage(savedLanguage.code);
      }
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleLanguageDropdown = (e) => {
    e.stopPropagation();
    setLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const dilChange = (dil, e) => {
    e.stopPropagation();
    setLanguageDropdownOpen(false);
    setDropdownOpen(false);
    setCurrentLanguage(dil);
    i18n.changeLanguage(dil.code);
    toast.success(dil.name);
    localStorage.setItem('language', dil.code);
  };

  const isActive = (path) => location.pathname === path;

  const [data, setData] = useState([]);
  const [decodedToken, setDecodedToken] = useState(null);
  const [idHash, setIdHash] = useState(null);

  const decodeJwt = (token) => {
    try {
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = atob(payloadBase64);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error("Token decoding error:", error);
      return null;
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      const decoded = decodeJwt(savedToken);
      setDecodedToken(decoded);
      setTimeout(() => {
        UserData(decoded?.UserIdHash);
      }, 1000);
      if (decoded) {
        setDecodedToken(decoded);
        setIdHash(decoded?.id);
      }
    }
  }, []);

  const UserData = async (idHash) => {
    if (idHash) {
      try {
        const response = await AdminApi.GetUserPersonalInformationById(idHash);
        setData({ ...response, idHash });
      } catch (error) {
        if (error.response && error.response.data.message === 2017) {
          logout();
        } else {
          console.error("Error fetching user data:", error);
        }
      }
    }
  };

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || function () { })();

  useEffect(() => {
    try {
      recognition.lang = 'az';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            setTranscript((prev) => prev + event.results[i][0].transcript);
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
      };
    } catch (e) {
      // ignore if SpeechRecognition isn't supported
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startListening = () => {
    try {
      recognition.start();
      setListening(true);
    } catch (e) { }
  };

  const stopListening = () => {
    try {
      recognition.stop();
      setListening(false);
    } catch (e) { }
  };

  const handleInputChange = (event) => {
    setSearchParams('search', event.target.value);
    setTranscript(event.target.value);
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
    setLanguageDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location]);

  const { t } = useTranslation();

  const handleSearch = () => {
    navigate(`${roleId ? roleId.toLowerCase() : ''}/products?search=${transcript}`);
    setTranscript('');
  };

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleToggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleButtonClick = () => {
    setDropdownVisible(false);
  };


  // Reuse a compact menu JSX for mobile (simplified)
  const MobileMenuContent = (
    <div className="mobile-menu-inner">
      <div className="mobile-menu-header">
        <Link to={`/${roleId ? roleId.toLowerCase() : ''}`} onClick={() => setMobileMenuOpen(false)}>
          <img src={Logo} alt="Logo" />
        </Link>
        <button className="closeMobile" onClick={() => setMobileMenuOpen(false)} aria-label="Close">✕</button>
      </div>



      <nav className="mobile-links">
        <PermissionWrapper
          topModuleCode="$USER"
          subModuleCode="$BASKET_SUB_MODULE"
          pageCode="$BASKET_DETAIL"
          rightCode="$GET"
        >
          <hr />
          <Link to={`/${roleId ? roleId.toLowerCase() : ''}/Basket`} onClick={() => setMobileMenuOpen(false)}>
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M21.4999 9.00003H20.0799L16.3679 2.50403L14.6319 3.49603L17.7769 9.00003H7.2229L10.3689 3.49603L8.6319 2.50403L4.9199 9.00003H3.4999C3.34619 9.0002 3.19459 9.03576 3.05685 9.10396C2.9191 9.17216 2.79891 9.27116 2.7056 9.3933C2.61228 9.51543 2.54834 9.65742 2.51874 9.80824C2.48914 9.95907 2.49467 10.1147 2.5349 10.263L5.3339 20.527C5.45025 20.9498 5.70201 21.3228 6.05059 21.5889C6.39918 21.8549 6.82538 21.9993 7.2639 22H17.7369C18.6349 22 19.4289 21.395 19.6669 20.525L22.4659 10.262C22.5066 10.1136 22.5124 9.95783 22.483 9.8068C22.4535 9.65577 22.3895 9.51361 22.2959 9.39141C22.2024 9.26922 22.0819 9.17031 21.9438 9.10242C21.8057 9.03452 21.6538 8.99948 21.4999 9.00003ZM17.7359 20V21V20H7.2639L4.8099 11H20.1899L17.7359 20Z"
                fill="#8F8F8F" />
              <path d="M9.5 13H11.5V18H9.5V13ZM13.5 13H15.5V18H13.5V13Z" fill="#8F8F8F" />
            </svg>
            {t("Nav.basket")}
          </Link>
          <Link to={`/${roleId ? roleId.toLowerCase() : ''}/Return`} onClick={() => setMobileMenuOpen(false)}>
            <img src={Return} alt="" />
            {t("Nav.return")}
          </Link>


          {role === "$Salesman" && (
            <Link to={`/${roleId.toLowerCase()}/SalesmanBasket`}>
              <span className="d-flex align-items-center">
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M21.4999 9.00003H20.0799L16.3679 2.50403L14.6319 3.49603L17.7769 9.00003H7.2229L10.3689 3.49603L8.6319 2.50403L4.9199 9.00003H3.4999C3.34619 9.0002 3.19459 9.03576 3.05685 9.10396C2.9191 9.17216 2.79891 9.27116 2.7056 9.3933C2.61228 9.51543 2.54834 9.65742 2.51874 9.80824C2.48914 9.95907 2.49467 10.1147 2.5349 10.263L5.3339 20.527C5.45025 20.9498 5.70201 21.3228 6.05059 21.5889C6.39918 21.8549 6.82538 21.9993 7.2639 22H17.7369C18.6349 22 19.4289 21.395 19.6669 20.525L22.4659 10.262C22.5066 10.1136 22.5124 9.95783 22.483 9.8068C22.4535 9.65577 22.3895 9.51361 22.2959 9.39141C22.2024 9.26922 22.0819 9.17031 21.9438 9.10242C21.8057 9.03452 21.6538 8.99948 21.4999 9.00003ZM17.7359 20V21V20H7.2639L4.8099 11H20.1899L17.7359 20Z"
                    fill="#8F8F8F"
                  />
                  <path d="M9.5 13H11.5V18H9.5V13ZM13.5 13H15.5V18H13.5V13Z" fill="#8F8F8F" />
                </svg>
                <span className="ms-2">{t("Nav.Salesmanbasket")}</span>
              </span>
            </Link>
          )}
          <hr />
        </PermissionWrapper>

        <PermissionWrapper
          topModuleCode="$USER"
          subModuleCode="$ORDER_SUB_MODULE"
          pageCode="$ORDER"
          rightCode="$GET"
        >
          <Link to={`/${roleId ? roleId.toLowerCase() : ''}/Orders`} onClick={() => setMobileMenuOpen(false)}>
            {t("Nav.orders")}
          </Link>
        </PermissionWrapper>

        <Link to={`/${roleId ? roleId.toLowerCase() : ''}/profile`} onClick={() => setMobileMenuOpen(false)}>
          {t("Nav.dropdown.personal")}
        </Link>

        <Link to={`/${roleId ? roleId.toLowerCase() : ''}/BusinesProfil`} onClick={() => setMobileMenuOpen(false)}>
          {t("Nav.dropdown.company")}
        </Link>



        <div className="mobile-language">
          <p>{t("Nav.dropdown.language")}</p>
          <div className="mobile-language-list">
            {dillerTablo.map((dil, idx) => (
              <button key={idx} onClick={(e) => { dilChange(dil, e); setMobileMenuOpen(false); }}>
                <span>{dil.name}</span>
                <img src={dil.flag} alt={dil.name} />
              </button>
            ))}
          </div>
        </div>
        <Link onClick={() => { logout(); setMobileMenuOpen(false); }}>
          {t("Nav.exit")}
        </Link>


        {localStorage.getItem("role") === "$Salesman" && (
          <Link to="/salesman" className="glasBar mt-3 text-white gap-2 d-inline-flex" style={{ margin: "12px 16px" }} onClick={salesmanPage}>
            <FaArrowLeftLong />
            <p className="myTitle">Geri Qayıt</p>
          </Link>
        )}
      </nav>
    </div>
  );

  const dropdownMenu = (
    <div className="d-flex flex-column basket-dropdown">
      <PermissionWrapper
        topModuleCode="$USER"
        subModuleCode="$BASKET_SUB_MODULE"
        pageCode="$BASKET_DETAIL"
        rightCode="$GET"
      >
        <Link to={`/${roleId ? roleId.toLowerCase() : ''}/Basket`}>

          <Button onClick={handleButtonClick}>
            <span className="d-flex align-items-center">
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21.4999 9.00003H20.0799L16.3679 2.50403L14.6319 3.49603L17.7769 9.00003H7.2229L10.3689 3.49603L8.6319 2.50403L4.9199 9.00003H3.4999C3.34619 9.0002 3.19459 9.03576 3.05685 9.10396C2.9191 9.17216 2.79891 9.27116 2.7056 9.3933C2.61228 9.51543 2.54834 9.65742 2.51874 9.80824C2.48914 9.95907 2.49467 10.1147 2.5349 10.263L5.3339 20.527C5.45025 20.9498 5.70201 21.3228 6.05059 21.5889C6.39918 21.8549 6.82538 21.9993 7.2639 22H17.7369C18.6349 22 19.4289 21.395 19.6669 20.525L22.4659 10.262C22.5066 10.1136 22.5124 9.95783 22.483 9.8068C22.4535 9.65577 22.3895 9.51361 22.2959 9.39141C22.2024 9.26922 22.0819 9.17031 21.9438 9.10242C21.8057 9.03452 21.6538 8.99948 21.4999 9.00003ZM17.7359 20V21V20H7.2639L4.8099 11H20.1899L17.7359 20Z"
                  fill="#8F8F8F" />
                <path d="M9.5 13H11.5V18H9.5V13ZM13.5 13H15.5V18H13.5V13Z" fill="#8F8F8F" />
              </svg>

              <span className="ms-2 basket-title">{t("Nav.basket")}</span>
            </span>
          </Button>
        </Link>
      </PermissionWrapper>
      <PermissionWrapper
        topModuleCode="$USER"
        subModuleCode="$BASKET_SUB_MODULE"
        pageCode="$RETURN_PRODUCT_CARD_DETAIL"
        rightCode="$GET"
      >
        <Link to={`/${roleId ? roleId.toLowerCase() : ''}/Return`}>
          <Button className="mt-2" onClick={handleButtonClick}>
            <span className="d-flex align-items-center">
              <img src={Return} alt="" />
              <span className="ms-2 basket-title">{t("Nav.return")}</span>
            </span>
          </Button>
        </Link>
      </PermissionWrapper>

      {role === "$Salesman" && (
        <Link to={`/${roleId.toLowerCase()}/SalesmanBasket`}>
          <Button className="mt-2" onClick={handleButtonClick}>
            <span className="d-flex align-items-center">
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21.4999 9.00003H20.0799L16.3679 2.50403L14.6319 3.49603L17.7769 9.00003H7.2229L10.3689 3.49603L8.6319 2.50403L4.9199 9.00003H3.4999C3.34619 9.0002 3.19459 9.03576 3.05685 9.10396C2.9191 9.17216 2.79891 9.27116 2.7056 9.3933C2.61228 9.51543 2.54834 9.65742 2.51874 9.80824C2.48914 9.95907 2.49467 10.1147 2.5349 10.263L5.3339 20.527C5.45025 20.9498 5.70201 21.3228 6.05059 21.5889C6.39918 21.8549 6.82538 21.9993 7.2639 22H17.7369C18.6349 22 19.4289 21.395 19.6669 20.525L22.4659 10.262C22.5066 10.1136 22.5124 9.95783 22.483 9.8068C22.4535 9.65577 22.3895 9.51361 22.2959 9.39141C22.2024 9.26922 22.0819 9.17031 21.9438 9.10242C21.8057 9.03452 21.6538 8.99948 21.4999 9.00003ZM17.7359 20V21V20H7.2639L4.8099 11H20.1899L17.7359 20Z"
                  fill="#8F8F8F"
                />
                <path d="M9.5 13H11.5V18H9.5V13ZM13.5 13H15.5V18H13.5V13Z" fill="#8F8F8F" />
              </svg>
              <span className="ms-2 basket-title">{t("Nav.Salesmanbasket")}</span>
            </span>
          </Button>
        </Link>
      )}



    </div>
  );

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };



  // PermissionWrapper.jsx
  const PermissionWrapperSalesman = ({ allowedRoles, children }) => {
    const roleId = localStorage.getItem("role");
    if (!allowedRoles.includes(roleId)) {
      return null;
    }
    return children;
  };








  return (
    <>
      <div className="Container">
        <div className="myRow border-bottom-line">
          <div className="logo_SearchBar flex-wrap">
            <div className="logo-wrap">
              <Link to={`/${roleId ? roleId.toLowerCase() : ''}`}>
                <img src={Logo} alt="Logo" className="logo-img" />
              </Link>
            </div>

            <div className="ms-2 search-wrap">
              <label htmlFor="searchBar">
                <PermissionWrapper
                  topModuleCode="$USER"
                  subModuleCode="$PRODUCT_SUB_MODULE"
                  pageCode="$PRODUCT"
                  rightCode="$GET"
                >
                  <div className="search">
                    <input
                      type="text"
                      value={transcript}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      className='searchTextBar'
                      placeholder={t("Nav.search")}
                    />
                    <div className="VoiceGlas">
                      <img
                        src={Voice}
                        onClick={listening ? stopListening : startListening}
                        alt=""
                        className={`Voice ${listening ? "active" : ""}`}
                      />
                      <div onClick={() => handleSearch()} className="cursor-pointer text-decoration-none">
                        <div className="glasBar">
                          <img src={Glass} alt="" />
                          <span className="glasText">{t("Nav.search")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </PermissionWrapper>
              </label>
            </div>
          </div>

          <div className="HiClipboardList">
            {/* Hamburger - only visible on small screens */}
            <button className="hamburger" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="22" height="2" rx="1" fill="#333" />
                <rect y="7" width="22" height="2" rx="1" fill="#333" />
                <rect y="14" width="22" height="2" rx="1" fill="#333" />
              </svg>
            </button>

            {/* Desktop icons / links */}
            <div className="desktop-controls">
              <PermissionWrapper
                topModuleCode="$USER"
                subModuleCode="$BASKET_SUB_MODULE"
                pageCode="$BASKET_DETAIL"
                rightCode="$GET"
              >
                <Dropdown
                  visible={dropdownVisible}
                  onVisibleChange={setDropdownVisible}
                  overlay={dropdownMenu}
                  placement="bottom"
                  arrow
                  trigger={['click']}
                >
                  <div>
                    <div className="ClipBoard" style={{ cursor: "p" }}>
                      <div className="basket-container">
                        <div className="basket-icon">
                          <svg width="15" height="15" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M21.4999 9.00003H20.0799L16.3679 2.50403L14.6319 3.49603L17.7769 9.00003H7.2229L10.3689 3.49603L8.6319 2.50403L4.9199 9.00003H3.4999C3.34619 9.0002 3.19459 9.03576 3.05685 9.10396C2.9191 9.17216 2.79891 9.27116 2.7056 9.3933C2.61228 9.51543 2.54834 9.65742 2.51874 9.80824C2.48914 9.95907 2.49467 10.1147 2.5349 10.263L5.3339 20.527C5.45025 20.9498 5.70201 21.3228 6.05059 21.5889C6.39918 21.8549 6.82538 21.9993 7.2639 22H17.7369C18.6349 22 19.4289 21.395 19.6669 20.525L22.4659 10.262C22.5066 10.1136 22.5124 9.95783 22.483 9.8068C22.4535 9.65577 22.3895 9.51361 22.2959 9.39141C22.2024 9.26922 22.0819 9.17031 21.9438 9.10242C21.8057 9.03452 21.6538 8.99948 21.4999 9.00003ZM17.7359 20V21V20H7.2639L4.8099 11H20.1899L17.7359 20Z"
                              fill="#8F8F8F" />
                            <path d="M9.5 13H11.5V18H9.5V13ZM13.5 13H15.5V18H13.5V13Z" fill="#8F8F8F" />
                          </svg>
                        </div>
                        <h3 className={'basket-text'}>{t("Nav.basket")}</h3>
                      </div>
                    </div>
                  </div>
                </Dropdown>
              </PermissionWrapper>

              <PermissionWrapper
                topModuleCode="$USER"
                subModuleCode="$ORDER_SUB_MODULE"
                pageCode="$ORDER"
                rightCode="$GET"
              >
                <Link className={'nav-link'} to={`/${roleId ? roleId.toLowerCase() : ''}/Orders`}>
                  <div className="ClipBoard">
                    <div className="basket-container">
                      <div className="basket-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M10.7996 2.40002C10.4813 2.40002 10.1761 2.52645 9.95108 2.7515C9.72604 2.97654 9.59961 3.28176 9.59961 3.60002C9.59961 3.91828 9.72604 4.22351 9.95108 4.44855C10.1761 4.6736 10.4813 4.80002 10.7996 4.80002H13.1996C13.5179 4.80002 13.8231 4.6736 14.0481 4.44855C14.2732 4.22351 14.3996 3.91828 14.3996 3.60002C14.3996 3.28176 14.2732 2.97654 14.0481 2.7515C13.8231 2.52645 13.5179 2.40002 13.1996 2.40002H10.7996Z"
                            fill="#8F8F8F" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M4.7998 5.99998C4.7998 5.36346 5.05266 4.75301 5.50275 4.30292C5.95284 3.85283 6.56329 3.59998 7.1998 3.59998C7.1998 4.55475 7.57909 5.47043 8.25422 6.14556C8.92935 6.82069 9.84503 7.19998 10.7998 7.19998H13.1998C14.1546 7.19998 15.0703 6.82069 15.7454 6.14556C16.4205 5.47043 16.7998 4.55475 16.7998 3.59998C17.4363 3.59998 18.0468 3.85283 18.4969 4.30292C18.9469 4.75301 19.1998 5.36346 19.1998 5.99998V19.2C19.1998 19.8365 18.9469 20.4469 18.4969 20.897C18.0468 21.3471 17.4363 21.6 16.7998 21.6H7.1998C6.56329 21.6 5.95284 21.3471 5.50275 20.897C5.05266 20.4469 4.7998 19.8365 4.7998 19.2V5.99998ZM8.3998 10.8C8.08155 10.8 7.77632 10.9264 7.55128 11.1514C7.32623 11.3765 7.1998 11.6817 7.1998 12C7.1998 12.3182 7.32623 12.6235 7.55128 12.8485C7.77632 13.0735 8.08155 13.2 8.3998 13.2H8.41181C8.73006 13.2 9.03529 13.0735 9.26033 12.8485C9.48538 12.6235 9.61181 12.3182 9.61181 12C9.61181 11.6817 9.48538 11.3765 9.26033 11.1514C9.03529 10.9264 8.73006 10.8 8.41181 10.8H8.3998ZM11.9998 10.8C11.6815 10.8 11.3763 10.9264 11.1513 11.1514C10.9262 11.3765 10.7998 11.6817 10.7998 12C10.7998 12.3182 10.9262 12.6235 11.1513 12.8485C11.3763 13.0735 11.6815 13.2 11.9998 13.2H15.5998C15.9181 13.2 16.2233 13.0735 16.4483 12.8485C16.6734 12.6235 16.7998 12.3182 16.7998 12C16.7998 11.6817 16.6734 11.3765 16.4483 11.1514C16.2233 10.9264 15.9181 10.8 15.5998 10.8H11.9998ZM8.3998 15.6C8.08155 15.6 7.77632 15.7264 7.55128 15.9514C7.32623 16.1765 7.1998 16.4817 7.1998 16.8C7.1998 17.1182 7.32623 17.4235 7.55128 17.6485C7.77632 17.8735 8.08155 18 8.3998 18H8.41181C8.73006 18 9.03529 17.8735 9.26033 17.6485C9.48538 17.4235 9.61181 17.1182 9.61181 16.8C9.61181 16.4817 9.48538 16.1765 9.26033 15.9514C9.03529 15.7264 8.73006 15.6 8.41181 15.6H8.3998ZM11.9998 15.6C11.6815 15.6 11.3763 15.7264 11.1513 15.9514C10.9262 16.1765 10.7998 16.4817 10.7998 16.8C10.7998 17.1182 10.9262 17.4235 11.1513 17.6485C11.3763 17.8735 11.6815 18 11.9998 18H15.5998C15.9181 18 16.2233 17.8735 16.4483 17.6485C16.6734 17.4235 16.7998 17.1182 16.7998 16.8C16.7998 16.4817 16.6734 16.1765 16.4483 15.9514C16.2233 15.7264 15.9181 15.6 15.5998 15.6H11.9998Z"
                            fill="#8F8F8F" />
                        </svg>
                      </div>
                      <h3 className={'basket-text'}>{t("Nav.orders")}</h3>
                    </div>
                  </div>
                </Link>
              </PermissionWrapper>

              <div ref={dropdownRef} className={`BiChevronDown ${isDropdownOpen ? 'open' : ''}`} onClick={toggleDropdown}>
                <div className="imgUser">
                  <img src={data.content} alt="" />
                </div>
                <img src={Vector} className='dropbtn' alt="" />
                {isDropdownOpen && (
                  <div className="DropDown" onClick={(e) => e.stopPropagation()}>
                    <div className="dropdown-content">
                      <Link>
                        <div className='UserCart'>
                          <div className='UserImg'>
                            <img src={data.content} alt="" />
                          </div>
                          <div className='colum'>
                            <p className='NameSurname'>{data.companyName}</p>
                            <p className='mail'>{data.companyEmail}</p>
                          </div>
                        </div>
                      </Link>
                      <PermissionWrapper
                        topModuleCode="$USER"
                        subModuleCode="$PERSONAL_INFORMATION_SUB_MODULE"
                        pageCode="$USER"
                        rightCode="$GET"
                      >
                        <Link to={`/${roleId ? roleId.toLowerCase() : ''}/profile`} className={`d-flex ${isActive(`/${roleId ? roleId.toLowerCase() : ''}/profile`) ? 'Blue' : ''}`}>

                          <div className={`d-flex ${isActive(`/${roleId ? roleId.toLowerCase() : ''}/profile`) ? 'Blue' : ''}`}>
                            <img src={FiUser} alt="" />
                            <p className='DownText'>{t("Nav.dropdown.personal")}</p>
                          </div>
                        </Link>
                      </PermissionWrapper>
                      <Link to={`/${roleId ? roleId.toLowerCase() : ''}/BusinesProfil`} className={`d-flex ${isActive(`/${roleId ? roleId.toLowerCase() : ''}/BusinesProfil`) ? 'Blue' : ''}`}>
                        <div className={`d-flex ${isActive(`/${roleId ? roleId.toLowerCase() : ''}/BusinesProfil`) ? 'Blue' : ''}`}>
                          <img src={Office} alt="" />
                          <p className='DownText'>{t("Nav.dropdown.company")}</p>
                        </div>
                      </Link>
                      <Link to={`/${roleId ? roleId.toLowerCase() : ''}/ChangePassword`} className={`d-flex ${isActive(`/${roleId ? roleId.toLowerCase() : ''}/ChangePassword`) ? 'Blue' : ''}`}>
                        <div className={`d-flex ${isActive(`/${roleId ? roleId.toLowerCase() : ''}/ChangePassword`) ? 'Blue' : ''}`}>
                          <img src={Key} alt="" />
                          <p className='DownText'>{t("Nav.dropdown.password")}</p>
                        </div>
                      </Link>
                      <div onClick={toggleLanguageDropdown} className="d-flex" style={{ padding: "12px 16px" }}>
                        <img src={Language} alt="" />
                        <p className="DownText">{t("Nav.dropdown.language")}</p>
                        <div className='ChangeLan'>
                          <p className='LanText'>{currentLanguage.name}</p>
                          <div className="LanFlag">
                            <img className="w-100" src={currentLanguage.flag} alt="" />
                          </div>
                        </div>
                      </div>
                      {isLanguageDropdownOpen && (
                        <div className="LanguageDropdown">
                          {dillerTablo.map((dil, index) => (
                            <div key={index} className="d-flex align-items-center" onClick={(e) => dilChange(dil, e)}>
                              <p className='LanOption'>{dil.name}</p>
                              <div className="LanFlag">
                                <img className="w-100" src={dil.flag} alt="" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <Link onClick={logout}>
                        <div className="upLine">
                          <p className='NameSurname up'>{t("Nav.exit")}</p>
                        </div>
                      </Link>


                      <PermissionWrapperSalesman allowedRoles={["$Salesman"]}>
                        <Link to="/salesman" className="glasBar mt-3 gap-2 d-inline-flex" onClick={salesmanPage}>
                          <FaArrowLeftLong />
                          <p className="myTitle">Geri Qayıt</p>
                        </Link>
                      </PermissionWrapperSalesman>


                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay + panel */}
      {isMobileMenuOpen && <div className="mobileOverlay" onClick={() => setMobileMenuOpen(false)} />}

      <div className={`mobileMenu ${isMobileMenuOpen ? 'open' : ''}`}>
        {MobileMenuContent}
      </div>

      {(location.pathname === '/$customer' || location.pathname === '/$customer/home' || location.pathname === '/$customer/products') && <BrandList />}
    </>
  );
}

export default Header;
