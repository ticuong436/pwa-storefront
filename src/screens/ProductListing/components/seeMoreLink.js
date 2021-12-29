import React from 'react';

export default function SeeMoreLink({ url }) {
    return (
        <div className="features-buton">
            <a className="features-buton--link" href={url}>
                もっとみる
            </a>
        </div>
    );
}
