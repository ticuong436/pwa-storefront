import React from 'react';
import { resourceUrl } from '@skp/drivers';
import MonthFilter from '@skp/components/MonthFilter';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import FeatureRedirect from './featureRedirect';
import { useFeature } from './useFeature';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { getErrorMessage } from '@skp/utils/graphqlError';
import Pagination from '@skp/components/Pagination';
import ItemPerPage from '@skp/components/ItemPerPage/itemPerPage';
import { useQueryParams } from '@skp/hooks/useQueryParams';
import PageTitleForPillar from '@skp/components/PageTitleForPillar';
import {
    PRODUCTS_LIST_PAGE_SIZES,
    PRODUCTS_LIST_DEFAULT_PAGE_SIZE
} from '@skp/config';

const FeatureList = ({ pillarCode, pageSize: defaultPageSize }) => {
    const { getQueryParam, setQueryParam } = useQueryParams();
    const queryPageSize = getQueryParam('page_size', defaultPageSize);
    const {
        featureList,
        pillarInfo,
        error,
        loading,
        totalPagesFromData,
        pageControl,
        month
    } = useFeature(pillarCode, queryPageSize);

    // Loading and error states can detected using values returned from
    // the useQuery hook
    if (loading) {
        // Default content rendered while the query is running
        return <LoadingIndicator />;
    }

    if (error) {
        return <ErrorView>{getErrorMessage(error)}</ErrorView>;
    }
    const { features = [], filterMonths = [] } = featureList;
    const listFeatures = features.map(feature => {
        return (
            <div
                className="fealist1-item col-lg-4 col-md-6 col-xs-6"
                key={feature.id}
            >
                <FeatureRedirect feature={feature} pillarCode={pillarCode}>
                    <img
                        src={resourceUrl(feature.image, {
                            type: 'image-feature'
                        })}
                        alt="img"
                    />
                </FeatureRedirect>
                <div className="fealist1-box">
                    <FeatureRedirect feature={feature} pillarCode={pillarCode}>
                        {feature.title}
                    </FeatureRedirect>
                </div>
            </div>
        );
    });

    return (
        <>
            <PageTitleForPillar
                pillarCode={pillarCode}
                subTitle={'Feature List'}
            />
            <div className="shopping-top listing-top">
                <img src={pillarInfo.image} alt="img" />
            </div>
            <div className="container">
                <div className="main-content">
                    <div className="fealist1">
                        <div className="fealist1-top">
                            <h1 className="fealist1-top--title">Special feature list</h1>
                        </div>
                        <div className="row">
                            <div className="col-lg-3 col-md-12">
                                <MonthFilter
                                    months={filterMonths}
                                    currentMonth={month}
                                    url={resourceUrl(`/${pillarCode}/features`)}
                                    title="Past special feature"
                                />
                            </div>
                            <div className="profile-content col-lg-9 col-md-12">
                                <div className="fealist1-list">
                                    <div className="row">{listFeatures}</div>
                                    <div className="pagination">
                                        {totalPagesFromData && (
                                            <Pagination
                                                pageControl={pageControl}
                                            />
                                        )}
                                        {featureList.total_count > 0 && (
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

export default FeatureList;

FeatureList.defaultProps = {
    // TODO: This can be replaced by the value from `storeConfig when the PR,
    // https://github.com/magento/graphql-ce/pull/650, is released.
    pageSize: PRODUCTS_LIST_DEFAULT_PAGE_SIZE
};
