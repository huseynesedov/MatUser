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
    const storedLoggedIn = localStorage.getItem('loggedIn');
    if (storedLoggedIn) {
      setLoggedIn(JSON.parse(storedLoggedIn));
    } else {
      setLoggedIn(false);
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
        
        userRole = userRole.replace(/^\$/, '').toLowerCase();

        setRoleId(userRole);
        localStorage.setItem('roleId', userRole); 
        
       navigate(`/${userRole ? userRole.toLowerCase().replace(/^\$/, '') : ''}`);

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
  };

  const getPermissions = () => {
    CatalogApi.GetUserAccessibleModules()
      .then((res) => {
        setPermissions(res);
      })
      .catch((error) => {
        setPermissions([]);
        setLoggedIn(false);
        openNotification('Xəta baş verdi', error.response.data.message, true);
      });
  };

  const logout = () => {
    setLoggedIn(false);
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('roleId');
    localStorage.removeItem('refreshToken');
  };

  const updateReturnData = (d) => {
    setReturnData(d);
  };

  return (
    <AuthContext.Provider
      value={{
        permissions,
        getPermissions,
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
