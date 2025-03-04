import { useState } from 'react';

import { Modal, Button } from 'react-bootstrap';
import { Rating } from 'primereact/rating';
import { Products } from './Product';

import Images from '../../../../Assets/images/js/Images';

const Item = () => {
    let { FiTag, ModalClose } = Images

    const [show, setShow] = useState(false);
    const [val2, setVal2] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return <>

        {Products.map((user) => (

            <div key={user.id} className="col-4 border rounded" style={{ width: "366px" }}>
                <div className="row">
                    <div className="col d-flex align-items-center justify-content-center">
                        <img src={user.Brend_img} className="mt-4" style={{ width: "144px", height: "136px" }} alt="" />
                    </div>
                </div>
                <div className="row mt-4 ">
                    <div className="col TagNo d-flex aligin-items-center">
                        <img src={FiTag} alt="" />
                        <span className="black-4">{user.Brend_NO}</span>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col">
                        <p style={{ fontSize: "15px", color: "#797979" }}>
                            <b className="black-4" style={{ fontSize: "16px !important" }}>
                                {user.Brend_Name}
                            </b>
                            {user.Brend_Title}
                        </p>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col">
                        <p style={{ color: "#797979", fontSize: "12px", marginLeft: "5px" }}>
                            Təslim edilən tarix : {user.Date}
                        </p>
                    </div>
                </div>

                <div className="row mt-4 mb-4">
                    <div className="col d-flex align-items-center justify-content-center">
                        <button className="ProductEvaluate" onClick={handleShow}>
                            Məhsulu Dəyərləndir
                        </button>
                    </div>
                </div>


                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    aria-labelledby="contained-modal-title-vcenter"
                    
                >
                    <div className="Container">
                        <div className="row">
                            <div className="col mt-3">
                                <span style={{ fontSize: "18px", fontWeight: "500" }}>
                                    Məhsulu Dəyərləndir
                                </span>
                            </div>
                            <div className="col mt-3 d-flex justify-content-end">
                                <div className="x" onClick={handleClose}>
                                    <img src={ModalClose} alt="" />
                                </div>
                            </div>

                            <div className="row">

                                <div className="row d-flex flex-column" style={{ marginLeft: "3px" }}>
                                    <div className="col d-flex mt-4 mb-3" >
                                        <div className="col-2 " style={{ width: "94px", height: "84px" }}>
                                            <img src={user.Brend_img} className=" w-100 h-100" alt="" />
                                        </div>
                                        <div className="col-7 d-flex align-items-center" style={{ marginLeft: "20px" }}>
                                            <p style={{ fontSize: "15px", color: "#797979" }}>
                                                <b className="black-4" style={{ fontSize: "16px !important" }}>
                                                    {user.Brend_Name}
                                                </b>
                                                {user.Brend_Title}
                                            </p>
                                        </div>
                                    </div>

                                </div>

                                <Modal.Header>
                                </Modal.Header>

                                <div className="row d-flex align-items-center mt-3">
                                    <div className="col-5  d-flex align-items-center" style={{ marginLeft: "15px" }}>

                                        <p style={{ fontSize: "14px", fontWeight: "400" }}>
                                            Məhsulu Dəyərləndir
                                        </p>
                                    </div>
                                    <div className="col-5 d-flex align-items-center mb-1" style={{ marginLeft: "-30px" }}>
                                        <Rating value={val2} cancel={false} onChange={(e) => setVal2(e.value)} />
                                    </div>
                                </div>
                                <div className="row mt-4" style={{ marginLeft: "3px" }}>
                                    <div className="col">
                                        <label htmlFor="exampleFormControlTextarea1">Şərhiniz </label>
                                        <textarea class="form-control mt-2 ModalTextarea" id="exampleFormControlTextarea1" placeholder="Şərhiniz">

                                        </textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Modal.Footer className="mt-4">
                        <Button className="ModalClose" onClick={handleClose}>
                            Bağla
                        </Button>
                        <Button className="ModalSend" onClick={handleClose}>
                            Göndər
                        </Button>
                    </Modal.Footer>
                </Modal>



            </div>
        ))}
        

    </>
}

export default Item;












