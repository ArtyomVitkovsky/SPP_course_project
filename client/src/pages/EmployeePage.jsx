import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import PageCard from '../components/PageCard';
import { useEffect, useState } from 'react';
import VerticalMenu from '../components/SideMenu/VerticalMenu';
import useUsers from '../hooks/useUsers';
import useClients from '../hooks/useClients';
import useEmployees from '../hooks/useEmployees';
import * as constants from '../utilities/constants';


function EmployeePage({ user }) {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        isUsersLoading, userRoles, users, userData,
        handleUserDataChange, handleUserSelect, handleUserDataSave, handleUserDelete
    } = useUsers();

    const {
        isEmployeesLoading, employees, employeeData, employeeStatuses,
        handleEmployeeDataChange, handleEmployeeSelect, handleEmployeeDataSave
    } = useEmployees();

    const [isLoading, setIsLoading] = useState(true);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [isUserStorageReceived, setIsUserStorageReceived] = useState(false);

    useEffect(() => {
        setIsDataLoading(isUsersLoading || isEmployeesLoading);
    }, [isUsersLoading, isEmployeesLoading])

    useEffect(() => {
        setIsLoading(isDataLoading || !isUserStorageReceived);
    }, [isDataLoading, isUserStorageReceived])

    useEffect(() => {
        if (isDataLoading) return;

        let authorizedUserEmployee = {};

        console.log("user : ", user)

        if (employees.length > 0) authorizedUserEmployee = employees.find((employee) => employee.employeeUser.id == user.id);

        if (user) handleUserSelect(user);
        if (authorizedUserEmployee) handleEmployeeSelect(authorizedUserEmployee);

        console.log(`setIsUserStorageReceived(${!!user.id}) user id : ${user.id}`);

        setIsUserStorageReceived(!!user.id)
    }, [isDataLoading])


    const menuItems = [
        { name: 'Inbox', text: 'Inbox', iconName: 'EnvelopeIcon', iconClassName: 'EnvelopeIcon.js', url: '/employeePage/inbox' },
        { name: 'Projects', text: 'Projects', iconName: 'CodeBracketIcon', iconClassName: 'CodeBracketIcon.js', url: '/employeePage/projects' },
    ]

    const currentMenuItem = menuItems.find((item) => item.url === location.pathname)

    const [selectedMenuItem, setSelectedMenuItem] = useState(currentMenuItem?.name);

    const setSelecteMenuItemHandler = (name) => {
        setSelectedMenuItem(name)

        const menuItem = menuItems.find(i => i.name == name);
        if (menuItem) {
            navigate(menuItem.url)
        }
    }
    return (
        isLoading
            ? <div className='flex w-full h-full items-center justify-center'>
                <span>Loading...</span>
            </div>
            : <div className='py-10 h-full'>
                <PageCard headerText={employeeData.status.status}>
                    <VerticalMenu menuItems={menuItems} presettedValue={selectedMenuItem} onItemSelectAction={setSelecteMenuItemHandler}></VerticalMenu>
                    <Outlet />
                </PageCard>
            </div>
    )
}

export default EmployeePage;