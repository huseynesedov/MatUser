import React , { useEffect } from 'react';
import RouteList from './Components/Layout/Routes/Routes';
import Layout from './Components/Layout/MainLayout/Layout';
import Login from './Components/Pages/Login/Login';
import { AuthProvider, useAuth } from './AuthContext';
import SkeletonScreen from './Loader/index';
import  {Spin} from 'antd'
import {AccountApi} from "./api/account.api";
function App() {
  const { loggedIn, loading , loginLoading , logout , getPermissions } = useAuth();

  if (loading) {
    return <SkeletonScreen />;
  }


  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(()=>{
    updateToken()
  }, [])


  const decodeJwt = (token) => {
    try {
      const payloadBase64 = token.split(".")[1]; // Token-in ikinci hissəsi payload hissəsidir
      const decodedPayload = atob(payloadBase64); // Base64 formatından decode edirik
      return JSON.parse(decodedPayload); // JSON formatına çeviririk
    } catch (error) {
      console.error("Token decoding error:", error); // Hata varsa konsolda göstəririk
      return null;
    }
  };


  const updateToken = () => {
    let t = localStorage.getItem('token')
    let dec = decodeJwt(t)
    let timeout = (dec?.exp - dec?.iat - 120) * 100
    getPermissions()
    setInterval(()=>{
      if(loggedIn) {
        return AccountApi.RefreshToken({
          refreshToken:localStorage.getItem('refreshToken')
        }).then((response)=>{
          console.log(response);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('token', response.accessToken);
        }).catch(()=>{
          logout()
        })
      }
      else{
        return;
      }
    }, timeout)
  }





  return (
    <>
      {loggedIn ? (
        <Layout>
          <RouteList />
        </Layout>
      ) : (
          <Spin  spinning={loginLoading} tip="Loading...">
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
