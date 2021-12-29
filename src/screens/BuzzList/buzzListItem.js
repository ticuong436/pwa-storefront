import React from 'react';
import { Link, resourceUrl } from '@skp/drivers';
import { useTranslation } from 'react-i18next';
import Moment from 'moment';

const BuzzListItem = prop => {
    const { t } = useTranslation(['product']);
    const { item } = prop;

    const buzzLink = resourceUrl(`/buzz/${item.category}/${item.id}`);

    const compareDate = Moment(item.date, 'DD MMM YYYY').add(1, 'M');
    const isNew = Moment().isBefore(compareDate);

    return (
        <div className="buzz-item">
            <Link to={buzzLink} className="buzz-img">
                <img src={item.banner} alt="" />
            </Link>
            <div className="buzz-info">
                {/* <div className="bshop-new">
                    <img src={newImage} alt="" />
                </div> */}
                <div className="mlisting-icon-hexagon-svg">
                    {isNew ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28.366"
                            height="30.925"
                            viewBox="0 0 35.366 37.925"
                        >
                            <g
                                id="Icon_New"
                                data-name="Icon — New"
                                transform="translate(0)"
                            >
                                <path
                                    id="パス_48"
                                    data-name="パス 48"
                                    d="M446.747,426.637l-13.5,7.474a4.344,4.344,0,0,1-4.185,0l-13.5-7.474a3.99,3.99,0,0,1-2.093-3.477V408.212a3.99,3.99,0,0,1,2.093-3.477l13.5-7.474a4.345,4.345,0,0,1,4.185,0l13.5,7.474a3.99,3.99,0,0,1,2.093,3.477V423.16A3.99,3.99,0,0,1,446.747,426.637Z"
                                    transform="translate(-413.474 -396.724)"
                                    fill="#baa9ad"
                                />
                                <text
                                    id="NEW"
                                    transform="translate(18.377 23.187)"
                                    fill="#fff"
                                    fontSize="12"
                                    fontFamily="Lato-Regular, Lato"
                                >
                                    <tspan x="-14.259" y="0">
                                        NEW
                                    </tspan>
                                </text>
                            </g>
                        </svg>
                    ) : null}
                </div>
                <Link
                    to={buzzLink}
                    className="buzz-info--title bshop-info--title"
                >
                    {item.title}
                </Link>
                <div className="buzz-date">
                    {item.date} - {item.category_label}
                </div>
                <div className="bshop-detail">
                    <Link to={buzzLink}>{t('product::View details')}</Link>
                </div>
            </div>
        </div>
    );
};

export default BuzzListItem;
