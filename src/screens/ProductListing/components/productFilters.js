import React, { useState } from 'react';
import { Link, resourceUrl, useHistory, useLocation } from '@skp/drivers';
import CategoryFilter from './categoryFilter';
import CategoryFilterSingleSelect from './categoryFilterSingleSelect';
import FeatureFilter from './featureFilter';
// import {
//     getFilterValue,
//     PriceRangeFilterLabel,
//     priceRangeFilterValue
// } from '@skp/screens/ProductListing/hooks/useProductFilters';
import {
    PILLAR_CODE,
    SERVICE_CODE,
    SERVICE_THE_TIME,
    COMMUNITY_PORTAL_URL
} from '@skp/config';
import WineDineFilter from './wineDineFilter';
import TravelFilter from './travelFilter';
import WellnessFilter from './wellnessFilter';
import FilterPanel from './filterPanel';
import ProductSort from './productSort';
import { useTranslation } from 'react-i18next';
import ShoppingFilterSide from './shoppingFilterSide';
import Moment from 'moment';
import HoltelFilter from './hotelFilter';
import ExternalSupportLink from '@skp/components/ExternalSupportLink';

const TimeEventSelects = ({ timeEventId, timeEvents, onChange }) => {
    const { t } = useTranslation(['product_listing']);

    return (
        <div className="control search-control search--category filter-select">
            {/* eslint-disable-next-line jsx-a11y/no-onchange */}
            <select
                className="result-select"
                value={timeEventId}
                onChange={e => onChange(e.target.value)}
            >
                <option value="">
                    {' '}
                    {t('product_listing::Select an event')}
                </option>
                {timeEvents.map(timeEvent => {
                    return (
                        <option key={timeEvent.id} value={timeEvent.id}>
                            {Moment(timeEvent.iso_start_date)
                                .locale(process.env.SKY_STOREFRONT_LANGUAGE)
                                .format('MM月DD日(dd) HH時から')}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

// const PriceRangeList = ({ pillarCode, addFilterParam, searchFilterParams }) => {
//     const { t } = useTranslation(['product_listing']);
//     const currentFilterValue = getFilterValue(
//         searchFilterParams,
//         'price_range'
//     );
//     return (
//         <ul className="search-product-list">
//             {PILLAR_FILTER_PRICE_RANGE[pillarCode].map((range, index) => {
//                 const filterValue = priceRangeFilterValue(range);
//                 return (
//                     <li className="search-product-price" key={index}>
//                         <a
//                             href="#"
//                             className={
//                                 currentFilterValue == filterValue
//                                     ? 'search--active'
//                                     : ''
//                             }
//                             onClick={e => {
//                                 e.preventDefault();
//                                 addFilterParam('price_range', {
//                                     value: filterValue,
//                                     label: (
//                                         <>
//                                             {t('product_listing::Price Range')}
//                                             {': '}
//                                             <PriceRangeFilterLabel
//                                                 range={range}
//                                             />
//                                         </>
//                                     )
//                                 });
//                             }}
//                         >
//                             <PriceRangeFilterLabel range={range} />
//                         </a>
//                     </li>
//                 );
//             })}
//         </ul>
//     );
// };

const ServiceLink = ({ currentServiceCode, currentPillarCode, service }) => {
    const serviceUrl =
        // service.value == SERVICE_CODE.the_community && COMMUNITY_PORTAL_URL
        //     ? COMMUNITY_PORTAL_URL
        //     : resourceUrl(`/${currentPillarCode}/service/${service.value}`);

        service.value == 'buzz'
            ? resourceUrl('/buzz')
            : resourceUrl(`/${currentPillarCode}/service/${service.value}`);

    return (
        <ExternalSupportLink
            className={`search-product--title search--category ${
                currentServiceCode === service.value ? 'search--active' : ''
            }`}
            to={serviceUrl}
        >
            {service.label}
        </ExternalSupportLink>
    );
};

const ProductFilters = ({
    pillarCode,
    timeEventId,
    serviceCode,
    categoryId,
    addFilterParam,
    removeFilterParam,
    searchFilterParams,
    categories,
    features,
    services,
    timeEvents,
    featureId,
    attributes,
    hotelFilters,
    hideMobile
}) => {
    const [showingFilter, setShowingFilter] = useState(false);

    const isPointMallHome = pillarCode === PILLAR_CODE.pointmall;

    const history = useHistory();
    const location = useLocation();

    return (
        <>
            {hideMobile == '1' ? (
                <div />
            ) : (
                <div className="filter-customize mb-3">
                    <div className="filter-by">
                        <span
                            className="filter-by__name cursor-pointer"
                            onClick={() =>
                                setShowingFilter(
                                    showingFilter => !showingFilter
                                )
                            }
                        >
                            絞り込み
                        </span>
                    </div>
                    {serviceCode === SERVICE_CODE.hotels ? (
                        <div id="hotels-sort" class="filter-by" />
                    ) : (
                        <div className="sort-by dropdown">
                            <ProductSort
                                isTheTimePage={
                                    serviceCode == SERVICE_THE_TIME ||
                                    timeEventId
                                }
                            />
                        </div>
                    )}
                </div>
            )}
            <div
                className={`filter-menu collapse ${
                    showingFilter ? 'show' : ''
                }`}
            >
                {(services.length > 0 || pillarCode=='estore') && (
                    <div className="search-product-box hide-xs">
                        <Link
                            className={`search-product--title search--category ${
                                location.pathname ===
                                resourceUrl(`/${pillarCode}/listing`)
                                    ? 'search--active'
                                    : ''
                            }`}
                            to={resourceUrl(`/${pillarCode}/listing`)}
                        >
                            All
                        </Link>
                        {services.length > 0 &&
                            services.map(service => (
                                <React.Fragment key={service.value}>
                                    <ServiceLink
                                        currentPillarCode={pillarCode}
                                        currentServiceCode={serviceCode}
                                        service={service}
                                    />
                                    {service.value === SERVICE_THE_TIME &&
                                        timeEvents.length > 0 && (
                                            <TimeEventSelects
                                                timeEventId={timeEventId}
                                                timeEvents={timeEvents}
                                                onChange={value =>
                                                    history.push(
                                                        resourceUrl(
                                                            `/${pillarCode}/service/${SERVICE_THE_TIME}/${value}`
                                                        )
                                                    )
                                                }
                                            />
                                        )}
                                </React.Fragment>
                            ))}
                    </div>
                )}
                {serviceCode !== SERVICE_CODE.hotels &&
                    features &&
                    features.length > 0 && (
                        <FilterPanel
                            hideInMobile={true}
                            title="特集から探す"
                            collapsible={!isPointMallHome}
                        >
                            <FeatureFilter
                                pillarCode={pillarCode}
                                addFilterParam={addFilterParam}
                                features={features}
                                featureId={featureId}
                                limit={!isPointMallHome ? 4 : 0}
                            />
                        </FilterPanel>
                    )}
                { /* pillarCode === PILLAR_CODE.shopping && categories.length > 0 && (
                    <FilterPanel
                        hideInMobile={true}
                        title="カテゴリから探す"
                        collapsible={!isPointMallHome}
                    >
                        <CategoryFilter
                            pillarCode={pillarCode}
                            addFilterParam={addFilterParam}
                            categories={categories}
                            categoryId={categoryId}
                        />
                    </FilterPanel>
                ) */ }

                {pillarCode === PILLAR_CODE.estore && categories.length > 0 && (
                    <FilterPanel
                        hideInMobile={true}
                        title="カテゴリから探す"
                        collapsible={!isPointMallHome}
                    >
                        <CategoryFilter
                            pillarCode={pillarCode}
                            addFilterParam={addFilterParam}
                            categories={categories}
                            categoryId={categoryId}
                        />
                    </FilterPanel>
                )}

                { /* pillarCode === PILLAR_CODE.estore && categories.length > 0 && (
                    <FilterPanel
                        hideInMobile={true}
                        title="カテゴリから探す"
                        collapsible={!isPointMallHome}
                    >
                        <CategoryFilter
                            pillarCode={pillarCode}
                            addFilterParam={addFilterParam}
                            categories={categories}
                            categoryId={categoryId}
                        />
                    </FilterPanel>
                ) */ }

                {/* {!isPointMallHome && (
                    <>
                        {pillarCode === PILLAR_CODE.shopping && (
                            <FilterPanel title="詳しく探す" collapsible={false}>
                                <ShoppingFilterSide
                                    attributes={attributes}
                                    addFilterParam={addFilterParam}
                                    removeFilterParam={removeFilterParam}
                                    searchFilterParams={searchFilterParams}
                                />
                            </FilterPanel>
                        )}

                        {pillarCode === PILLAR_CODE.estore && (
                            <FilterPanel title="詳しく探す" collapsible={false}>
                                <ShoppingFilterSide
                                    attributes={attributes}
                                    addFilterParam={addFilterParam}
                                    removeFilterParam={removeFilterParam}
                                    searchFilterParams={searchFilterParams}
                                />
                            </FilterPanel>
                        )}

                        {/* pillarCode !== PILLAR_CODE.shopping && 
                            pillarCode !== PILLAR_CODE.estore &&
                            serviceCode !== SERVICE_CODE.hotels &&
                            !featureId &&
                            categories.length > 0 && (
                                <FilterPanel
                                    title="エリアから探す"
                                    collapsible={false}
                                >
                                    <CategoryFilterSingleSelect
                                        pillarCode={pillarCode}
                                        addFilterParam={addFilterParam}
                                        searchFilterParams={searchFilterParams}
                                        categories={categories}
                                        categoryId={categoryId}
                                        serviceCode={serviceCode}
                                    />
                                </FilterPanel>
                            ) */ }
                        {/*pillarCode === PILLAR_CODE.winedine && (
                            <FilterPanel title="Search In Detail" collapsible={false}>
                                <WineDineFilter
                                    attributes={attributes}
                                    addFilterParam={addFilterParam}
                                    removeFilterParam={removeFilterParam}
                                    searchFilterParams={searchFilterParams}
                                />
                            </FilterPanel>
                        )}
                        {pillarCode === PILLAR_CODE.travel && (
                            <FilterPanel title="詳しく探す" collapsible={false}>
                                {serviceCode === SERVICE_CODE.hotels ? (
                                    <HoltelFilter
                                        addFilterParam={addFilterParam}
                                        searchFilterParams={searchFilterParams}
                                        hotelFilters={hotelFilters}
                                    />
                                ) : (
                                    <TravelFilter
                                        attributes={attributes}
                                        addFilterParam={addFilterParam}
                                        searchFilterParams={searchFilterParams}
                                    />
                                )}
                            </FilterPanel>
                        )}
                        {pillarCode === PILLAR_CODE.wellness &&
                            serviceCode === SERVICE_CODE.the_community && (
                                <FilterPanel
                                    title="詳しく探す"
                                    collapsible={false}
                                >
                                    <WellnessFilter
                                        attributes={attributes}
                                        addFilterParam={addFilterParam}
                                        searchFilterParams={searchFilterParams}
                                    />
                                </FilterPanel>
                            )}
                    </>
                )} */}
            </div>
        </>
    );
};

export default ProductFilters;
