import React, { Suspense, lazy } from 'react';

import LoadingIndicator from '@skp/components/LoadingIndicator';
import { Error404 } from '@skp/components/Errors';
import { Route, resourceUrl, Switch, useRouteMatch } from '@skp/drivers';
import { PILLAR_CODE, SERVICE_THE_TIME } from '@skp/config';

// Layout
const AppContent = lazy(() => import('../appContent'));
const PublicAppContent = lazy(() => import('../publicAppContent'));
const RegistrationLayout = lazy(() => import('../registrationLayout'));

const HomePage = lazy(() => import('../../screens/Home'));
const ProductPage = lazy(() => import('../../screens/Product'));
const CategoryList = lazy(() => import('../../screens/CategoryList'));
const FeatureList = lazy(() => import('../../screens/FeatureList'));
const PillarUpdateInfoList = lazy(() =>
    import('../../screens/PillarUpdateInfoList')
);
const ShoppingCartPage = lazy(() => import('../../screens/ShoppingCart'));
const CheckoutStep1Page = lazy(() => import('../../screens/Checkout/Step1'));
const CheckoutStep2Page = lazy(() => import('../../screens/Checkout/Step2'));
const CheckoutStep3Page = lazy(() => import('../../screens/Checkout/Step3'));
const CheckoutConfirmationPage = lazy(() =>
    import('../../screens/Checkout/Confirmation')
);
const ForgotPassword = lazy(() => import('../../screens/ForgotPassword'));
const ResetPassword = lazy(() => import('../../screens/ResetPassword'));
const CmsPage = lazy(() => import('../../screens/CmsPage'));
const SearchResultPage = lazy(() => import('../../screens/SearchResult'));
const SignInPage = lazy(() => import('../../screens/SignIn'));
const SignUpStep0Page = lazy(() => import('../../screens/SignUpStep0'));
const SignUpStep1Page = lazy(() => import('../../screens/SignUpStep1'));
const SignUpStep2Page = lazy(() => import('../../screens/SignUpStep2'));
const SignUpStep3Page = lazy(() => import('../../screens/SignUpStep3'));

const ApplyStep1Page = lazy(() => import('../../screens/Apply/Step1'));
const ApplyStep2Page = lazy(() => import('../../screens/Apply/Step2'));
const ApplyConfirmPage = lazy(() => import('../../screens/Apply/Confirmation'));

const RestockRequest = lazy(() =>
    import('../../screens/MyPage/restockRequest')
);
const MyProfile = lazy(() => import('../../screens/MyPage/myProfile'));
const BookingHistory = lazy(() =>
    import('../../screens/MyPage/bookingHistory')
);
const CreditCard = lazy(() => import('../../screens/MyPage/creditCard'));
const AddCreditCard = lazy(() =>
    import('../../screens/CreditCard/addCreditCard')
);
const EditCreditCard = lazy(() =>
    import('../../screens/CreditCard/editCreditCard')
);
const FavoriteList = lazy(() => import('../../screens/MyPage/favoriteList'));
const BuzzList = lazy(() => import('../../screens/BuzzList'));
const BookingRoom = lazy(() => import('../../screens/Ean'));
const BuzzDetail = lazy(() => import('../../screens/BuzzDetail'));
const InvitationPage = lazy(() => import('../../screens/MyPage/invitation'));
const OrderHistory = lazy(() => import('../../screens/MyPage/orderHistory'));
const OrderHistoryDetail = lazy(() =>
    import('../../screens/MyPage/orderHistoryDetail')
);
const OrderHistoryInvoice = lazy(() =>
    import('../../screens/MyPage/orderHistoryInvoice')
);
const OrderHistoryShipment = lazy(() =>
    import('../../screens/MyPage/orderHistoryShipment')
);
const OrderHistoryRefund = lazy(() =>
    import('../../screens/MyPage/orderHistoryRefund')
);
const ServiceHistory = lazy(() =>
    import('../../screens/MyPage/serviceHistory')
);
const ServiceHistoryDetail = lazy(() =>
    import('../../screens/MyPage/serviceHistoryDetail')
);
const RegisterPlatinumPartnerPage = lazy(() =>
    import('../../screens/MyPage/registerPlatinumPartner')
);
const ShippingAddress = lazy(() =>
    import('../../screens/MyPage/shippingAddress')
);
// const BillingAddress = lazy(() =>
//     import('../../screens/MyPage/billingAddress')
// );
const SkyPoints = lazy(() => import('../../screens/MyPage/skyPoints'));
const AddShippingAddress = lazy(() =>
    import('../../screens/ShippingAddress/addShippingAddress')
);
const EditShippingAddress = lazy(() =>
    import('../../screens/ShippingAddress/editShippingAddress')
);
const UnpaidPayment = lazy(() => import('../../screens/MyPage/unpaidPayment'));

const LotteryCheckoutStep1Page = lazy(() =>
    import('../../screens/LotteryCheckout/Step1')
);
const LotteryCheckoutStep2Page = lazy(() =>
    import('../../screens/LotteryCheckout/Step2')
);
const LotteryCheckoutStep3Page = lazy(() =>
    import('../../screens/LotteryCheckout/Step3')
);
const LotteryConfirmation = lazy(() =>
    import('../../screens/LotteryCheckout/Confirmation')
);

const PillarHomePage = lazy(() =>
    import('../../screens/ProductListing/pillarHome')
);
const ProductListingByPillar = lazy(() =>
    import('../../screens/ProductListing/byPillar')
);
const ProductListingByTimeSaleEvent = lazy(() =>
    import('../../screens/ProductListing/byTimeSaleEvent')
);
const ProductListingByService = lazy(() =>
    import('../../screens/ProductListing/byService')
);
const ProductListingByCategory = lazy(() =>
    import('../../screens/ProductListing/byCategory')
);
const ProductListingByFeature = lazy(() =>
    import('../../screens/ProductListing/byFeature')
);

const ShoppingSubscription = lazy(() =>
    import('../../screens/MyPage/shoppingSubscription')
);

const PointMallCheckoutStep1Page = lazy(() =>
    import('../../screens/PointMallCheckout/Step1')
);
const PointMallCheckoutStep2Page = lazy(() =>
    import('../../screens/PointMallCheckout/Step2')
);
const PointMallConfirmation = lazy(() =>
    import('../../screens/PointMallCheckout/Confirmation')
);

const BookingSummary = lazy(() =>
    import('../../screens/Expedia/BookingSummary')
);

const BookingHotelDetail = lazy(() =>
    import('../../screens/MyPage/bookingHotelDetail')
);

const BookingConfirmation = lazy(() =>
    import('../../screens/Expedia/BookingConfirmation')
);

const SpecificUserPurchase = lazy(() =>
    import('../../screens/MyPage/specificUserPurchase')
);

const pillars = [
    { code: PILLAR_CODE.shopping },
    { code: PILLAR_CODE.winedine },
    { code: PILLAR_CODE.travel },
    { code: PILLAR_CODE.wellness },
    { code: PILLAR_CODE.pointmall },
    { code: PILLAR_CODE.estore }
];

const PillarRoute = ({ code, isMasked }) => {
    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path}>
                <AppContent isMasked={isMasked} layoutType="category">
                    <PillarHomePage code={code} />
                </AppContent>
            </Route>
            <Route exact path={`${path}/listing`}>
                <AppContent isMasked={isMasked} layoutType="category">
                    <ProductListingByPillar code={code} />
                </AppContent>
            </Route>
            <Route exact path={`${path}/search`}>
                <AppContent isMasked={isMasked}>
                    <SearchResultPage />
                </AppContent>
            </Route>
            <Route
                exact
                path={`${path}/service/${SERVICE_THE_TIME}/:time_event_id`}
            >
                <AppContent isMasked={isMasked} layoutType="category">
                    <ProductListingByTimeSaleEvent pillarCode={code} />
                </AppContent>
            </Route>
            <Route exact path={`${path}/service/:service_code`}>
                <AppContent isMasked={isMasked} layoutType="category">
                    <ProductListingByService pillarCode={code} />
                </AppContent>
            </Route>
            <Route exact path={`${path}/category/:category_id`}>
                <AppContent isMasked={isMasked} layoutType="category">
                    <ProductListingByCategory pillarCode={code} />
                </AppContent>
            </Route>
            <Route exact path={`${path}/service/:service_code/:category_id`}>
                <AppContent isMasked={isMasked} layoutType="category">
                    <ProductListingByCategory pillarCode={code} />
                </AppContent>
            </Route>
            <Route exact path={`${path}/features`}>
                <AppContent isMasked={isMasked} layoutType="category">
                    <FeatureList pillarCode={code} />
                </AppContent>
            </Route>
            <Route exact path={`${path}/summary`}>
                <AppContent isMasked={isMasked} layoutType="category">
                    <PillarUpdateInfoList pillarCode={code} />
                </AppContent>
            </Route>
            <Route exact path={`${path}/feature/:feature_id`}>
                <AppContent isMasked={isMasked} layoutType="category">
                    <ProductListingByFeature pillarCode={code} />
                </AppContent>
            </Route>
            <Route exact path={`${path}/categories`}>
                <AppContent
                    isMasked={isMasked}
                    useWhiteBackground={true}
                    layoutType="category"
                >
                    <CategoryList pillarCode={code} />
                </AppContent>
            </Route>
        </Switch>
    );
};

const SAML = lazy(() => import('../../screens/SAML'));

const Routes = ({ isMasked }) => {
    return (
        <Suspense fallback={<LoadingIndicator global={true} overlay={false} />}>
            <Switch>
                <Route exact path={resourceUrl('/')}>
                    <AppContent
                        isMasked={isMasked}
                        layoutType="home"
                        pageTitle="Home"
                    >
                        <HomePage />
                    </AppContent>
                </Route>
                {pillars.map(({ code }) => (
                    <Route path={resourceUrl(`/${code}`)} key={code}>
                        <PillarRoute code={code} isMasked={isMasked} />
                    </Route>
                ))}
                <Route exact path={resourceUrl('/product/:id')}>
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <ProductPage />
                    </AppContent>
                </Route>
                <Route exact path={resourceUrl('/login')}>
                    <PublicAppContent pageTitle="Login">
                        <SignInPage />
                    </PublicAppContent>
                </Route>
                <Route exact path={resourceUrl('/search')}>
                    <AppContent isMasked={isMasked} pageTitle="Search Result">
                        <SearchResultPage />
                    </AppContent>
                </Route>
                <Route exact path={resourceUrl('/cart')}>
                    <AppContent
                        isMasked={isMasked}
                        useWhiteBackground={true}
                        pageTitle="Shopping Cart"
                    >
                        <ShoppingCartPage />
                    </AppContent>
                </Route>
                <Route
                    exact
                    path={resourceUrl('/checkout/first-step')}
                    pageTitle="Checkout Step 1"
                >
                    <AppContent
                        isMasked={isMasked}
                        useWhiteBackground={true}
                        pageTitle="Checkout Step 1"
                    >
                        <CheckoutStep1Page />
                    </AppContent>
                </Route>
                <Route exact path={resourceUrl('/checkout/second-step')}>
                    <AppContent
                        isMasked={isMasked}
                        useWhiteBackground={true}
                        pageTitle="Checkout Step 2"
                    >
                        <CheckoutStep2Page />
                    </AppContent>
                </Route>
                <Route exact path={resourceUrl('/checkout/third-step')}>
                    <AppContent
                        isMasked={isMasked}
                        useWhiteBackground={true}
                        pageTitle="Checkout Step 3"
                    >
                        <CheckoutStep3Page />
                    </AppContent>
                </Route>
                <Route exact path={resourceUrl('/checkout/confirmation')}>
                    <AppContent
                        isMasked={isMasked}
                        useWhiteBackground={true}
                        pageTitle="Checkout Confirmation"
                    >
                        <CheckoutConfirmationPage />
                    </AppContent>
                </Route>
                <Route exact path={resourceUrl('/forgot-password')}>
                    <PublicAppContent pageTitle="Forgot Password">
                        <ForgotPassword />
                    </PublicAppContent>
                </Route>
                <Route exact path={resourceUrl('/reset-password')}>
                    <PublicAppContent pageTitle="Reset Password">
                        <ResetPassword />
                    </PublicAppContent>
                </Route>
                <Route
                    exact
                    path={resourceUrl('/sign-up/invitation/:invite_code')}
                >
                    <RegistrationLayout
                        step={0}
                        pageTitle="Registration Step 0"
                    >
                        {stepList => <SignUpStep0Page stepList={stepList} />}
                    </RegistrationLayout>
                </Route>
                <Route exact path={resourceUrl('/sign-up/first-step')}>
                    <RegistrationLayout
                        step={1}
                        pageTitle="Registration Step 1"
                    >
                        {stepList => <SignUpStep1Page stepList={stepList} />}
                    </RegistrationLayout>
                </Route>
                <Route exact path={resourceUrl('/sign-up/second-step')}>
                    <RegistrationLayout
                        step={2}
                        pageTitle="Registration Step 2"
                    >
                        {stepList => <SignUpStep2Page stepList={stepList} />}
                    </RegistrationLayout>
                </Route>
                <Route exact path={resourceUrl('/sign-up/third-step')}>
                    <RegistrationLayout
                        step={3}
                        pageTitle="Registration Step 3"
                    >
                        {stepList => <SignUpStep3Page stepList={stepList} />}
                    </RegistrationLayout>
                </Route>
                <Route
                    exact
                    path={resourceUrl('/product/:product_id/apply/first-step')}
                >
                    <AppContent
                        isMasked={isMasked}
                        useWhiteBackground={true}
                        pageTitle="Apply Step 1"
                    >
                        <ApplyStep1Page />
                    </AppContent>
                </Route>
                <Route
                    exact
                    path={resourceUrl('/product/:product_id/apply/second-step')}
                >
                    <AppContent
                        isMasked={isMasked}
                        useWhiteBackground={true}
                        pageTitle="Apply Step 2"
                    >
                        <ApplyStep2Page />
                    </AppContent>
                </Route>
                <Route
                    exact
                    path={resourceUrl(
                        '/product/:product_id/apply/confirmation'
                    )}
                >
                    <AppContent
                        isMasked={isMasked}
                        useWhiteBackground={true}
                        pageTitle="Apply Confirmation"
                    >
                        <ApplyConfirmPage />
                    </AppContent>
                </Route>
                <Route
                    exact
                    path={resourceUrl(
                        '/product/:product_id/lottery-checkout/first-step'
                    )}
                >
                    <AppContent
                        isMasked={isMasked}
                        useWhiteBackground={true}
                        pageTitle="Lottery Checkout Step 1"
                    >
                        <LotteryCheckoutStep1Page />
                    </AppContent>
                </Route>
                <Route
                    exact
                    path={resourceUrl(
                        '/product/:product_id/lottery-checkout/second-step'
                    )}
                >
                    <AppContent
                        isMasked={isMasked}
                        useWhiteBackground={true}
                        pageTitle="Lottery Checkout Step 2"
                    >
                        <LotteryCheckoutStep2Page />
                    </AppContent>
                </Route>
                <Route
                    exact
                    path={resourceUrl(
                        '/product/:product_id/lottery-checkout/third-step'
                    )}
                >
                    <AppContent
                        isMasked={isMasked}
                        useWhiteBackground={true}
                        pageTitle="Lottery Checkout Step 3"
                    >
                        <LotteryCheckoutStep3Page />
                    </AppContent>
                </Route>
                <Route
                    exact
                    path={resourceUrl(
                        '/product/:product_id/lottery-checkout/confirmation'
                    )}
                >
                    <AppContent
                        isMasked={isMasked}
                        useWhiteBackground={true}
                        pageTitle="Lottery Checkout Confirmation"
                    >
                        <LotteryConfirmation />
                    </AppContent>
                </Route>
                <Route exact path={resourceUrl('/mypage/restock-request')}>
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <RestockRequest />
                    </AppContent>
                </Route>
                <Route exact path={resourceUrl('/customer/account')}>
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <MyProfile />
                    </AppContent>
                </Route>
                <Route exact path={resourceUrl('/customer/stripe/cards')}>
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <CreditCard />
                    </AppContent>
                </Route>
                <Route exact path={resourceUrl('/mypage/credit-card/add')}>
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <AddCreditCard />
                    </AppContent>
                </Route>
                <Route exact path={resourceUrl('/mypage/credit-card/edit')}>
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <EditCreditCard />
                    </AppContent>
                </Route>
                <Route exact path={resourceUrl('/customer/wishlist')}>
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <FavoriteList />
                    </AppContent>
                </Route>
                <Route exact path={resourceUrl('/customer/invitation')}>
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <InvitationPage />
                    </AppContent>
                </Route>
                <Route exact path={resourceUrl('/customer/sales/history')}>
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <OrderHistory />
                    </AppContent>
                </Route>
                <Route
                    exact
                    path={resourceUrl(
                        '/mypage/order-history/view/order_id/:id'
                    )}
                >
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <OrderHistoryDetail />
                    </AppContent>
                </Route>
                <Route exact path={resourceUrl('/customer/services')}>
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <ServiceHistory />
                    </AppContent>
                </Route>
                <Route exact path={resourceUrl('/mypage/service-history/:id')}>
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <ServiceHistoryDetail />
                    </AppContent>
                </Route>
                <Route
                    exact
                    path={resourceUrl(
                        '/mypage/order-history/invoice/order_id/:id'
                    )}
                >
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <OrderHistoryInvoice />
                    </AppContent>
                </Route>
                <Route
                    exact
                    path={resourceUrl(
                        '/mypage/order-history/shipment/order_id/:id'
                    )}
                >
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <OrderHistoryShipment />
                    </AppContent>
                </Route>
                <Route
                    exact
                    path={resourceUrl(
                        '/mypage/order-history/refund/order_id/:id'
                    )}
                >
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <OrderHistoryRefund />
                    </AppContent>
                </Route>
                <Route
                    exact
                    path={resourceUrl('/customer/register/partner')}
                >
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <RegisterPlatinumPartnerPage />
                    </AppContent>
                </Route>
                <Route exact path={resourceUrl('/customer/address')}>
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <ShippingAddress />
                    </AppContent>
                </Route>
                {/* <Route exact path={resourceUrl('/customer/billing-address')}>
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <BillingAddress />
                    </AppContent>
                </Route> */}
                <Route exact path={resourceUrl('/customer/account/loyalty')}>
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <SkyPoints />
                    </AppContent>
                </Route>
                <Route exact path={resourceUrl('/mypage/shipping-address/add')}>
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <AddShippingAddress />
                    </AppContent>
                </Route>
                <Route
                    exact
                    path={resourceUrl(
                        '/mypage/shipping-address/edit/:shipping_address_id'
                    )}
                >
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <EditShippingAddress />
                    </AppContent>
                </Route>
                <Route exact path={resourceUrl('/customer/payment/history')}>
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <UnpaidPayment />
                    </AppContent>
                </Route>
                <Route
                    exact
                    path={resourceUrl('/mypage/shopping-subscription')}
                >
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <ShoppingSubscription />
                    </AppContent>
                </Route>
                <Route exact path={resourceUrl('/customer/booking/history')}>
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <BookingHistory />
                    </AppContent>
                </Route>
                <Route
                    exact
                    path={resourceUrl('/mypage/booking-history/view/:id')}
                >
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <BookingHotelDetail />
                    </AppContent>
                </Route>
                <Route exact path={resourceUrl('/mypage/user-purchase')}>
                    <AppContent isMasked={isMasked} useWhiteBackground={true}>
                        <SpecificUserPurchase />
                    </AppContent>
                </Route>
                <Route exact path={resourceUrl('/buzz/:category?')}>
                    <AppContent
                        isMasked={isMasked}
                        layoutType="category"
                        pageTitle="Buzz"
                    >
                        <BuzzList />
                    </AppContent>
                </Route>
                <Route exact path={resourceUrl('/buzz/:category/:buzz_id')}>
                    <AppContent
                        isMasked={isMasked}
                        useWhiteBackground={true}
                        isBuzz={true}
                    // page title was set in BuzzDetail
                    >
                        <BuzzDetail />
                    </AppContent>
                </Route>
                <Route
                    exact
                    path={resourceUrl('/hotel/:hotel_id/room-listing')}
                >
                    <AppContent
                        isMasked={isMasked}
                        useWhiteBackground={true}
                        pageTitle="Booking Hotel Room List"
                    >
                        <BookingRoom />
                    </AppContent>
                </Route>
                <Route exact path={resourceUrl('/expedia/booking-summary')}>
                    <AppContent
                        isMasked={isMasked}
                        useWhiteBackground={true}
                        pageTitle="Booking Summary"
                    >
                        <BookingSummary />
                    </AppContent>
                </Route>
                <Route
                    exact
                    path={resourceUrl('/hotel/booking-confirmation/:id')}
                >
                    <AppContent
                        isMasked={isMasked}
                        useWhiteBackground={true}
                        pageTitle="Booking Confirmation"
                    >
                        <BookingConfirmation />
                    </AppContent>
                </Route>
                <Route
                    exact
                    path={resourceUrl(
                        '/product/:product_id/point-mall-checkout/first-step'
                    )}
                >
                    <AppContent
                        isMasked={isMasked}
                        useWhiteBackground={true}
                        pageTitle="PointMall Checkout Step 1"
                    >
                        <PointMallCheckoutStep1Page />
                    </AppContent>
                </Route>
                <Route
                    exact
                    path={resourceUrl(
                        '/product/:product_id/point-mall-checkout/second-step'
                    )}
                >
                    <AppContent
                        isMasked={isMasked}
                        useWhiteBackground={true}
                        pageTitle="PointMall Checkout Step 2"
                    >
                        <PointMallCheckoutStep2Page />
                    </AppContent>
                </Route>
                <Route
                    exact
                    path={resourceUrl(
                        '/product/:product_id/point-mall-checkout/confirmation'
                    )}
                >
                    <AppContent
                        isMasked={isMasked}
                        useWhiteBackground={true}
                        pageTitle="PointMall Checkout Confirmation"
                    >
                        <PointMallConfirmation />
                    </AppContent>
                </Route>
                {/* cms_page_url_key can contain slash, so + is needed */}
                <Route
                    exact
                    path={resourceUrl('/page/:cms_page_url_key+.html')}
                >
                    <CmsPage />
                </Route>
                <Route exact path={resourceUrl('/saml')}>
                    <AppContent isMasked={isMasked}>
                        <SAML />
                    </AppContent>
                </Route>
                <Route exact path={resourceUrl('/not-found')}>
                    <AppContent isMasked={isMasked}>
                        <Error404 />
                    </AppContent>
                </Route>
                <Route>
                    <AppContent isMasked={isMasked}>
                        <Error404 />
                    </AppContent>
                </Route>
            </Switch>
        </Suspense>
    );
};

export default Routes;
