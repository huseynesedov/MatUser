import React, { useEffect } from 'react';
import RouteList from './Components/Layout/Routes/Routes';
import Layout from './Components/Layout/MainLayout/Layout';
import Login from './Components/Pages/Login/Login';
import { AuthProvider, useAuth } from './AuthContext';
import SkeletonScreen from './Loader/customerLoading';
import { Spin } from 'antd'
import { AccountApi } from "./api/account.api";

function App() {
  const { loggedIn, loading, loginLoading, logout, getPermissions } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

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

    if (localStorage.getItem("loggedIn") !== "true") {
      return;
    }

    let t = localStorage.getItem("token");
    let dec = decodeJwt(t);
    if (!dec) return;

    let timeout = (dec?.exp - dec?.iat - 120) * 100;

    getPermissions();

    const refreshInterval = setInterval(() => {
      if (localStorage.getItem("loggedIn") === "true") {
        AccountApi.RefreshToken({
          refreshToken: localStorage.getItem("refreshToken"),
        })
          .then((response) => {
            console.log(response);
            localStorage.setItem("refreshToken", response.refreshToken);
            localStorage.setItem("token", response.accessToken);
          })
          .catch(() => {
            logout();
            clearInterval(refreshInterval);
          });
      } else {
        clearInterval(refreshInterval);
      }
    }, timeout);

    return () => clearInterval(refreshInterval);
  }, [loading, getPermissions, logout]);

  if (loading) {
    return <SkeletonScreen />;
  }

  return (
    <>
      {loggedIn ? (
        <Layout>
          <RouteList />
        </Layout>
      ) : (
        <Spin spinning={loginLoading} tip="Loading...">
          <Login />
        </Spin>
      )}
    </>
  );
}

export default function WrappedApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
