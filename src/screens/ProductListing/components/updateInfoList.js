import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import GET_PILLAR_UPDATE_INFO from '@skp/screens/ProductListing/graphql/updateInfoList.graphql';
import SeeMoreLink from './seeMoreLink';
import { resourceUrl } from '@skp/drivers';
import Moment from 'moment';

const UpdateInfoList = ({ pillarCode }) => {
    const { data, loading: loading } = useQuery(GET_PILLAR_UPDATE_INFO, {
        fetchPolicy: 'network-only',
        variables: {
            pillar: pillarCode
        }
    });

    useEffect(() => {
        const groupNameEls = document.querySelectorAll('.js-group-name');
        if (groupNameEls.length) {
            const maxWidth = Math.max(
                ...Array.from(groupNameEls).map(element => element.clientWidth)
            );

            groupNameEls.forEach(
                element => (element.style.width = maxWidth + 'px')
            );
        }
    });

    if (loading) {
        return null;
    }

    if (!data.updateInfoList || !data.updateInfoList.items.length) {
        return null;
    }

    return (
        <div className="shopping-info">
            <div className="shopping-header">
                <h2 className="shopping-header__title">更新情報</h2>
            </div>
            <ul className="pillar-updateinfo">
                {data.updateInfoList.items.map(item => {
                    return (
                        <li
                            className="pillar-updateinfo-item"
                            key={item.news_id}
                        >
                            <a
                                className="pillar-updateinfo-item-link"
                                href={item.url}
                            >
                                <span className="pillar-updateinfo-item-date">
                                    {Moment(item.news_date).format('MM/DD')}
                                </span>
                                <span className="pillar-updateinfo-item-name">
                                    <span className="pillar-updateinfo-item-group-name js-group-name">
                                        {item.group_name}
                                    </span>
                                    <span className="pillar-updateinfo-item-title">
                                        {item.title}
                                    </span>
                                </span>
                            </a>
                        </li>
                    );
                })}
            </ul>
            <SeeMoreLink url={resourceUrl(pillarCode + '/summary')} />
        </div>
    );
};

export default UpdateInfoList;
