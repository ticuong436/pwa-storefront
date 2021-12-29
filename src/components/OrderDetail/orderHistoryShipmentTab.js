import React from 'react';
import { useTranslation } from 'react-i18next';
import TargetBlankLink from '@skp/components/TargetBlankLink';

export const OrderHistoryShipmentTab = props => {
    const { shipments } = props;
    const { t } = useTranslation(['mypage']);

    return (
        <>
            <div className="tab-pane fade shipment show active">
                {shipments.map((shipment, index) => (
                    <div className="table-customize" key={index}>
                        {shipment.tracking && shipment.tracking.length
                            ? shipment.tracking.map(track => {
                                  return (
                                      <div
                                          className="order-title shippment-block"
                                          key={track.number}
                                      >
                                          <div>
                                              <strong className="tracking-title">
                                                  {t(
                                                      'mypage::Delivery Slip number'
                                                  )}
                                                  ：
                                              </strong>
                                              {track.number}
                                              <strong className="tracking-title">
                                                  {'  '}
                                                  {t(
                                                      'mypage::Delivery Company'
                                                  )}
                                                  ：
                                              </strong>
                                              {track.shipping_company_name}
                                              <strong className="tracking-title">
                                                  {'  '}
                                                  {t(
                                                      'mypage::Expected Shipping Date'
                                                  )}
                                                  ：
                                              </strong>
                                              {track.shipping_date}
                                          </div>

                                          {track.shipping_track_link ? (
                                              <TargetBlankLink
                                                  style={{ color: 'blue' }}
                                                  href={
                                                      track.shipping_track_link
                                                  }
                                                  rel="noopener"
                                                  className="action track"
                                              >
                                                  {t(
                                                      'mypage::Track this shipment'
                                                  )}
                                              </TargetBlankLink>
                                          ) : (
                                              ''
                                          )}
                                      </div>
                                  );
                              })
                            : ''}
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>{t('mypage::Product Name')}</th>
                                    <th>{t('mypage::Product SKU')}</th>
                                    <th>{t('mypage::Shipped')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shipment.items &&
                                    shipment.items.length &&
                                    shipment.items.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.product_name}</td>
                                            <td>{item.product_sku}</td>
                                            <td>{item.quantity_shipped}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </>
    );
};
