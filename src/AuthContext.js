import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountApi } from "./api/account.api";
import { notification } from 'antd';
import { CatalogApi } from "./api/catalog.api";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [returnData, setReturnData] = useState({});
  const [permissions, setPermissions] = useState([]);
  const [roleId, setRoleId] = useState(null);
  const navigate = useNavigate();

  const openNotification = (message, description, error) => {
    if (error) {
      notification.error({ message, description, placement: 'bottomRight' });
    } else {
      notification.info({ message, description, placement: 'bottomRight' });
    }
  };

  useEffect(() => {
    // 🔑 Login durumunu kontrol et
    const storedLoggedIn = localStorage.getItem("loggedIn");
    if (storedLoggedIn) {
      setLoggedIn(JSON.parse(storedLoggedIn));
    } else {
      setLoggedIn(false);
    }

    // 🔑 Permissions & timestamp kontrolü
    const storedPermissions = localStorage.getItem("permissions");
    const storedFetchedAt = localStorage.getItem("permissionsFetchedAt");

    if (storedPermissions) {
      try {
        setPermissions(JSON.parse(storedPermissions));
      } catch {
        localStorage.removeItem("permissions");
      }
    }

    // 🚀 2 gün kontrolü (timestamp yoksa veya süresi dolmuşsa API çağır)
    const now = Date.now();
    const twoDays = 2 * 24 * 60 * 60 * 1000;

    if (!storedFetchedAt || now - parseInt(storedFetchedAt, 10) >= twoDays) {
      getPermissions();
    }

    setLoading(false);
  }, []);


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

  const handleLogin = (apiMethod, data) => {
    setLoginLoading(true);

    apiMethod(data)
      .then((res) => {
        setLoading(true);
        setLoggedIn(true);
        localStorage.setItem('loggedIn', true);
        localStorage.setItem('token', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        openNotification('Giriş uğurlu!', 'Xoş gəldiniz!', false);

        const decodedToken = decodeJwt(res.accessToken);
        let userRole = decodedToken.UserTypeCode;
        let userRole2 = decodedToken.UserTypeCode;

        userRole = userRole.replace(/^\$/, '').toLowerCase();

        setRoleId(userRole);
        localStorage.setItem('roleId', userRole);
        localStorage.setItem('role', userRole2);

        getPermissions().then(() => {
          navigate(`/${userRole}`);
        });
      })
      .catch((error) => {
        setLoading(false);
        setLoggedIn(false);
        setLoginLoading(false);
        openNotification('Xəta baş verdi', error.response?.data?.message || 'Bilinməyən xəta', true);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        setLoginLoading(false);
      });
  };

  const login = (userCode, customerCode, passwordHash) => {
    handleLogin(AccountApi.Login, { userCode, customerCode, passwordHash });
  };

  const Salesmanlogin = (userCode, passwordHash) => {
    handleLogin(AccountApi.SalesmanLogin, { userCode, passwordHash });
    localStorage.removeItem("permissions");
    localStorage.removeItem("permissionsFetchedAt");
  };

  const getPermissions = async () => {
    try {
      const storedPermissions = localStorage.getItem("permissions");
      const lastFetched = localStorage.getItem("permissionsFetchedAt");

      // 2 gün kontrolü
      const now = Date.now();
      const twoDays = 2 * 24 * 60 * 60 * 1000; // 48 saat ms


      if (storedPermissions && lastFetched && now - parseInt(lastFetched, 10) < twoDays) {
        const parsed = JSON.parse(storedPermissions);
        setPermissions(parsed);
        return parsed; // 🚀 cache dön
      }


      const loggedIn = localStorage.getItem("loggedIn");
      const roleID = localStorage.getItem("roleId");
      const role = localStorage.getItem("role");
      if (loggedIn !== "true" || (roleID === "salesman" && role === "$Salesman")) {
        setPermissions([]);
        return [];
      }

      // API'den çek
      const res = await CatalogApi.GetUserAccessibleModules();

      const newPermissions = JSON.stringify(res);
      const oldPermissions = storedPermissions || "";

      // 🚀 Gelen data farklıysa güncelle
      if (newPermissions !== oldPermissions) {
        localStorage.setItem("permissions", newPermissions);
        localStorage.setItem("permissionsFetchedAt", now.toString());
        setPermissions(res);
      } else {
        // aynıysa permissions’u state’e bas ama storage timestamp güncelle
        localStorage.setItem("permissionsFetchedAt", now.toString());
        setPermissions(JSON.parse(oldPermissions));
      }

      return res;
    } catch (error) {
      setPermissions([]);
      setLoggedIn(false);
      openNotification(
        "Xəta baş verdi",
        error.response?.data?.message || "Bilinməyən xəta",
        true
      );
      return [];
    }
  };



  const logout = () => {
    setLoggedIn(false);

    const role = localStorage.getItem("role");     // örn: "$Customer" / "$Salesman"
    const roleId = localStorage.getItem("roleId"); // örn: "customer"

    // role & roleId'ye göre permissions silme/silme kontrolü
    if (role === "$Customer" && roleId === "customer") {
    } else if (role === "$Salesman" && roleId === "customer") {
      // ✅ permissions sil
      localStorage.removeItem("permissions");
      localStorage.removeItem("permissionsFetchedAt");
    } else if (role === "$Salesman" && roleId === "salesman") {
      localStorage.removeItem("permissions");
      localStorage.removeItem("permissionsFetchedAt");
    }

    // her durumda diğerlerini temizle
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("roleId");
    localStorage.removeItem("role");
    localStorage.removeItem("refreshToken");

    // state de sıfırlansın
    setPermissions([]);
    setRoleId(null);
  };

  const salesmanPage = () => {

    localStorage.removeItem("permissions");
    localStorage.removeItem("permissionsFetchedAt");
    localStorage.setItem("roleId", "salesman");


  };


  const updateReturnData = (d) => {
    setReturnData(d);
  };

  return (
    <AuthContext.Provider
      value={{
        permissions,
        getPermissions,
        salesmanPage,
        loggedIn,
        loading,
        loginLoading,
        login,
        Salesmanlogin,
        logout,
        openNotification,
        updateReturnData,
        returnData,
        roleId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
