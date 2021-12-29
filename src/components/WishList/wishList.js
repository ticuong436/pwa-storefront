import React from 'react';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import Pagination from '@skp/components/Pagination';
import useWishList from './useWishList';
import heartIcon from 'design/dest/images/heart.svg';
import MainPageTitle from '@skp/components/MainPageTitle';
import { LIST_ITEM_PER_PAGE } from '@skp/utils/listItemPerpage';
import ItemPerPage from '@skp/components/ItemPerPage';
import ProductBox from './productBox';

const WishList = () => {
    const {
        wishList,
        error,
        loading,
        currentPage,
        totalPagesFromData,
        pageControl,
        handleFilterProduct,
        partnerType,
        totalCountItemsWishList,
        pageSize,
        setPageSize,
        refetchWishList
    } = useWishList();

    if (error && currentPage === 1 && !loading) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }

        return <div>Data Fetch Error</div>;
    }

    if (loading) {
        return <LoadingIndicator />;
    }

    if (error) {
        // NOTE: This is only meant to show WHERE you can handle
        // GraphQL errors. Not HOW you should handle it.
        return <span>Error loading WishList Component!</span>;
    }

    if (!totalPagesFromData) {
        return (
            <div>
                <span className="history-box--title">No data wish list</span>
            </div>
        );
    }

    return (
        <>
            <div className="mypage favorite-select favorite-container">
                <MainPageTitle
                    title={`My Favorite(${totalCountItemsWishList}
                    /100)`}
                />
                <div className="favorite-select-box">
                    <div className="favorite-item">
                        <a
                            className={
                                partnerType == 1
                                    ? `favorite-radio favorite-radio__service favorite-radio--active`
                                    : `favorite-radio favorite-radio__service`
                            }
                            onClick={() => handleFilterProduct(1)}
                        >
                            <span>Service</span>
                        </a>
                    </div>
                    <div className="favorite-item">
                        <a
                            className={
                                partnerType == 0
                                    ? 'favorite-radio favorite-radio--active'
                                    : 'favorite-radio'
                            }
                            onClick={() => handleFilterProduct(0)}
                        >
                            <span>Merchandise</span>
                        </a>
                    </div>
                </div>
            </div>
            <div className="result-full favorite-container shopping-home">
                {wishList.length ? (
                    <div className="result row">
                        {wishList.map(item => (
                            <div
                                className="result-item col-xl-4 col-lg-4 col-md-6 col-xs-6"
                                key={item.product.id}
                            >
                                <ProductBox
                                    product={item.product}
                                    refetchWishList={refetchWishList}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="favorite-hollow">
                        <div className="favorite-hollow-box">
                            <img src={heartIcon} alt="" />
                            <p>There are no products to display.</p>
                        </div>
                    </div>
                )}
            </div>
            {totalPagesFromData && wishList && wishList.length ? (
                <div className="pagination favorite-container">
                    <Pagination pageControl={pageControl} />
                    <ItemPerPage
                        listItems={LIST_ITEM_PER_PAGE}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                    />
                </div>
            ) : null}
        </>
    );
};

export default WishList;
