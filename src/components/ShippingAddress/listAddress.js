import React from 'react';
import Address from './address';
import { useListAddress } from './useListAddress';
import LoadingIndicator from '@skp/components/LoadingIndicator';
import PopupConfirm from '@skp/components/PopupConfirm';
import { useHistory, resourceUrl } from '@skp/drivers';
import MainPageTitle from '@skp/components/MainPageTitle';
import AlertMessage from '@skp/components/AlertMessage';
import { useTranslation } from 'react-i18next';

function ListAddress({ selectedAddress, onClick }) {
    const {
        addresses,
        isLoadingAddresses,
        openConfirmation,
        closeConfirmation,
        isOpenConfirm,
        inProgress,
        handleDeleteAddress
    } = useListAddress();

    const history = useHistory();
    const { t } = useTranslation(['checkout']);

    if (isLoadingAddresses) {
        return <LoadingIndicator />;
    }

    const titlePopupConfirm = (
        <p className="modal-customize__des">
            Are you sure you want to delete this address?
        </p>
    );

    return (
        <div className="credit-shipping">
            <PopupConfirm
                title={titlePopupConfirm}
                onCancel={() => {
                    closeConfirmation();
                }}
                onConfirm={() => {
                    handleDeleteAddress();
                }}
                isLoading={inProgress}
                isOpen={isOpenConfirm}
            />
            <MainPageTitle title="Shipping information"/>
            <div className="select-address">
                <div className="select-location">
                    <div className="row">
                        {addresses.length > 0 ? (
                            addresses.map(address => (
                                <div
                                    className="col-lg-6 col-md-12"
                                    key={address.id}
                                >
                                    <Address
                                        address={address}
                                        isSelected={
                                            selectedAddress
                                                ? selectedAddress.id ===
                                                  address.id
                                                : address.default_shipping
                                        }
                                        onSelect={() =>
                                            onClick && onClick(address)
                                        }
                                        onClickEdit={() => {
                                            history.push({
                                                pathname: resourceUrl(
                                                    `/mypage/shipping-address/edit/${
                                                        address.id
                                                    }`
                                                )
                                            });
                                        }}
                                        showEdit={true}
                                        onClickDelete={() => {
                                            openConfirmation(address);
                                        }}
                                        allowDelete={!address.default_shipping}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-md-12">
                                <AlertMessage type="warning">
                                    {t(
                                        "checkout::You haven't had any saved address yet."
                                    )}
                                </AlertMessage>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="credit-shipping__button">
                <button
                    className="button button--primary"
                    href="#"
                    onClick={e => {
                        e.preventDefault();
                        history.push(
                            resourceUrl('/mypage/shipping-address/add')
                        );
                    }}
                >
                    Add new shipping address
                </button>
            </div>
        </div>
    );
}

export default ListAddress;
