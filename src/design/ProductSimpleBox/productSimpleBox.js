import React from 'react';
import {
    bool,
    node,
    number,
    oneOfType,
    shape,
    string,
    object
} from 'prop-types';
import { useTranslation } from 'react-i18next';
import css from './productSimpleBox.css';
import { SPECIAL_FONT_SIZE_BY_NAME_XS } from '@skp/config';
import ExternalSupportLink from '@skp/components/ExternalSupportLink';

function ProductSimpleBox({
    product,
    detailUrl,
    action,
    detailAction,
    additionalInfo,
    onProductClick = null
}) {
    const { t } = useTranslation(['product']);

    return (
        <>
            <ExternalSupportLink
                className="result-img"
                to={detailUrl}
                onClick={onProductClick}
            >
                <img src={product.image} alt="" />
            </ExternalSupportLink>
            <div className="result-box">
                {additionalInfo && (
                    <span className="result-coundown">{additionalInfo}</span>
                )}
                <div className="result-cate">
                    {action ? (
                        <div className="result-status pro-status">
                            {product.is_new && (
                                // <div className={css.newIcon}>
                                <div className="reg-hexagon-svg">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="35.366"
                                        height="37.925"
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
                                </div>
                            )}
                        </div>
                    ) : (
                        <span />
                    )}
                    <span className="text-pillar">{product.pillar_name}</span>
                    <div className="d-flex">{action ? action : <span />}</div>
                </div>
                <ExternalSupportLink
                    className={
                        SPECIAL_FONT_SIZE_BY_NAME_XS.includes(product.name)
                            ? 'result-box--title result-box--title__special'
                            : 'result-box--title'
                    }
                    to={detailUrl}
                    onClick={onProductClick}
                >
                    {product.name}
                </ExternalSupportLink>
                <div className={'result-sub' + ' ' + css.simpleBox}>
                    {product.pillar_name === 'Shopping'
                        ? product.service_name
                            ? product.service_name
                            : ''
                        : product.service_name}
                </div>
                <div className="result-btn">
                    {detailAction ? (
                        detailAction
                    ) : (
                        <ExternalSupportLink
                            className="result--submit"
                            to={detailUrl}
                            onClick={onProductClick}
                        >
                            {t('product::View details')}
                        </ExternalSupportLink>
                    )}
                </div>
            </div>
        </>
    );
}

ProductSimpleBox.propTypes = {
    product: shape({
        id: oneOfType([number, string]).isRequired,
        name: string.isRequired,
        is_new: bool,
        pillar_name: string,
        service_name: string,
        /**
         * Image url
         */
        image: string
    }).isRequired,
    detailUrl: oneOfType([
        string,
        shape({
            pathname: string.isRequired,
            state: object
        })
    ]).isRequired,
    /**
     * Action can be wishlist icon or restock delete icon
     * When page builder call this component, action will be set null. In this case this component doesn't show New and Favorite icon, both.
     */
    action: node,
    detailAction: node,
    additionalInfo: node
};

export default ProductSimpleBox;
