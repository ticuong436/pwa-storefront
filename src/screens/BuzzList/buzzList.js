import React from 'react';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import Pagination from '@skp/components/Pagination';
import useBuzzList from './useBuzzList';
import ItemPerPage from '@skp/components/ItemPerPage';
import BuzzListItem from './buzzListItem';
import { LIST_ITEM_PER_PAGE } from '@skp/utils/listItemPerpage';
import buzzBanner from 'design/dest/images/Buzz_1920x350.jpg';
import { useTranslation } from 'react-i18next';
import AlertMessage from '@skp/components/AlertMessage';

const BuzzList = () => {
    const {
        buzzList,
        error,
        loading,
        currentPage,
        totalPagesFromData,
        pageControl,
        handleFilterBuzzList,
        pageSize,
        setPageSize
    } = useBuzzList();

    const { t } = useTranslation(['common']);

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
        return <span>Error loading Buzz Component!</span>;
    }

    if (!totalPagesFromData) {
        return (
            <div>
                <span className="history-box--title">No data buzz</span>
            </div>
        );
    }

    return (
        <>
            <div className="buzz-top">
                <img className="buzz-top_img" src={buzzBanner} alt="" />
            </div>
            <div className="container buzz-container">
                <div className="main-content">
                    <div className="buzz bshop">
                        <div className="buzz-title">
                            <a
                                className="buzz-title--name cursor-pointer"
                                onClick={() => handleFilterBuzzList()}
                            >
                                All
                            </a>
                            <a
                                className="buzz-title--name cursor-pointer"
                                onClick={() => handleFilterBuzzList('news')}
                            >
                                News
                            </a>
                            <a
                                className="buzz-title--name cursor-pointer"
                                onClick={() => handleFilterBuzzList('events')}
                            >
                                Events
                            </a>
                            <a
                                className="buzz-title--name cursor-pointer"
                                onClick={() => handleFilterBuzzList('media')}
                            >
                                Media
                            </a>
                            <a
                                className="buzz-title--name cursor-pointer"
                                onClick={() => handleFilterBuzzList('blog')}
                            >
                                Blog
                            </a>
                            <a
                                className="buzz-title--name cursor-pointer"
                                onClick={() => handleFilterBuzzList('gallery')}
                            >
                                Gallery
                            </a>
                        </div>

                        {buzzList.length == 0 ? (
                            <AlertMessage type="warning">
                                {t('common::There is no contents')}
                            </AlertMessage>
                        ) : (
                            <>
                                <div className="row">
                                    {buzzList.slice(0, 2).map(item => {
                                        return (
                                            <div
                                                className="buzz-gallery col-lg-6 col-md-6"
                                                key={item.id}
                                            >
                                                <BuzzListItem item={item} />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="buzz-list">
                                    <div className="row">
                                        {buzzList.slice(2).map(item => {
                                            return (
                                                <div
                                                    className="buzz-gallery col-lg-4 col-md-4"
                                                    key={item.id}
                                                >
                                                    <BuzzListItem item={item} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="pagination pagination-point">
                                    <Pagination pageControl={pageControl} />
                                    <ItemPerPage
                                        listItems={LIST_ITEM_PER_PAGE}
                                        pageSize={pageSize}
                                        setPageSize={setPageSize}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BuzzList;
