import { useState } from "react";
import Icon from "../Icon"; 

function MenuItem({ name, text, isSelected, onClickParentHandler, iconName, iconClassName }) {
    const onClickHandler = () => {
        onClickParentHandler(name);
    }

    return (

        <div className={isSelected
            ? "flex gap-2 items-center px-8 rounded-md hover:bg-blue-50 transition ease-in-out w-full h-12"
            : "flex gap-2 items-center px-8 rounded-md hover:bg-blue-50 transition ease-in-out w-full h-12"}
            onClick={onClickHandler}>
            <div className="flex w-5 h-5">
                <Icon iconName={iconName} iconClassName={iconClassName}></Icon>
            </div>
            <div className={isSelected
                ? "flex justify-start items-center font-bold text-zinc-900 text-base w-full h-full"
                : "flex justify-start items-center font-semibold text-zinc-400 text-base w-full h-full"}>
                <span className="align-middle cursor-default">{text}</span>
            </div>

        </div>
    )
}

export default MenuItem;