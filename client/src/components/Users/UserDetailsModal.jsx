import Modal from "../Modal"
import InputField from "../InputField"
import Button from "../Button"

function UserDetailsModal({ user, onDataChange, onSaveClick, onCloseClick }) {

    const onSaveButtonClick = () => {
        onSaveClick();
    }

    const buttons = [
        {
            name: "Save",
            isLight: false,
            width_rem: 6,
            height_rem: 2.5,
            onClickAction: onSaveButtonClick
        }
    ]

    return (
        <Modal title={"user details"} onCloseClick={onCloseClick} buttons={buttons}>
            <div className="flex flex-col gap-4">
                <div className="flex gap-5">
                    <InputField label={"First name"} placeHolder={"First name"} value={user?.firstName} onValueChange={(e) => onDataChange(e, "firstName")}></InputField>
                    <InputField label={"Last name"} placeHolder={"Last name"} value={user?.lastName} onValueChange={(e) => onDataChange(e, "lastName")} customClassName={"flex-1"}></InputField>
                </div>
                <InputField label={"Email"} placeHolder={"Email"} value={user?.email} onValueChange={(e) => onDataChange(e, "email")}></InputField>
                <InputField type="password" label={"Password"} placeHolder={"Password"} value={user?.password} onValueChange={(e) => onDataChange(e, "password")}></InputField>
            </div>
        </Modal>
    )
}

export default UserDetailsModal