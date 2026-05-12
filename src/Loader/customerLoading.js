import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Images from '../Assets/images/js/Images';

const BrandListSkeleton = () => {
    const dummyList = Array.from({ length: 10 }, (_, index) => index);
    const {
        Vector
    } = Images;
    return (
        <>
            <div className="Container">
                <div className="myRow border-bottom-line">
                    <div className="logo_SearchBar">
                        <Skeleton width={100} height={80} />
                        <label htmlFor="searchBar">
                            <div className="search ms-2">
                                <input type="text" className="searchTextBar" disabled />
                                <div className="VoiceGlas">
                                    <Skeleton circle={true} width={30} height={30} />
                                    <div className="glasBar bg-transparent">
                                        <Skeleton width={60} height={25} />
                                    </div>
                                </div>
                            </div>
                        </label>
                    </div>
                    <div className="HiClipboardList">
                        <div className="ClipBoard">
                            <Skeleton circle={true} width={40} height={40} />
                            <h3>
                                <Skeleton width={60} />
                            </h3>
                        </div>
                        <div className="ClipBoard">
                            <Skeleton circle={true} width={40} height={40} />
                            <h3>
                                <Skeleton width={60} />
                            </h3>
                        </div>
                        <div className="ClipBoard">
                            <Skeleton circle={true} width={40} height={40} />
                            <h3>
                                <Skeleton width={60} />
                            </h3>
                        </div>
                        <div className="BiChevronDown d-flex justify-content-between">
                            <Skeleton width={40} height={40} />
                            
                            <h3 clasName="ms-2 mt-2">
                                <Skeleton width={12} height={16} style={{ margin: '19px 0px 0px 7px' }} />
                            </h3>
                        </div>
                    </div>
                </div>
            </div>


            <div className="Container h-100">
                <div className="myRow h-auto line">
                    <div className="text-start w-100 mt-4">
                        <h3 className="font-weight-bold text-44">
                            <Skeleton width={250} />
                        </h3>
                    </div>
                    <div className="BredsSlide">
                        <div className="slider-container">
                            {/* Slider skeleton */}
                            <div className="skeleton-slider" style={{display:"flex", justifyContent:"space-between"}}>
                                {dummyList.map((_, i) => (
                                    <div key={i} className="BrandCircle d-flex">
                                        <Skeleton circle={true}  width={120} height={120} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="Container h-100">
                <div className="myRow line">
                    <div className="BrendImgCenter">
                        <div className="CenterImg">
                            <Skeleton width={689} height={315} />
                        </div>
                        <div className="CenterImg">
                            <Skeleton width={689} height={315} />
                        </div>
                    </div>
                    <div className="ShopingCartsCenterMain mt-5">
                        <div className="ShopingTextAndIcon">
                            <h2>
                                <Skeleton width={200} />
                            </h2>
                        </div>
                        <div className="">
                            <Skeleton count={5} height={150} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BrandListSkeleton;
