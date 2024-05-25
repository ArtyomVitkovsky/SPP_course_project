import { useEffect, useState } from "react";
import toast from 'react-hot-toast';

export const useAutocomplete = (allItems = [], predefinedSelectedItems = [], onSelect = () => {}) => {
  const [isDropDownHidden, setIsDropDownHidden] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  const handleOpenDropDown = (state) => {
    setIsDropDownHidden(state);
  };

  const handleSelectItem = async (item) => {
    if (!selectedItems.includes(item)) {
      const currentSelectedItems = selectedItems;
      currentSelectedItems.push(item);
      setSelectedItems(currentSelectedItems);
      onSelect(currentSelectedItems);
    } else {
      toast('Option already selected!');
    }
  };

  const handleUnselectItem = (currentItem) => {
    const currentSelectedItems = selectedItems.filter(item => item !== currentItem);
    setSelectedItems(currentSelectedItems);
    onSelect(currentSelectedItems);
  };

  const findOutSelectedItem = (item) => {
    return allItems.find(currItem => currItem.value === item);
  };

  useEffect(() => {
    setSelectedItems(predefinedSelectedItems);
  }, [predefinedSelectedItems]);

  return {
    isDropDownHidden,
    handleOpenDropDown,
    handleSelectItem,
    handleUnselectItem,
    findOutSelectedItem,
    selectedItems,
    search,
    setSearch
  };
}