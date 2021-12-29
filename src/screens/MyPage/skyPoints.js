import React from 'react';
import MyPageLayout from '@skp/components/MyPageLayout';
import SkyPointHistory from '@skp/components/SkyPointHistory';

const SkyPoints = () => {
    return (
        <MyPageLayout pageTitle="SKY POINTS">
            <SkyPointHistory />
        </MyPageLayout>
    );
};

export default SkyPoints;
