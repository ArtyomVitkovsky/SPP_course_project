import { useEffect, useState } from 'react';
import InputField from './InputField';

function SelectableSearchBox({ values = [], valuesToExclude = [], onItemSelect = () => { } }) {

    const [inputValue, setInputValue] = useState('')
    const [currentValues, setCurrentValues] = useState([]);
    const [isShowValues, setIsShowValues] = useState(false);

    useEffect(() => {

        if (valuesToExclude.length) {
            const valuePerKey = valuesToExclude.reduce((valuePerKey, value) => {
                valuePerKey[value.key] = value;
                return valuePerKey;
            }, {});
            let filteredValues = values.filter(value => !valuePerKey[value.key]);
            filteredValues = filteredValues.filter(value => value.value.toLowerCase().includes(inputValue.toLowerCase()));
            setCurrentValues(filteredValues);
        } else {
            const filteredValues = values.filter(value => value.value.toLowerCase().includes(inputValue.toLowerCase()));
            setCurrentValues(filteredValues);
        }
    }, [valuesToExclude, inputValue]);

    const onInputValueChange = (e) => {
        setInputValue(e.target.value)
        setIsShowValues(currentValues.length > 0);
    }

    const onValueChangeHandler = (item) => {
        onItemSelect(item);
        setInputValue('');
        setIsShowValues(false);
    }

    const onInputFocus = () => {
        setIsShowValues(currentValues.length > 0);
    }

    const onBackdropClick = () => {
        setIsShowValues(false);
    }

    const dropDownValuesStyle = 'absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44';
    const dropDownButtonStyle = 'flex flex-col text-white w-full h-full font-medium rounded-lg text-sm';
    const backdropStyle = 'absolute inset-0 w-full h-full';

    return (
        <div className='flex flex-col w-full h-full'>
            <InputField
                onFocus={onInputFocus}
                customClassName={dropDownButtonStyle}
                label='Employees'
                placeHolder='Start writing...'
                value={inputValue}
                onValueChange={(e) => onInputValueChange(e)}
            />
            <div className={isShowValues ? backdropStyle : 'hidden ' + backdropStyle} onClick={onBackdropClick} />
            <div className='relative'>
                <div className={isShowValues ? dropDownValuesStyle : 'hidden ' + dropDownValuesStyle}>
                    <ul className='py-2 text-sm text-gray-700' aria-labelledby='dropdownDefaultButton'>
                        {
                            currentValues.length > 0 && currentValues.map((item, i) => {
                                return <li key={item.key} onClick={() => onValueChangeHandler(item)}>
                                    <a href='#' className='block px-4 py-2 hover:bg-gray-100'>{item.value}</a>
                                </li>
                            })
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default SelectableSearchBox;