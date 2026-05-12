import Header from "../Header/Header";
import { Footer } from "../Footer/Footer";

const Layout = (props) => {
    return (
        <div className="rooot">
            {/* {!hideHeader && <Header />}
            {props.children}
            {!hideHeader && <Footer />} */}

            <Header />
            {props.children}
            <Footer />

        </div>
    );
};

export default Layout;
