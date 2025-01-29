import { Button, Form } from "react-bootstrap";
import Images from "../../../Assets/images/js/Images";
import "./login.scss"
import { useAuth } from "../../../AuthContext";
import {useState} from "react";
const Login = () => {
    let { Logo, Ellipse,CarAccessories } = Images
    const { login } = useAuth();

    const [userCode , setUserCode] =  useState()
    const [customerCode , setCustomerCode] =  useState()
    const [password , setPassword] =  useState()

    return <>
        <div className="container-fluid vh-100">
            <div className="row h-100">
                <div className="col-6">
                    <div className="d-flex flex-column ms-5 mt-5">
                        {/* Logo */}
                        <div className="col">
                            <img src={Logo} alt="" />
                        </div>
                        {/* etiketler */}
                        <div className="col">
                            <p className="f-24 text-44 mt-4">
                                Hey! Xos Geldin
                            </p>

                            <p className="f-20 t-8F mt-2">
                                Xahiş edirəm, məlumatlarınızı daxil edin.
                            </p>
                        </div>
                        {/* Form */}
                        <div className="col mt-5" style={{ width: "537px" }}>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Müşteri kodu</Form.Label>
                                    <Form.Control onChange={(e)=>{
                                        setCustomerCode(e.target.value)
                                    }} type="text" placeholder="" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Kullanici Kodu</Form.Label>
                                    <Form.Control onChange={(e)=>{
                                        setUserCode(e.target.value)
                                    }}  type="text" placeholder="" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Şifrə</Form.Label>
                                    <Form.Control onChange={(e)=>{
                                        setPassword(e.target.value)
                                    }}  type="password" placeholder="****" />
                                </Form.Group>
                                <Form.Group className="mb-3 mt-2" controlId="formBasicCheckbox">
                                    <Form.Check type="checkbox" label="Kendi Tarayicimda Devam Etmek Istiyorum" />
                                </Form.Group>

                                <Button onClick={()=>{
                                    login(userCode , customerCode , password)
                                }} variant="primary w-100 mt-4 rounded-pill" type="submit">
                                    Giriş
                                </Button>
                        </div>
                    </div>
                </div>
                <div className="col-6 d-flex align-items-center justify-content-center shadow-lg bg-sh-primary position-relative" >
                    <img src={Ellipse} className="position-absolute top-0 end-0" alt="" />

                    <div className="col-1 d-flex align-items-center  bg-white rounded" style={{ width: "500px", height: "334px" }}>
                        <div className="col ms-4 d-flex flex-column  justify-content-center">
                            <p className="col-7  f_34 fb-600 t_18">"Avtomobil Təchizatı Satışı"</p>
                            <p className="col-6 mt-4 f_24 t_71">Avtomobiliniz üçün ən yaxşı təchizatı tapın!</p>
                        </div>
                            <img  className="position-absolute Car_absolute" src={CarAccessories} alt="" />
                    </div>

                </div>
            </div>
        </div>
    </>
}

export default Login;
