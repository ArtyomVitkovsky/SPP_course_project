import { useEffect, useState } from 'react'

function Dropdown({ index, label, placeHolder, value, values = [], valuesToExclude = [], customClassName = '', onValueChange, isChangeable = true }) {
    const [selectedValue, setSelectedValue] = useState();
    const [isShowValues, setIsShowValues] = useState(false);
    const [currentValues, setCurrentValues] = useState([]);

    const onValueChangeHandler = (item) => {
        if (!isChangeable) return;

        setSelectedValue(item.value);
        onValueChange(index, item);

        setIsShowValues(false);
    }

    const onDropDownClickHandler = () => {
        if (!isChangeable) return;

        if (currentValues.length) {
            setIsShowValues(!isShowValues);
        }
    }

    useEffect(() => {
        
        if (valuesToExclude.length) {
            const valuePerKey = valuesToExclude.reduce((valuePerKey, value) => {
                valuePerKey[value.key] = value;
                return valuePerKey;
            }, {});
            const filteredValues = values.filter(value => !valuePerKey[value.key]);
            setCurrentValues(filteredValues);
        } else {
            setCurrentValues(values);
        }
    }, [valuesToExclude]);

    const dropDownValuesStyle = 'absolute z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44';
    const dropDownButtonStyle =
        'flex justify-between w-full max-w-[200px] text-white bg-blue-400' +
        'hover: bg-blue-500' +
        'focus: bg-blue-500 focus: outline-none focus: ring-blue-300' +
        'font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center'


    return (
        <div className={customClassName}>
            <label className='block mb-2 text-sm font-medium text-gray-900'>{label}</label>
            <button id='dropdownButton'
                className={dropDownButtonStyle} type='button'
                onClick={() => onDropDownClickHandler()} onBlur={() => { setTimeout(() => setIsShowValues(false), 100) }}>
                <span className='truncate'>
                    {selectedValue == null
                        ? value.value == null ? placeHolder : value.value
                        : selectedValue}
                </span>
                {
                    isChangeable
                        ? <svg className='w-2.5 h-2.5 ms-3' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 10 6'>
                            <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m1 1 4 4 4-4' />
                        </svg>
                        : null
                }
            </button>
            <div id={'dropdown_' + index}
                className={isShowValues ? dropDownValuesStyle : 'hidden ' + dropDownValuesStyle}>
                <ul className='py-2 text-sm text-gray-700' aria-labelledby='dropdownDefaultButton'>
                    {
                        currentValues.map((item, i) => {
                            return <li
                                key={item.key}
                                onClick={() => onValueChangeHandler(item)}
                            >
                                <a href='#' className='block px-4 py-2 hover:bg-gray-100'>{item.value}</a>
                            </li>
                        })
                    }
                </ul>
            </div>

        </div>
    )
}

export default Dropdown