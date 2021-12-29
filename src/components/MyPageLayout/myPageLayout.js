import React from 'react';
import { string } from 'prop-types';
import MenuDesk from './menuDesk';
import Breadcrumbs from '@skp/components/Breadcrumbs';
import PageTitleForMyPage from '@skp/components/PageTitleForMyPage';

export default function MyPageLayout({
    pageTitle,
    children,
    useDefaultBreadcrumbs = true
}) {
    return (
        <>
            <PageTitleForMyPage title={pageTitle} />
            {useDefaultBreadcrumbs && (
                <Breadcrumbs items={[{ title: pageTitle }]} />
            )}
            <div className="row">
                <div className="col-lg-3 col-md-12">
                    <MenuDesk />
                </div>
                <div className="col-lg-9 col-md-12">{children}</div>
            </div>
        </>
    );
}

MyPageLayout.propTypes = {
    pageTitle: string.isRequired
};
