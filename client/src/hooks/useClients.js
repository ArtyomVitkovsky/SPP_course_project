import { useState, useEffect } from "react";
import { getClients, setClient } from "../services/ClientsService";
import toast from "react-hot-toast";

const useClients = (url) => {
    const [clients, setClients] = useState([]);

    const [isClientsLoading, setIsLoading] = useState(true);
    const [clientData, setClientData] = useState({});

    const handleClientDataChange = (event, field) => {
        const value = event.target.value;

        setClientData(data => ({ ...data, [field]: value }))
    }

    const handleClientSelect = (client) => {
        setClientData(client)
    }

    const handleClientDataSave = async (client) => {
        try {
            const result = await setClient(client);
            getAllClients();

            return result;
        } catch (error) {
            toast.error(error?.message || 'Unknown error');
        }
    }

    const getAllClients = async () => {
        const result = await getClients();
        setClients(result);
    }

    const getData = async () => {
        setIsLoading(true);
        try {
            await getAllClients();

        } catch (error) {
            toast.error(error?.message || 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return { isClientsLoading, clients, clientData, handleClientDataChange, handleClientSelect, handleClientDataSave };
};

export default useClients;