import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "../../Pages/Home";
import Plasiyer from "../../Pages/Home/Plasiyer/plasiyer";

import Profile from "../../Pages/Profile";
import BusinesProfil from "../../Pages/BusinessProfile";
import Detail from "../../Pages/ProductDetail/index";
import Orders from "../../Pages/Orders";
import OrderDetail from "../../Pages/OrdersDetail/detail";
import Return from "../../Pages/Return";
import ListPage from "../../Pages/Products/ListPage";
import Basket from "../../Pages/Basket/index";
import BasketSalesman from "../../Pages/BasketSalesman";
import BasketSalesmanCustomer from "../../Pages/BasketSalesmanCustomer";

const RouteList = () => {
    const role = localStorage.getItem("role"); // $Customer veya $Salesman

    const RestrictedRoute = ({ element, allowedRoles }) => {
        if (!allowedRoles.includes(role)) {
            return (
                <div className="container d-flex align-items-center justify-content-center mt-5">
                    Bu səyfəyə giriş icazəniz yoxdur!
                </div>
            );
        }
        return element;
    };

    return (
        <div style={{ minHeight: "100vh", width: "100%" }}>
            <Routes>
                {/* CUSTOMER ROUTES */}
                <Route path="/customer/*">
                    <Route index element={<Home />} />
                    <Route path="products" element={<ListPage />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="Orders" element={<Orders />} />
                    <Route path="BusinesProfil" element={<BusinesProfil />} />
                    <Route path="Basket" element={<Basket />} />
                    <Route path="SalesmanBasket" element={<BasketSalesman />} />
                    <Route path="salesmanCustomer" element={<BasketSalesmanCustomer />} />
                    <Route path="Return" element={<Return />} />
                    <Route path="detail/:id" element={<Detail />} />
                    <Route path="Orders/OrderDetail/:id" element={<OrderDetail />} />
                </Route>

                {/* SALESMAN ROUTES → sadece $Salesman erişebilir */}
                <Route path="/salesman/*">
                    <Route
                        index
                        element={
                            <RestrictedRoute element={<Plasiyer />} allowedRoles={["$Salesman"]} />
                        }
                    />
                    <Route
                        path="products"
                        element={<RestrictedRoute element={<ListPage />} allowedRoles={["$Salesman"]} />}
                    />
                    <Route
                        path="Orders"
                        element={<RestrictedRoute element={<Orders />} allowedRoles={["$Salesman"]} />}
                    />
                    <Route
                        path="BusinesProfil"
                        element={<RestrictedRoute element={<BusinesProfil />} allowedRoles={["$Salesman"]} />}
                    />

                    <Route
                        path="SalesmanBasket"
                        element={<RestrictedRoute element={<BasketSalesman />} allowedRoles={["$Salesman"]} />}
                    />
                    <Route
                        path="salesmanCustomer"
                        element={<RestrictedRoute element={<BasketSalesmanCustomer />} allowedRoles={["$Salesman"]} />}
                    />
                    <Route
                        path="Return"
                        element={<RestrictedRoute element={<Return />} allowedRoles={["$Salesman"]} />}
                    />
                    <Route
                        path="detail/:id"
                        element={<RestrictedRoute element={<Detail />} allowedRoles={["$Salesman"]} />}
                    />
                    <Route
                        path="Orders/OrderDetail/:id"
                        element={<RestrictedRoute element={<OrderDetail />} allowedRoles={["$Salesman"]} />}
                    />
                </Route>
            </Routes>
        </div>
    );
};

export default RouteList;
