import { Link } from "react-router-dom";

import { BrandInfo } from "./brandInfo";

const BrandExpo = () => {
    return <>

        {BrandInfo.map((Brand) => (
            <div className="col-2" key={Brand.id}>
                <Link to={Brand.Brend_Url}>
                    <div className="rounded-circle border d-flex align-items-center justify-content-center" style={{ width: "122px", height: "122px" }}>
                        <img src={Brand.Brend_img} alt="" className="w-90" style={{ width: "80%" }} />
                    </div>
                </Link>
            </div>
        ))}

    </>
}

export default BrandExpo;
