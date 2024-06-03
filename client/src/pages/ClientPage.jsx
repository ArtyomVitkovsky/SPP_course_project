import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import PageCard from '../components/PageCard';
import { useEffect, useState } from 'react';
import VerticalMenu from '../components/SideMenu/VerticalMenu';
import useUsers from '../hooks/useUsers';
import useClients from '../hooks/useClients';
import useEmployees from '../hooks/useEmployees';
import * as constants from '../utilities/constants';
import useProjects from '../hooks/useProjects';

function ClientPage({ user }) {
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

    const [isLoading, setIsLoading] = useState(true);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [isUserStorageReceived, setIsUserStorageReceived] = useState(false);

    useEffect(() => {
        setIsDataLoading(isUsersLoading || isClientsLoading);
    }, [isUsersLoading, isClientsLoading])

    useEffect(() => {
        setIsLoading(isDataLoading || !isUserStorageReceived);
    }, [isDataLoading, isUserStorageReceived])

    useEffect(() => {
        if (isDataLoading) return;

        let authorizedUserClient = {};

        if (clients.length > 0) authorizedUserClient = clients.find((client) => client.clientUser.id == user.id);

        if (user) handleUserSelect(user);
        if (authorizedUserClient) handleClientSelect(authorizedUserClient);

        setIsUserStorageReceived(!!user.id)
    }, [isDataLoading])


    const menuItems = [
        { name: 'Sended', text: 'Sended', iconName: 'PaperAirplaneIcon', iconClassName: 'PaperAirplaneIcon.js', url: '/clientPage/sended' },
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