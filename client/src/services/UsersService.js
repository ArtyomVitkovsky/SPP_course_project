import axios from 'axios';
import * as constants from '../utilities/constants';

export const getUsers = async () => {
    try {
        const result = await axios.get(constants.getUsers);

        return result.data;
    } catch (error) {
        throw new Error(error?.response?.data || 'Get users : Unknown error');
    }
}

export const setUser = async (userData) => {
    try {
        const result = await axios.post(constants.setUser, userData)
        return result.data;
    } catch (error) {
        throw new Error(error?.response?.data || 'Set user : Unknown error');
    }
}

export const deleteUser = async (userData) => {
    try {
        await axios.post(constants.deleteUser, userData)
    } catch (error) {
        throw new Error(error?.response?.data || 'Delete user : Unknown error');
    }
}

export const getUserRoles = async () => {
    try {
        const result = await axios.get(constants.getUserRoles);
        return result.data;
    } catch (error) {
        throw new Error(error?.response?.data || 'Get user roles : Unknown error')
    }
}

export const authorizeUser = async () => {
    try {

    } catch (error) {
        throw new Error(error?.response?.data || 'User authorization : Unknown Error')
    }
}