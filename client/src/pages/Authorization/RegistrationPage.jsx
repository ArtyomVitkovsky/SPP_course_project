import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import useUsers from '../../hooks/useUsers';
import useClients from '../../hooks/useClients';
import useEmployees from '../../hooks/useEmployees';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import Dropdown from '../../components/Dropdown';
import * as constants from '../../utilities/constants';
import { values } from 'pdf-lib';

function RegistrationPage({ onUserChanged }) {
    const navigate = useNavigate();

    const {
        isUsersLoading,
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

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(isUsersLoading || isClientsLoading || isEmployeesLoading);
    }, [isUsersLoading, isClientsLoading, isEmployeesLoading])

    const [userRole, setUserRole] = useState({});

    useEffect(() => {
        if (isLoading) return;

        const defaultRole = userRoles.find((role) => role.role == 'Employee');

        if (defaultRole) {
            setUserRole(defaultRole);
            userData.role = defaultRole;

            roleDropdownData.value = {
                key: userRole.id,
                value: userRole.role
            };
        }
    }, [isLoading])

    const roleDropdownData = {
        index: 0,
        label: 'Who are you ?',
        placeHolder: 'Select role',
        value: {
            key: userRole.id,
            value: userRole.role
        }
    };

    const getRoles = () => {
        const roleNames = [];

        userRoles.forEach((role) => {
            roleNames.push({
                key: role.id,
                value: role.role
            });
        })

        return roleNames;
    }

    const onUserRoleSelect = (index, userRole) => {
        const role = userRoles.find((r) => r.id == userRole.key);
        userData.role = role;
        setUserRole(role)
    }
    const getLayout = () => {
        return userRole.role == 'Client'
            ? <div className='flex flex-col gap-4'>
                <InputField label={'Company name'} placeHolder={'Company name'} required={true}
                    value={clientData.companyName} onValueChange={(e) => handleClientDataChange(e, 'companyName')}>
                </InputField>
                <InputField label={'Company address'} placeHolder={'Company address'} required={true}
                    value={clientData.address} onValueChange={(e) => handleClientDataChange(e, 'address')}>
                </InputField>
                <InputField label={'Phone number'} placeHolder={'Phone number'} required={true}
                    value={clientData.phoneNumber} onValueChange={(e) => handleClientDataChange(e, 'phoneNumber')}>
                </InputField>
            </div>
            : null
    }

    const navigateToAuth = () => {
        navigate('/authorization')
    }

    const signUp = async () => {
        if (users) {
            const existedUser = users.find((user) => user.email == userData.email);

            if (existedUser) {
                toast.error('User with same email already exists!');
                return;
            }
        }

        const user = await handleUserDataSave(userData);
        if (!user) return;

        if (userRole.role == 'Client') {
            clientData.clientUser = user;
            const client = await handleClientDataSave(clientData);
            if (!client) handleUserDelete(user)
            handleClientSelect(client);
        }
        else if (userRole.role == 'Employee') {
            employeeData.employeeUser = user;
            employeeData.status = employeeStatuses.find((status) => status.status == 'Idle');
            const employee = await handleEmployeeDataSave(employeeData);
            if (!employee) handleUserDelete(user)
            handleEmployeeSelect(employee);
        }

        sessionStorage.setItem(constants.authorizedUser, JSON.stringify(user));

        onUserChanged(user);

        const navigationUrl = constants.userRoleToPage[userData.role.role];
        navigate(navigationUrl)
    }

    return (
        <div className='w-full h-full'>
            {
                isLoading
                    ? <div className='flex w-full h-full items-center justify-center'>
                        <span>Loading...</span>
                    </div>
                    : <div className='w-full h-full'>
                        <div className='flex flex-col gap-4 w-full h-full items-center justify-center'>
                            <div className='flex justify-center items-center w-[300px] h-12'>
                                <span className='text-blue-500 font-semibold text-2xl'>Registration</span>
                            </div>
                            <div className='flex flex-col gap-4 min-w-[300px]'>
                                <Dropdown
                                    key={roleDropdownData.index}
                                    label={roleDropdownData.label}
                                    placeHolder={roleDropdownData.placeHolder}
                                    value={roleDropdownData.value}
                                    values={getRoles()}
                                    customClassName='min-w-[150px]'
                                    onValueChange={onUserRoleSelect}>
                                </Dropdown>
                                <div className='flex flex-col gap-4'>
                                    <InputField InputField type={'email'} label={'Email'} placeHolder={'Email'} required={true}
                                        value={userData.email} onValueChange={(e) => handleUserDataChange(e, 'email')}>
                                    </InputField >
                                    <div className='flex gap-1'>
                                        <InputField label={'First name'} placeHolder={'First Name'} required={true}
                                            value={userData.firstName} onValueChange={(e) => handleUserDataChange(e, 'firstName')}>
                                        </InputField>
                                        <InputField label={'Last name'} placeHolder={'Last name'} required={true}
                                            value={userData.lastName} onValueChange={(e) => handleUserDataChange(e, 'lastName')}>
                                        </InputField>
                                    </div>
                                    <InputField type={'password'} label={'Password'} placeHolder={'Password'} required={true}
                                        value={userData.password} onValueChange={(e) => handleUserDataChange(e, 'password')}>
                                    </InputField>
                                    {getLayout()}
                                </div>
                                <div className='mt-1 w-full h-[40px]'>
                                    <Button name={'Sign up'} isLight={false} onClickAction={signUp}></Button>
                                </div>
                                <div className='flex items-center justify-center mt-1 w-full'>
                                    <span className='text-blue-500 font-semibold text-sm underline cursor-pointer' onClick={navigateToAuth}>already have account ?</span>
                                </div>
                            </div>

                        </div>
                    </div>
            }
            <Toaster></Toaster>
        </div>

    )
}

export default RegistrationPage;