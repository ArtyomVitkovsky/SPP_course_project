function Button({ name, isLight = true, isBordered = false, onClickAction = () => {} }) {
    const buttonStyle = isLight ? "bg-white hover:bg-sky-50 active:bg-sky-100" : "bg-sky-900 hover:bg-sky-950 active:bg-sky-950";
    const buttonBordered = isBordered ? 'border' : '';

    const onClickHandler = () => {
        onClickAction();
    };

    return (
        <button className={"rounded-3xl transition-all duration-300 py-1 px-4 " + buttonStyle + ' ' + buttonBordered} onClick={onClickHandler}>
            <span className={"text-sm font-semibold " + (isLight ? "text-zinc-800" : "text-white")}>
                {name}
            </span>
        </button>
    );
}

export default Button;