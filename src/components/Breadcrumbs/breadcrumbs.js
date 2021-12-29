import React from 'react';
import { arrayOf, shape, string } from 'prop-types';
import { Link, resourceUrl } from '@skp/drivers';
import { useTranslation } from 'react-i18next';
import { useBreadcrumbs } from './useBreadcrumbs';
import { Portal } from '@magento/venia-ui/lib/components/Portal';
import { isRunningInWebview} from "@skp/utils/webview"
import { useEffect } from 'react';
import { is } from '@babel/types';
const Breadcrumbs = ({ items }) => {
    const { t } = useTranslation(['common']);

    const { breadcrumbNode } = useBreadcrumbs();

    if (!items || !items.length) {
        return null;
    }
    let isMobile = window.localStorage.getItem('is_mobile') || false;
   useEffect(()=>{
        if(isRunningInWebview()){
            isMobile = true
        }
   },[])

    return (
        breadcrumbNode && (
            <Portal container={breadcrumbNode} >
                {
                    !isMobile ? < div className="bcrum" >
                        <Link className="bcrum-item" to={resourceUrl('/')}>
                            {t('common::Home')}
                        </Link>
                        <span className="bcrum-item">
                            <span> {'>'} </span>
                        </span>
                        {items.map((item, index) => (
                            <React.Fragment key={index}>
                                {item.url ? (
                                    <>
                                        <Link
                                            className="bcrum-item"
                                            to={item.url}
                                            key={index}
                                        >
                                            {item.title}
                                        </Link>
                                        <span className="bcrum-item">
                                            <span> {'>'} </span>
                                        </span>
                                    </>
                                ) : (
                                    <span className="bcrum-end">{item.title}</span>
                                )}
                            </React.Fragment>
                        ))}
                    </div> : null
                }
            </Portal>

        )
    );
};

Breadcrumbs.propTypes = {
    items: arrayOf(
        shape({
            title: string.isRequired,
            url: string
        }).isRequired
    )
};

export default Breadcrumbs;
