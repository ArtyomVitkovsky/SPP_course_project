import Icon from "../Icon";

function MenuItem({ name, text, isSelected, onClickParentHandler, iconName, iconClassName }) {
    const onClickHandler = () => {
        onClickParentHandler(name);
    }

    return (
        <div
            className={'flex gap-2 items-center px-8 py-3 rounded-3xl cursor-pointer transition-all duration-300 ' + (isSelected ? 'bg-sky-100' : 'hover:bg-sky-50')}
            onClick={onClickHandler}
        >

            <div className={"flex w-5 h-5 " + (isSelected ? 'text-zinc-800' : 'text-zinc-600')}>
                <Icon iconName={iconName} iconClassName={iconClassName}></Icon>
            </div>

            <div className={'flex ' + (isSelected ? 'text-zinc-800 font-bold' : 'text-zinc-600')}>
                {text}
            </div>

        </div>
    )
}

export default MenuItem;