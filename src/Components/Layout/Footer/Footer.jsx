import './footer.css'
import Images from '../../../Assets/images/js/Images'
import {Link} from "react-router-dom";
import { FaPhoneAlt , FaInstagram ,  FaWhatsapp} from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { FiFacebook } from "react-icons/fi";
import { LuTwitter } from "react-icons/lu";
import { useTranslation } from 'react-i18next';

export const Footer = () => {
    let { footer } = Images
    const { t } = useTranslation();

    return (
        <>
            <div className="footer c143 text-white  mt-5">
                <div className="Container mb-5">
                    <div className="myRow">
                        <div className="row">
                            <div className="col-lg-3 pe-5 col-md-6">
                                <div className="icon">
                                    <Link to={'/'}>
                                        <img src={footer} alt=""/>
                                    </Link>
                                </div>
                                <div className="text">
                                    <p>Lorem ipsum dolor sit amet consectetur. Arcu lorem lectus elit egestas.
                                        Suspendisse nunc
                                        amet at lobortis.</p>
                                </div>
                            </div>
                            <div className="col-lg-3 pe-5 col-md-6">
                                <div className="heading my-4 ">{t("Footer.contact")}</div>
                                <div className="contact-item align-items-center mb-4 d-flex">
                                    <div className="icon">
                                        <FaPhoneAlt size={'16px'}	/>
                                    </div>
                                    <a className={'nav-link text-white ms-3'} href="">
                                        {/* Telefon Nomresi */}
                                        {t("Footer.phone")}
                                        05523243434
                                    </a>
                                </div>
                                <div className="contact-item align-items-center mb-4 d-flex">
                                    <div className="icon">
                                        <MdOutlineMail  size={'16px'} />
                                    </div>
                                    <a className={'nav-link text-white ms-3'} href="">
                                        {/* Mail */}
                                        {t("Footer.mail")}
                                        Tale@matsoftware.com</a>
                                </div>
                                <div className="contact-item align-items-center mb-4 d-flex">
                                    <div className="icon">
                                        <IoLocationOutline  size={'16px'}/>
                                    </div>
                                    <a className={'nav-link text-white ms-3'} href="">
                                        {/* Location */}
                                        {t("Footer.location")}
                                        <br />
                                        Lorem ipsum dolor sit amet
                                    </a>
                                </div>
                            </div>
                            <div className="col-lg-3 pe-5 col-md-6">
                                <div className="heading my-4 ">{t("Footer.we")}</div>
                                <div className="text">
                                    <p>Lorem ipsum dolor sit amet consectetur. Arcu lorem lectus elit egestas. Suspendisse nunc
                                        amet at lobortis.</p>
                                </div>
                            </div>
                            <div className="col-lg-3 pe-5 col-md-6">
                                <div className="heading my-4 ">{t("Footer.information")}</div>
                                <div className="social-icons w-75 justify-content-between d-flex mt-3">
                                    <a href={''} target={'_blank'} className="social-icon-item"><FiFacebook/></a>
                                    <a href={''} target={'_blank'} className="social-icon-item"><LuTwitter/></a>
                                    <a href={''} target={'_blank'} className="social-icon-item"><FaWhatsapp/></a>
                                    <a href={''} target={'_blank'} className="social-icon-item"><FaInstagram/></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
