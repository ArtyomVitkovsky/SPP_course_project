import InputField from "./InputField";
import ButtonIcon from "./ButtonIcon";
import { useAutocomplete } from "../hooks/useAutocomplete";

const AutoCompleteCombobox = ({ onSearch = () => { }, onSelect = () => { }, isMultiSelect = false, allItems = [], searchItems = [], predefinedSelectedItems = [], position = 'right', label = '', }) => {
  const dropDownPosition = {
    left: '',
    right: 'right-0'
  };

  const {
    isDropDownHidden,
    handleOpenDropDown,
    handleSelectItem,
    handleUnselectItem,
    findOutSelectedItem,
    selectedItems,
    search,
    setSearch
  } = useAutocomplete(allItems, predefinedSelectedItems, onSelect);

  const handleSearch = (value) => {
    setSearch(value);
    onSearch(value);
  };

  return <>
    <div className="relative">
      {
        (isMultiSelect && selectedItems.length > 0) && <div className="flex flex-wrap gap-2 text-sm mb-2 font-semibold text-zinc-600 max-h-[80px] overflow-y-auto">
          {
            selectedItems.map((item, i) => {
              return <div key={i} className="bg-zinc-50 rounded-lg px-2 py-1 border flex items-center">
                <div className="mr-2">
                  {findOutSelectedItem(item)?.label}
                </div>
                <ButtonIcon iconName="XMarkIcon" type="outline" onClick={() => handleUnselectItem(item)} />
              </div>
            })
          }
        </div>
      }
      <InputField
        label={label}
        type="bordered"
      />
      {
        !isDropDownHidden && <div className="absolute w-full pt-1 z-10">
          <div className={"rounded-lg border border-zinc-100 bg-white shadow-lg max-h-[200px] overflow-y-auto " + dropDownPosition[position]}>
            {searchItems.length ?
              <ul className="py-2">
                {
                  searchItems.map((item, i) => {
                    return <li
                      key={i}
                      className="px-5 py-1 hover:bg-zinc-100 transition-all duration-300 cursor-pointer text-zinc-600 font-semibold text-sm"
                      onClick={() => handleSelectItem(item.value)}
                    >
                      {item.label} {item.additionalInfo && <span className="ml-3 italic text-zinc-400 text-sm">{item.additionalInfo}</span>}
                    </li>
                  })
                }
              </ul>
              : <div className="px-5 py-2 text-zinc-500 font-semibold text-sm">No items found...</div>
            }
          </div>
        </div>
      }
    </div>
    {
      !isDropDownHidden && <div className="absolute w-full h-full top-0 right-0" onClick={() => handleOpenDropDown(true)}></div>
    }
  </>
};

export default AutoCompleteCombobox;