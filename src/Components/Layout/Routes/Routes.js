import { Route, Routes } from "react-router-dom";
import React from "react";

import Home from "../../Pages/Home";
import ListPage from "../../Pages/Products/ListPage";

import Profile from "../../Pages/Profile";
import BusinesProfil from "../../Pages/BusinessProfile";

import Basket from "../../Pages/Basket/index";
import Detail from "../../Pages/ProductDetail/index";

import Orders from "../../Pages/Orders";
import OrderDetail from "../../Pages/OrdersDetail/detail";

import Return from "../../Pages/Return";


const RouteList = () => {
    return <div style={{ minHeight: '100vh', width:"100%" }}>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ListPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/Orders" element={<Orders />} />
            <Route path="/BusinesProfil" element={<BusinesProfil />} />
            <Route path="/Basket" element={<Basket />} />
            <Route path="/Return" element={<Return />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/Orders/OrderDetail/:id" element={<OrderDetail />} />
        </Routes>
    </div>
}

export default RouteList
