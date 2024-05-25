import { useState } from "react";
import useUsers from "../hooks/useUsers";
import Button from "../components/Button";
import Table from "../components/Table";
import UserDetailsModal from "../components/Users/UserDetailsModal";

function UsersPage() {
    const {
        isLoading,
        userRoles,
        users,
        userData,
        handleUserDataChange,
        handleUserSelect,
        handleUserDataSave,
        handleUserDelete } = useUsers();

    const [isShowModal, setIsShowModal] = useState(false);

    const onCloseModalClick = () => {
        setIsShowModal(false);
        handleUserSelect(null);
    }

    const onSaveButtonClick = () => {
        setIsShowModal(false);
        handleUserDataSave(userData);
        handleUserSelect(null);
    }

    const onDeleteUserClick = (user) => {
        handleUserDelete(user)
    }

    const onEditClick = (user) => {
        handleUserSelect(user);
        setIsShowModal(true);
    }


    const columns = [
        "id", "email", "firstName", "lastName", "password"
    ]


    const actionColumns = [
        { type: 'outline', title: 'Edit', iconName: 'TrashIcon', action: (user) => onDeleteUserClick(user) },
        { type: 'outline', title: 'Delete', iconName: 'PencilSquareIcon', action: (user) => onEditClick(user) }
    ]


    return (
        <div className="w-full h-full">
            <div className="w-full bg-blue-400 p-2 border-t-slate-50 border-solid border-t rounded-lg">
                <div className="w-[150px] h-full">
                    <Button name={"Add User"} isLight={true} width_rem={6} height_rem={2} onClickAction={() => setIsShowModal(true)}></Button>
                </div>
            </div>
            <Table data={users}
                columns={columns}
                actionsColumns={actionColumns}
                columnsToExclude={["id", "password"]}>
            </Table>

            {
                isShowModal &&
                <UserDetailsModal
                    user={userData}
                    onDataChange={handleUserDataChange}
                    onSaveClick={onSaveButtonClick}
                    onCloseClick={onCloseModalClick}>
                </UserDetailsModal>
            }
        </div>
    )
}

export default UsersPage;