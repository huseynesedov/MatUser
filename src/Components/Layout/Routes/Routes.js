import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "../../Pages/Home";
import Plasiyer from "../../Pages/Home/Plasiyer/plasiyer";


import Profile from "../../Pages/Profile";
import BusinesProfil from "../../Pages/BusinessProfile";

import Basket from "../../Pages/Basket/index";
import Detail from "../../Pages/ProductDetail/index";

import Orders from "../../Pages/Orders";
import OrderDetail from "../../Pages/OrdersDetail/detail";

import Return from "../../Pages/Return";
import ListPage from "../../Pages/Products/ListPage";
import { useAuth } from "../../../AuthContext";


const RouteList = () => {
    const { roleId } = useAuth();



    const RestrictedRoute = ({ element, allowedTypes }) => {
        if (!allowedTypes.includes(roleId)) {
            return <>
                <div className="container d-flex align-items-center justify-content-center mt-5">
                 Sizin bu seyfeye girisiniz baglidir!!!
                </div>
            </>;
        }
        return element;
    };

    return <div style={{
        minHeight: '100vh',
        width: "100%"
    }}>
        <Routes>
            <Route path="/$customer/*">
                <Route index element={<Home />} />
                <Route path="products" element={<ListPage />} />
                <Route path="profile" element={<Profile />} />
                <Route path="Orders" element={<Orders />} />
                <Route path="BusinesProfil" element={<BusinesProfil />} />
                <Route path="Basket" element={<Basket />} />
                <Route path="Return" element={<Return />} />
                <Route path="detail/:id" element={<Detail />} />
                <Route path="Orders/OrderDetail/:id" element={<OrderDetail />} />
            </Route>

            <Route path="/$salesman/*">
                <Route index element={<Plasiyer />} />
                <Route path="products" element={<ListPage />} />
                <Route path="Orders" element={<Orders />} />
                <Route path="BusinesProfil" element={<BusinesProfil />} />
                <Route path="Basket" element={<Basket />} />
                <Route path="SalesmanBasket" element={<Basket />} />
                <Route path="Return" element={<Return />} />
                <Route path="detail/:id" element={<Detail />} />
                <Route path="Orders/OrderDetail/:id" element={<OrderDetail />} />
            </Route>


            <Route path="/$customer/*">
                <Route path="*" element={<RestrictedRoute element={<Home />} allowedTypes={['customer']} />} />
            </Route>

            <Route path="/$salesman/*">
                <Route path="*" element={<RestrictedRoute element={<Plasiyer />} allowedTypes={['salesman']} />} />
            </Route>
        </Routes>
    </div>
}

export default RouteList
