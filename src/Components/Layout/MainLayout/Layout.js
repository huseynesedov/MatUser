import { useLocation } from "react-router-dom";
import Header from "../Header/Header";
import { Footer } from "../Footer/Footer";

const Layout = (props) => {
    const location = useLocation();

    // Header'ın görünmesini istemediğin pathler
    const noHeaderPaths = ["/salesman", "/login"];

    const hideHeader = noHeaderPaths.includes(location.pathname);

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
