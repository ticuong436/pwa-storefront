import React, { useMemo } from 'react';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import useSkyPointHistory from './useSkyPointHistory';
import MainPageTitle from '@skp/components/MainPageTitle';
import Pagination from '@skp/components/Pagination';
import ItemPerPage from '@skp/components/ItemPerPage';
import { LIST_ITEM_PER_PAGE } from '@skp/utils/listItemPerpage';
import { Link, resourceUrl } from '@skp/drivers';
import defaultClasses from './skyPointHistory.css';
const SkyPointHistory = () => {
    const {
        historySkyPoints,
        error,
        loading,
        currentPage,
        totalPagesFromData,
        pageSize,
        setPageSize,
        pageControl
    } = useSkyPointHistory();
    const { histories = [] } = historySkyPoints;
    const skyPointHistoryList = useMemo(
        () =>
            histories.map((history, idx) => {
                let regString = '';
                if (history.order_increment_id) {
                    regString = `(#${history.order_increment_id})`;
                } else if (history.booking_id) {
                    regString = `(#${history.booking_id})`;
                } else {
                    regString = `(#${history.application_id})`;
                }

                const linkOrderDetail =
                    history.order_increment_id ||
                        history.booking_id ||
                        history.application_id
                        ? history.reason.split(new RegExp(regString, 'gi'))
                        : [];

                if (linkOrderDetail.length) {
                    for (let i = 0; i < linkOrderDetail.length; i += 1) {
                        if (
                            linkOrderDetail[i] ==
                            `#${history.order_increment_id}` ||
                            linkOrderDetail[i] == `#${history.booking_id}` ||
                            linkOrderDetail[i] == `#${history.application_id}`
                        ) {
                            let url = '';
                            if (history.order_increment_id) {
                                url = `mypage/order-history/view/order_id/${history.order_increment_id
                                    }`;
                            } else if (history.booking_id) {
                                url = `mypage/booking-history/view/${history.booking_id
                                    }`;
                            } else {
                                url = `mypage/service-history/${history.application_id
                                    }`;
                            }

                            linkOrderDetail[i] = (
                                <Link
                                    className="table-customize__link"
                                    to={resourceUrl(url)}
                                    key={i}
                                >
                                    {linkOrderDetail[i]}
                                </Link>
                            );
                        }
                    }
                }

                return {
                    idx: idx,
                    created_at: history.created_at,
                    reason: linkOrderDetail.length
                        ? linkOrderDetail
                        : history.reason,
                    points_delta: history.points_delta
                };
            }),
        [histories]
    );

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
        return <span>Error loading SkyPointHistory Component!</span>;
    }

    const skyPointHistory = skyPointHistoryList.map(history => {
        return (
            <tr key={history.idx}>
                <td>{history.created_at}</td>
                <td>{history.reason}</td>
                <td>
                    {history.points_delta > 0 ? '+' : ''}
                    {history.points_delta}
                </td>
            </tr>
        );
    });

    const skyPointHistoryMobile = skyPointHistoryList.map(history => {
        return (
            <div
                className="mobile-point"
                key={`mobile-pointhistory-${history.idx}`}
            >
                <div className="mobile-pointhistory-block">
                    <div className="mobile-pointhistory-left">
                        <div className="mobile-item">
                            <div>{history.reason}</div>
                            <div>{history.created_at}</div>
                        </div>
                    </div>
                    <div className="mobile-pointhistory-right">
                        <div
                            className={
                                history.points_delta > 0
                                    ? 'mobile-item mobile-item-plus'
                                    : 'mobile-item mobile-item-minus'
                            }
                        >
                            <div>
                                {history.points_delta > 0 ? '+' : ''}
                                {history.points_delta}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    });

    const showExpiredDate =
        totalPagesFromData && historySkyPoints.available_sky_point > 0;

    return (
        <>
            <div className="mypage">
                <MainPageTitle title="SKY POINTS" />
                <div className="dpoint-box">
                    <div className="dpoint-boxtitle">Total ownership SKY DOLLARS</div>
                    <div className={`${defaultClasses.dpoint}`}>
                        {/* <div className="dpoint-text">
                            <span>Available Points</span>
                            {showExpiredDate && <span>Date of Expiry</span>}
                        </div>
                        <div className="dpoint-number">
                            <span>
                                {historySkyPoints.available_sky_point || 0}
                            </span>
                            {showExpiredDate && (
                                <span>{historySkyPoints.expired_date}</span>
                            )}
                        </div>  */}
                        <div class={`${defaultClasses.dpointTop}`}>
                            <div class={`${defaultClasses.dpointTopText}`}>TOTAL <br /> SKYDOLLARS<br />EARNED<br /></div>
                            <div class={`${defaultClasses.dpointTopNumber}`}>
                                <div class={`${defaultClasses.pointsTotal}`}>
                                    <span class={`${defaultClasses.span}`}>{historySkyPoints.available_sky_point || 0}</span>
                                    <p class={`${defaultClasses.p}`}>SKY$</p>
                                </div>
                                <div class={`${defaultClasses.div}`}>PREMIUM</div>
                            </div>
                        </div>
                        <div class={`${defaultClasses.dpointBottom}`}>
                            {showExpiredDate ? historySkyPoints.expired_date : 'SKY DOLLARS EXPIRING ON: 16 Aug 2031'}

                        </div>
                    </div>
                </div>
                <MainPageTitle title="History" />
                <div className="table-responsive skypoint-pc">
                    <table className="table mypage-table">
                        <thead>
                            <tr>
                                <th scope="col">DATE</th>
                                <th scope="col">ACTIVITY CONTENT</th>
                                <th scope="col">SKY DOLLARS EARNED/SPENT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {skyPointHistory}
                            {/* hashcode */}
                            {/* <tr >
                                <td>11/11/2021</td>
                                <td>REDEMPTION (54.00) eCommerce Order 000000610555</td>
                                <td>
                                +100.00  POINTS
                                </td>
                            </tr> */}

                        </tbody>
                    </table>
                </div>
                <div className="table-responsive skypoint-table">
                    {skyPointHistoryMobile}
                </div>

                {totalPagesFromData && (
                    <div className="pagination">
                        <Pagination pageControl={pageControl} />
                        <ItemPerPage
                            listItems={LIST_ITEM_PER_PAGE}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default SkyPointHistory;
