import { useState } from "react";
import MenuItem from "./MenuItem";

function VerticalMenu({ menuItems, presettedValue, onItemSelectAction }) {
    const [selectedItem, setSelectedItem] = useState(presettedValue);

    const listItems = [];

    const setItemsSelectionStatus = (name) => {
        onItemSelectAction(name);
        setSelectedItem(name);
    }

    const getMenuItems = () => {
        listItems.length = 0;

        for (let i = 0; i < menuItems.length; i++) {
            listItems.push(
                <MenuItem
                    key={i}
                    name={menuItems[i].name}
                    text={menuItems[i].text}
                    isSelected={selectedItem == menuItems[i].name}
                    onClickParentHandler={setItemsSelectionStatus}
                    iconName={menuItems[i].iconName}
                    iconClassName={menuItems[i].iconClassName}>
                </MenuItem>);
        }
        return listItems;
    };

    return (
        <div className="flex flex-col gap-2 w-full h-full min-h-[750px] p-2 border-r-2 border-solid border-blue-50 border-rad">
            {getMenuItems()}
        </div>
    )
}

export default VerticalMenu;