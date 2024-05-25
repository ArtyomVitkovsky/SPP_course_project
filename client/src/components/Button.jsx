import { useState } from "react";

function Button({ name, isLight = true, onClickAction }) {

    const onClickHandler = () => {
        onClickAction();
    }

    return (
        <button className={"rounded-xl border-[1px] transition ease-in-out " +
            (isLight
                ? "w-full h-full bg-white border-blue-200 hover:bg-blue-200 active:bg-blue-400"
                : "w-full h-full bg-blue-500 border-blue-200 hover:bg-blue-600 active:bg-blue-700")
        } onClick={onClickHandler}>
            <span className={"font-sans font-semibold " + (isLight ? "text-zinc-900" : "text-white")}>
                {name}
            </span>
        </button>
    );
}

export default Button;