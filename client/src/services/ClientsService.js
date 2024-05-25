import axios from 'axios';
import * as constants from '../utilities/constants';

export const getClients = async () => {
    try {
        const result = await axios.get(constants.getClients);

        return result.data;
    } catch (error) {
        throw new Error(error?.response?.data || 'Get clients : Unknown error');
    }
}

export const setClient = async (clientData) => {
    try {
        const result = await axios.post(constants.setClient, clientData);
        return result.data;
    } catch (error) {
        throw new Error(error?.response?.data || 'Set client : Unknown error');
    }
}
