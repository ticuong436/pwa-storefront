import React from 'react';
import { string } from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import ProductFilters from './components/productFilters';
import GET_PILLAR_INFO from './graphql/pillarInfo.graphql';
import FeatureBanner from './components/featureBanner';
import TopBannerAndTitle from './components/topBannerAndTitle';
import PageInfo from './components/pageInfo';
import { getErrorMessage, is404Error } from '@skp/utils/graphqlError';
import { Error404 } from '@skp/components/Errors';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import UpdateInfoList from './components/updateInfoList';
import { usePillarSearch } from './hooks/usePillarSearch';
import { useProductFilters } from './hooks/useProductFilters';
import { useServiceInstruction } from './hooks/useServiceInstruction';
import ProductListingCard from './components/productListingCard';
import SeeMoreLink from './components/seeMoreLink';
import { resourceUrl } from '@skp/drivers';
import GET_LATEST_PRODUCT from './graphql/getLatestProduct.graphql';
import GET_BEST_SELLER_PRODUCT from './graphql/getBestSellerProduct.graphql';
import GET_RECOMMEND_PRODUCT from './graphql/getRecommendProduct.graphql';
import { PILLAR_CODE } from '@skp/config';
import { mapProductFromDbToListing } from '@skp/screens/ProductListing/utils/product';
import { useUserContext } from '@skp/layouts/context/user';
import PageTitleForPillar from '@skp/components/PageTitleForPillar';

const ProductList = ({
    pillarCode,
    products,
    productListName,
    showIndex = false,
    isProductsFromDb = true
}) => {
    const [{ currentUser }] = useUserContext();
    return pillarCode === PILLAR_CODE.shopping || pillarCode === PILLAR_CODE.estore
        ? products.map((product, index) => (
              <div className="result-item col-lg-4 col-md-6" key={product.id}>
                  {showIndex && (
                      <div
                          className={
                              index + 1 === 1
                                  ? 'result-label result-label--1st'
                                  : index + 1 === 2
                                  ? 'result-label result-label--2nd'
                                  : index + 1 === 3
                                  ? 'result-label result-label--3rd'
                                  : 'result-label result-label--4th-onwards'
                          }
                      >
                          <span className="result-label__value">
                              {index + 1}
                          </span>
                      </div>
                  )}
                  <ProductListingCard
                      productIndex={index}
                      listName={productListName}
                      product={
                          isProductsFromDb
                              ? mapProductFromDbToListing(product, currentUser)
                              : product
                      }
                  />
              </div>
          ))
        : products.map((product, index) => (
              <div className="result-item col-lg-4 col-md-6" key={product.id}>
                  <ProductListingCard
                      productIndex={index}
                      listName={productListName}
                      displayType="search"
                      product={
                          isProductsFromDb
                              ? mapProductFromDbToListing(product, currentUser)
                              : product
                      }
                  />
              </div>
          ));
};

const PillarHome = ({ code: pillarCode }) => {
    const { data, loading, error } = useQuery(GET_PILLAR_INFO, {
        fetchPolicy: 'no-cache',
        variables: {
            code: pillarCode
        }
    });
    const { data: dataLatestProduct } = useQuery(GET_LATEST_PRODUCT, {
        variables: { pillar: pillarCode || '', size: 12 },
        fetchPolicy: 'no-cache',
        // Only show in wellness, shopping
        skip:
            [PILLAR_CODE.wellness, PILLAR_CODE.shopping, PILLAR_CODE.estore].indexOf(pillarCode) ===
            -1
    });
    const titlePillar = data && data.pillarInfo ? data.pillarInfo.title : '';
    const serviceInstruction = useServiceInstruction({
        pillarCode,
        titlePillar
    });

    const latestProducts =
        dataLatestProduct && dataLatestProduct.getLatestProduct
            ? dataLatestProduct.getLatestProduct.items
            : [];

    const latestProductUpdatedDate =
        latestProducts.length > 0 &&
        new Date(
            Math.max.apply(
                Math,
                latestProducts.map(function(product) {
                    const updatedDate = new Date(product.updated_date);
                    return updatedDate.valueOf();
                })
            )
        );

    const { data: dataBestSellerProduct } = useQuery(GET_BEST_SELLER_PRODUCT, {
        variables: {
            pillar: pillarCode || '',
            size: 12
        },
        fetchPolicy: 'no-cache',
        // Only show in shopping
        skip:
            [
                PILLAR_CODE.shopping,
                PILLAR_CODE.estore
            ].indexOf(pillarCode) === -1
    });
    const bestSellerProducts =
        dataBestSellerProduct && dataBestSellerProduct.getBestSellerProduct
            ? dataBestSellerProduct.getBestSellerProduct.items
            : [];

    const { data: dataRecommendProduct } = useQuery(GET_RECOMMEND_PRODUCT, {
        variables: { pillar: pillarCode || '', size: 6 },
        fetchPolicy: 'no-cache',
        // Only show in wellness, travel, winedine
        skip:
            [
                PILLAR_CODE.wellness,
                PILLAR_CODE.travel,
                PILLAR_CODE.winedine
            ].indexOf(pillarCode) === -1
    });

    const recommendProducts = dataRecommendProduct
        ? dataRecommendProduct.productsOfRecommend
        : [];

    const {
        categories,
        features,
        services,
        timeEvents,
        attributes,
        searchFilterParams,
        addFilterParam,
        removeFilterParam
    } = useProductFilters({
        pillarCode,
        isPillarHome: true
    });

    const getDateFormat = date => {
        return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(
            2,
            '0'
        )}月${String(date.getDate()).padStart(2, '0')}日`;
    };

    const today = new Date();
    const dayLastWeek = new Date(today);
    dayLastWeek.setDate(dayLastWeek.getDate() - 7);

    usePillarSearch(pillarCode);

    if (loading) {
        return <LoadingIndicator />;
    }

    if (is404Error(error)) {
        return <Error404 />;
    }

    if (error) {
        return <ErrorView>{getErrorMessage(error)}</ErrorView>;
    }

    return (
        <>
            <PageTitleForPillar pillarCode={pillarCode} subTitle="Home" />
            <TopBannerAndTitle
                bannerUrl={data.pillarInfo.image}
                title={data.pillarInfo.title}
                description={data.pillarInfo.description}
                serviceInstruction={serviceInstruction}
            />
            <div className="container">
                <div className="main-content">
                    <div className="product-shopping">
                        <div className="row">
                            <div className="search-product col-lg-3 col-md-12">
                                <ProductFilters
                                    categories={categories}
                                    features={features}
                                    services={services}
                                    timeEvents={timeEvents}
                                    attributes={attributes}
                                    searchFilterParams={searchFilterParams}
                                    addFilterParam={addFilterParam}
                                    removeFilterParam={removeFilterParam}
                                    pillarCode={pillarCode}
                                    hideMobile={1}
                                />
                            </div>
                            <div className="product-content col-lg-9 col-md-12">
                                <div className="hide-pc">
                                    <PageInfo
                                        title={data.pillarInfo.title}
                                        description={
                                            data.pillarInfo.description
                                        }
                                        serviceInstruction={serviceInstruction}
                                    />
                                </div>

                                <UpdateInfoList pillarCode={pillarCode} />
                                <FeatureBanner pillarCode={pillarCode} />
                                {recommendProducts.length > 0 && (
                                    <div className="result-full result-full--new shopping-home">
                                        <div className="shopping-header">
                                            <h2 className="shopping-header__title-en">
                                                Recommendations
                                            </h2>
                                        </div>
                                        <div className="result row">
                                            <ProductList
                                                productListName={`Pillar: ${pillarCode} - Recommendations`}
                                                products={recommendProducts}
                                                pillarCode={pillarCode}
                                            />
                                        </div>
                                        <SeeMoreLink
                                            url={resourceUrl(
                                                pillarCode + '/listing'
                                            )}
                                        />
                                    </div>
                                )}
                                {latestProducts.length > 0 && (
                                    <div className="result-full result-full--new shopping-home">
                                        <div className="shopping-header">
                                            <h2 className="shopping-header__title">
                                                新着商品
                                            </h2>
                                            <div className="shopping-header__sub">
                                                <span className="shopping-header__sub-txt">
                                                    更新日：
                                                </span>
                                                <span className="shopping-header__sub-value">
                                                    {getDateFormat(
                                                        latestProductUpdatedDate
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="result row">
                                            <ProductList
                                                productListName={`Pillar: ${pillarCode} - Latest Products`}
                                                products={latestProducts}
                                                pillarCode={pillarCode}
                                                isProductsFromDb={false}
                                            />
                                        </div>
                                        <SeeMoreLink
                                            url={resourceUrl(
                                                pillarCode +
                                                    '/listing?sort=sky_enabled_date:desc'
                                            )}
                                        />
                                    </div>
                                )}
                                {bestSellerProducts.length > 0 && (
                                    <div className="result-full result-full--new  shopping-home">
                                        <div className="shopping-header">
                                            <div className="shopping-header">
                                                <h2 className="shopping-header__title">
                                                    人気ランキング
                                                </h2>
                                                <div className="shopping-header__sub">
                                                    <span className="shopping-header__sub-txt">
                                                        集計期間：
                                                    </span>
                                                    <span className="shopping-header__sub-value">
                                                        {getDateFormat(
                                                            dayLastWeek
                                                        )}{' '}
                                                        ~ {getDateFormat(today)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="result row">
                                            <ProductList
                                                productListName={`Pillar: ${pillarCode} - Best Seller Products`}
                                                products={bestSellerProducts}
                                                pillarCode={pillarCode}
                                                showIndex={true}
                                                isProductsFromDb={false}
                                            />
                                        </div>
                                        <SeeMoreLink
                                            url={resourceUrl(
                                                pillarCode +
                                                    '/listing?sort=sky_sell_counts:desc'
                                            )}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

PillarHome.propTypes = {
    code: string
};

export default PillarHome;
