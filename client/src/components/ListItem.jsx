function ListItem({ props }) {

    const onClickHandler = () => {
        props.onClickParentHandler(props.itemIndex);
    }

    const getColumns = () => {
        const listItems = [];
        for (let i = 0; i < props.columns.length; i++) {
            listItems.push(
                <td className="px-6 py-4 text-center w-full h-16">{props.columns[i]} </td>
            );
        }
        return listItems;
    }

    return (
        <tr className={props.isSelected
            ? "bg-gradient-to-r from-blue-300 to-blue-100 hover:bg-blue-100 transition ease-in-out"
            : "bg-slate-50 hover:bg-blue-100 transition ease-in-out"}>
            {getColumns()}
        </tr>
    )
}

export default ListItem;