import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import useUsers from "../../hooks/useUsers";
import useClients from '../../hooks/useClients';
import useEmployees from '../../hooks/useEmployees';
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import * as constants from '../../utilities/constants';


function AuthorizationPage({ onUserChanged }) {
    const navigate = useNavigate();

    const {
        isLoading,
        userRoles,
        users,
        userData,
        handleUserDataChange,
        handleUserSelect,
        handleUserDataSave,
        handleUserDelete
    } = useUsers();

    const {
        isClientsLoading,
        clients,
        clientData,
        handleClientDataChange,
        handleClientSelect,
        handleClientDataSave
    } = useClients();

    const {
        isEmployeesLoading,
        employees,
        employeeData,
        employeeStatuses,
        handleEmployeeDataChange,
        handleEmployeeSelect,
        handleEmployeeDataSave
    } = useEmployees();

    const onDataChange = (event, field) => {
        handleUserDataChange(event, field);
    }

    const navigateToRegistration = () => {
        navigate("/registration")
    }

    const authorize = () => {
        const existedUser = users.find((user) => user.email == userData.email && user.password == userData.password);

        if (!existedUser) {
            toast.error("incorrect email or password");
            return;
        }

        sessionStorage.setItem(constants.authorizedUser, JSON.stringify(existedUser));
        onUserChanged(existedUser);

        navigate(constants.userRoleToPage[existedUser.role.role])
    }

    return (
        <div className="w-full h-full">
            {
                isLoading
                    ? null
                    : <div className="w-full h-full">
                        <div className="flex flex-col gap-4 w-full h-full items-center justify-center">
                            <div className="flex justify-center items-center w-[300px] h-12">
                                <span className="text-blue-500 font-semibold text-2xl">Authorization</span>
                            </div>
                            <div className="flex flex-col gap-4 min-w-[300px]">
                                <InputField InputField type={"email"} label={"Email"} placeHolder={"Email"} required={true}
                                    value={userData.email} onValueChange={(e) => onDataChange(e, "email")}>
                                </InputField>
                                <InputField InputField type={"password"} label={"Password"} placeHolder={"Password"} required={true}
                                    value={userData.password} onValueChange={(e) => onDataChange(e, "password")}>
                                </InputField >
                                <div className="mt-1 w-full h-[40px]">
                                    <Button name={"Sign in"} isLight={false} onClickAction={authorize}></Button>
                                </div>
                                <div className="flex items-center justify-center mt-1 w-full">
                                    <span className="text-blue-500 font-semibold text-sm underline cursor-pointer"
                                        onClick={navigateToRegistration}>don't have account ?</span>
                                </div>
                            </div>

                        </div>
                    </div>
            }

            <Toaster></Toaster>
        </div>

    )
}

export default AuthorizationPage;