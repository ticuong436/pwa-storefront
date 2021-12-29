import React from 'react';
import { usePillarUpdateInfo } from './usePillarUpdateInfo';
import { useQueryParams } from '@skp/hooks/useQueryParams';
import { resourceUrl } from '@skp/drivers';
import Pagination from '@skp/components/Pagination';
import ItemPerPage from '@skp/components/ItemPerPage/itemPerPage';
import MonthFilter from '@skp/components/MonthFilter';
import { getErrorMessage } from '@skp/utils/graphqlError';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import AlertMessage from '@skp/components/AlertMessage';
import PageTitleForPillar from '@skp/components/PageTitleForPillar';
import {
    PRODUCTS_LIST_PAGE_SIZES,
    PRODUCTS_LIST_DEFAULT_PAGE_SIZE
} from '@skp/config';
import TargetBlankLink from '@skp/components/TargetBlankLink';

const PillarUpdateInfoList = ({ pillarCode, pageSize: defaultPageSize }) => {
    const { getQueryParam, setQueryParam } = useQueryParams();
    const queryPageSize = getQueryParam('page_size', defaultPageSize);

    const {
        updateInfoList,
        error,
        loading,
        totalPagesFromData,
        pageControl,
        month,
        pillarInfo
    } = usePillarUpdateInfo(pillarCode, queryPageSize);

    // Loading and error states can detected using values returned from
    // the useQuery hook
    if (loading) {
        // Default content rendered while the query is running
        return <LoadingIndicator />;
    }

    if (error) {
        return <ErrorView>{getErrorMessage(error)}</ErrorView>;
    }

    const { items = [], filterMonths = [] } = updateInfoList;

    return (
        <>
            <PageTitleForPillar
                pillarCode={pillarCode}
                subTitle="What's New List"
            />
            <div className="shopping-top listing-top">
                <img src={pillarInfo.image} alt="img" />
            </div>
            <div className="container">
                <div className="main-content">
                    <div className="fealist1 fealist2">
                        <div className="fealist1-top">
                            <h1 className="fealist1-top--title">
                                What's New List
                                <label className="summary--small" htmlFor="">
                                    {' '}
                                    &nbsp; Update information list
                                </label>
                            </h1>
                        </div>
                        <div className="row">
                            <div className="col-lg-3 col-md-12">
                                <MonthFilter
                                    months={filterMonths}
                                    currentMonth={month}
                                    url={resourceUrl(`/${pillarCode}/summary`)}
                                    title="Past update information"
                                />
                            </div>
                            <div className="profile-content col-lg-9 col-md-12">
                                <div className="fealist1-list">
                                    <div className="row">
                                        {items.length > 0 ? (
                                            items.map(item => {
                                                return (
                                                    <div
                                                        className="fealist1-item col-lg-4 col-md-6"
                                                        key={item.news_id}
                                                    >
                                                        <div className="fealist1-img">
                                                            <img
                                                                src={resourceUrl(
                                                                    item.news_image,
                                                                    {
                                                                        type:
                                                                            'image-updateinfo'
                                                                    }
                                                                )}
                                                                alt="img"
                                                            />
                                                        </div>
                                                        <div className="fealist1-box fealist2-box summary-box">
                                                            <div className="summary-text">
                                                                <span className="summary--title">
                                                                    {
                                                                        item.group_name
                                                                    }
                                                                </span>
                                                                <span className="summary-date">
                                                                    {
                                                                        item.news_date
                                                                    }{' '}
                                                                    UPDATE
                                                                </span>
                                                            </div>
                                                            <div className="summary-des">
                                                                <span className="summary-des--text">
                                                                    {item.title}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
                                                        <TargetBlankLink
                                                            className="summary-link"
                                                            href={item.url}
                                                            rel="noopener noreferrer"
                                                        />
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <AlertMessage type="warning">
                                                No result found
                                            </AlertMessage>
                                        )}
                                    </div>

                                    <div className="pagination">
                                        {totalPagesFromData > 0 && (
                                            <Pagination
                                                pageControl={pageControl}
                                            />
                                        )}
                                        {updateInfoList.total_count > 0 && (
                                            <ItemPerPage
                                                listItems={
                                                    PRODUCTS_LIST_PAGE_SIZES
                                                }
                                                pageSize={queryPageSize}
                                                setPageSize={value =>
                                                    setQueryParam(
                                                        'page_size',
                                                        value
                                                    )
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PillarUpdateInfoList;

PillarUpdateInfoList.defaultProps = {
    // TODO: This can be replaced by the value from `storeConfig when the PR,
    // https://github.com/magento/graphql-ce/pull/650, is released.
    pageSize: PRODUCTS_LIST_DEFAULT_PAGE_SIZE
};
