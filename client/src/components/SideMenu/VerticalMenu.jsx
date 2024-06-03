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
        <div className="relative before:block before:bg-sky-900 before:absolute before:h-[100px] before:w-full inset-0">
            <div className="flex flex-col gap-2 w-full h-full min-h-[750px] rounded-t-3xl relative bg-white p-3">
                {getMenuItems()}
            </div>
        </div>
    )
}

export default VerticalMenu;