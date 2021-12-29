import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isRequired } from '@skp/utils/formValidators';
import { Form } from 'informed';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@skp/components/TextInput';
import DatePickerInput from '@skp/components/DatePickerInput';
import Modal from '@skp/components/Modal';
import RoomsInput from './roomsInput';
import searchInputForm from './css/searchInputForm.css';
import RoomSort from './roomSort';
import { Portal } from '@magento/venia-ui/lib/components/Portal';
import { saveCurrentSearch } from './utils/currentSearchParams';

function SearchInputForm({
    setRoomsInput,
    formApiRef,
    onInputKeyword,
    isSearching,
    handleSubmitSearch,
    onClickSuggestedKeyword,
    roomsInput,
    checkInDate,
    checkOutDate,
    rememberParams = false,
    keyword = '',
    totalCount = null,
    showSort = true,
    enableKeyword = true,
    hidenInputText,
    suggestedKeywords = [],
    onClickSortOption
}) {
    const { t } = useTranslation(['hotel', 'validation']);

    const inputSearchRef = useRef();

    const [roomModalIsOpen, setRoomModalIsOpen] = useState(false);

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [showSuggestion, setShowSuggestion] = useState(true);

    useEffect(() => {
        if (roomsInput && formApiRef && formApiRef.current && rememberParams) {
            const values = formApiRef.current.getValues();
            saveCurrentSearch(
                values.keyword,
                values.checkInDate,
                values.checkOutDate,
                roomsInput
            );
        }
    }, [formApiRef, rememberParams, roomsInput]);

    return (
        <>
            <Portal container={document.getElementById('hotels-sort')}>
                <RoomSort
                    onClickSortOption={onClickSortOption}
                    showSort={showSort}
                    totalCount={totalCount}
                />
            </Portal>
            <Modal id="modal-booking" isOpen={roomModalIsOpen}>
                <RoomsInput
                    initialRooms={roomsInput}
                    onCancel={() => setRoomModalIsOpen(false)}
                    onConfirm={rooms => {
                        setRoomsInput(rooms);
                        setRoomModalIsOpen(false);
                    }}
                />
            </Modal>
            <Form
                apiRef={formApiRef}
                className="result-key ex-search"
                onSubmit={values => {
                    if (rememberParams) {
                        saveCurrentSearch(
                            values.keyword,
                            values.checkInDate,
                            values.checkOutDate,
                            roomsInput
                        );
                    }
                    handleSubmitSearch(values);
                }}
            >
                <div className="ex-choose row">
                    {hidenInputText ? (
                        ''
                    ) : (
                        <div className="ex-choose-box col-md-4 col-12">
                            <Field
                                label={t('hotel::Search for destination')}
                                id="keyword"
                                classes={{
                                    root: 'control',
                                    label: 'ex-form--label'
                                }}
                            >
                                <TextInput
                                    autoComplete="off"
                                    placeholder={t(
                                        'hotel::Destination, enter hotel name'
                                    )}
                                    onChange={e => {
                                        onInputKeyword(e.target.value);
                                    }}
                                    onBlur={() => {
                                        setTimeout(
                                            () => setShowSuggestion(false),
                                            500
                                        );
                                    }}
                                    onFocus={() => setShowSuggestion(true)}
                                    ref={inputSearchRef}
                                    field="keyword"
                                    disabled={!enableKeyword}
                                    initialValue={keyword}
                                    id="keyword"
                                    validate={isRequired(t)}
                                    classes={{ input: 'ex-form' }}
                                    validateOnBlur
                                    validateOnChange
                                />
                                {inputSearchRef &&
                                    showSuggestion &&
                                    inputSearchRef.current ===
                                        document.activeElement &&
                                    suggestedKeywords.length > 0 && (
                                        <ul
                                            className="box-search__result d-block"
                                            style={{ left: 0, right: 0 }}
                                        >
                                            {suggestedKeywords.map(
                                                (keyword, index) => (
                                                    <li
                                                        key={index}
                                                        className="box-search__item cursor-pointer"
                                                        onClick={() =>
                                                            onClickSuggestedKeyword(
                                                                keyword
                                                            )
                                                        }
                                                    >
                                                        <span
                                                            className={`box-search__link ${
                                                                searchInputForm.boxSearchItem
                                                            }`}
                                                        >
                                                            {keyword}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                            <li className="box-search__item cursor-pointer">
                                                <span
                                                    className={`box-search__link ${
                                                        searchInputForm.boxSearchItem
                                                    }`}
                                                >
                                                    {`${t(
                                                        'hotel::Search for'
                                                    )} "${
                                                        inputSearchRef &&
                                                        inputSearchRef.current
                                                            ? inputSearchRef
                                                                  .current.value
                                                            : ''
                                                    }"`}
                                                </span>
                                            </li>
                                        </ul>
                                    )}
                            </Field>
                        </div>
                    )}
                    <div
                        className={
                            !hidenInputText
                                ? 'ex-choose-box col-md-2 col-12'
                                : 'ex-choose-box col-md-2 col-12'
                        }
                    >
                        <div className="control control-date-picker custom-date-delivery list-search-box">
                            <DatePickerInput
                                onValueChange={date => {
                                    if (date) {
                                        setStartDate(date);
                                        const checkOutDate = new Date(date);
                                        checkOutDate.setDate(
                                            date.getDate() + 1
                                        );
                                        formApiRef.current.setValue(
                                            'checkOutDate',
                                            checkOutDate
                                        );
                                    }
                                }}
                                className="ex-form"
                                peekNextMonth
                                dateFormat="yyyy-MM-dd"
                                minDate={new Date()}
                                startDate={startDate}
                                endDate={endDate}
                                selectsStart
                                autoComplete="off"
                                field="checkInDate"
                                validate={isRequired(t)}
                                initialValue={
                                    checkInDate ? new Date(checkInDate) : null
                                }
                                placeholderText={t('hotel::Unselected')}
                                validateOnBlur
                                validateOnChange
                            />
                            <span className="ex-form--label">
                                {t('hotel::Check-in date')}
                            </span>
                        </div>
                    </div>
                    <div
                        className={
                            !hidenInputText
                                ? 'ex-choose-box col-md-2 col-12'
                                : 'ex-choose-box col-md-2 col-12'
                        }
                    >
                        <div className="control control-date-picker custom-date-delivery list-search-box">
                            <DatePickerInput
                                className="ex-form"
                                peekNextMonth
                                dateFormat="yyyy-MM-dd"
                                minDate={new Date(startDate).setDate(
                                    startDate.getDate() + 1
                                )}
                                startDate={startDate}
                                endDate={endDate}
                                onValueChange={setEndDate}
                                selectsEnd
                                autoComplete="off"
                                field="checkOutDate"
                                validate={isRequired(t)}
                                initialValue={
                                    checkOutDate ? new Date(checkOutDate) : null
                                }
                                placeholderText={t('hotel::Unselected')}
                                validateOnBlur
                                validateOnChange
                            />
                            <span className="ex-form--label">
                                {t('hotel::Check-out date')}
                            </span>
                        </div>
                    </div>
                    <div
                        className={
                            !hidenInputText
                                ? 'ex-choose-box col-md-3 col-12'
                                : 'ex-choose-box col-md-3 col-6'
                        }
                    >
                        <div className="control">
                            <span
                                className="ex-form cursor-pointer"
                                onClick={() => setRoomModalIsOpen(true)}
                            >
                                {roomsInput.length > 0 &&
                                    `${roomsInput.reduce(
                                        (accumulator, currentValue) =>
                                            accumulator + currentValue.adults,
                                        0
                                    )} 大人, ${roomsInput.reduce(
                                        (accumulator, currentValue) =>
                                            accumulator +
                                            currentValue.children_and_ages
                                                .length,
                                        0
                                    )} 子供, ${roomsInput.length} 部屋`}
                            </span>
                            <span className="ex-form--label">
                                {t('hotel::Rooms and people')}
                            </span>
                        </div>
                    </div>
                    <div className="ex-choose-box col-md-1 col-12">
                        <button
                            type="submit"
                            disabled={isSearching}
                            className="ex-link--select btn-block"
                        >
                            {t('hotel::Search')}
                        </button>
                    </div>
                </div>
                <div className="ex-filter hide-xs">
                    {/* {!isSearching && (
                        <span className="ex-filter-text">
                            {totalCount === 0 &&
                                t('hotel::Found {{count}} hotels', {
                                    count: totalCount
                                })}
                        </span>
                    )} */}

                    <RoomSort
                        onClickSortOption={onClickSortOption}
                        showSort={showSort}
                        totalCount={totalCount}
                    />
                </div>
            </Form>
        </>
    );
}

export default SearchInputForm;
