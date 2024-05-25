import { useState, useEffect } from "react";
import { getUsers, setUser, deleteUser, getUserRoles } from "../services/UsersService";
import toast from "react-hot-toast";

const useUsers = (url) => {
    const [users, setUsers] = useState([]);
    const [userRoles, setUserRoles] = useState({});

    const [isUsersLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState({});


    const handleUserDataChange = (event, field) => {
        const value = event.target.value;
        setUserData(data => ({ ...data, [field]: value }))
    }

    const handleUserSelect = (user) => {
        setUserData(user)
    }

    const handleUserDataSave = async (user) => {
        try {
            const savedUser = await setUser(user);
            setUserData(savedUser);
            getData();

            return savedUser;
        } catch (error) {
            toast.error(error?.message || 'Save user : Unknown error');
            return null;
        }
    }

    const handleUserDelete = async (user) => {
        try {
            await deleteUser(user);
            getData();
        }
        catch (error) {
            toast.error(error?.message || 'Delete user : Unknown error');
        }
    }

    const getAllUsers = async () => {
        const result = await getUsers();
        setUsers(result);
    }

    const getAllUserRoles = async () => {
        const result = await getUserRoles();
        setUserRoles(result);
    }

    const getData = async () => {
        setIsLoading(true);
        try {
            await getAllUserRoles();
            await getAllUsers();

        } catch (error) {
            toast.error(error?.message || 'Get user : Unknown error');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return { isUsersLoading, userRoles, users, userData, handleUserDataChange, handleUserSelect, handleUserDataSave, handleUserDelete };
};

export default useUsers;