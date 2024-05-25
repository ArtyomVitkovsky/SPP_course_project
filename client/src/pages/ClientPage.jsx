import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import PageCard from '../components/PageCard';
import { useEffect, useState } from 'react';
import VerticalMenu from '../components/SideMenu/VerticalMenu';
import useUsers from '../hooks/useUsers';
import useClients from '../hooks/useClients';
import useEmployees from '../hooks/useEmployees';
import * as constants from '../utilities/constants';

function ClientPage() {
    const navigate = useNavigate();
    const location = useLocation();

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
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [isUserStorageReceived, setIsUserStorageReceived] = useState(false);

    useEffect(() => {
        setIsDataLoading(isUsersLoading || isClientsLoading || isEmployeesLoading);
    }, [isUsersLoading, isClientsLoading, isEmployeesLoading])

    useEffect(() => {
        setIsLoading(isDataLoading || !isUserStorageReceived);
    }, [isDataLoading, isUserStorageReceived])

    useEffect(() => {
        if (isDataLoading) return;

        const authorizedUserJSON = sessionStorage.getItem(constants.authorizedUser);

        let authorizedUser = userData;
        let authorizedUserClient = {};
        let authorizedUserEmployee = {};

        if (authorizedUserJSON) authorizedUser = JSON.parse(authorizedUserJSON);

        if (clients.length > 0) authorizedUserClient = clients.find((client) => client.clientUser.id == authorizedUser.id);

        if (employees.length > 0) authorizedUserEmployee = employees.find((employee) => employee.employeeUser.id == authorizedUser.id);

        if (authorizedUser) handleUserSelect(authorizedUser);
        if (authorizedUserClient) handleClientSelect(authorizedUserClient);
        if (authorizedUserEmployee) handleEmployeeSelect(authorizedUserEmployee);

        setIsUserStorageReceived(!!authorizedUser.id)
    }, [isDataLoading])


    const menuItems = [
        { name: 'Sended', text: 'Sended', iconName: 'PaperAirplaneIcon', iconClassName: 'PaperAirplaneIcon.js', url: '/clientPage/sended' },
        { name: 'Inbox', text: 'Inbox', iconName: 'EnvelopeIcon', iconClassName: 'EnvelopeIcon.js', url: '/clientPage/inbox' },
        { name: 'Projects', text: 'Projects', iconName: 'CodeBracketIcon', iconClassName: 'CodeBracketIcon.js', url: '/clientPage/projects' },
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
                <PageCard headerText={clientData.companyName}>
                    <VerticalMenu menuItems={menuItems} presettedValue={selectedMenuItem} onItemSelectAction={setSelecteMenuItemHandler}></VerticalMenu>
                    <Outlet />
                </PageCard>
            </div>
    )
}

export default ClientPage;