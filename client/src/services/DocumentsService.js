import axios from 'axios';
import * as constants from '../utilities/constants';

export const getDocuments = async () => {
    try {
        const result = await axios.get(constants.getDocuments);
        return result.data;
    } catch (error) {
        throw new Error(error?.response?.data || 'Unknown error');
    }
}

export const setDocument = async (documentData) => {
    try {
        const result = await axios.post(constants.setDocument, documentData);

        return result.data;
    } catch (error) {
        throw new Error(error?.response?.data || 'Unknown error');
    }
}

export const deleteDocument = async (documentData) => {
    try {
        await axios.post(constants.deleteDocument, documentData);
    } catch (error) {
        throw new Error(error?.response?.data || 'Unknown error');
    }
}

export const getUserDocumentStatuses = async () => {
    try {
        const result = await axios.get(constants.getUserDocumentStatuses);
        return result.data;
    } catch (error) {
        throw new Error(error?.response?.data || 'Unknown error');
    }
}

export const setUserDocumentStatus = async (userDocumentData) => {
    try {
        await axios.post(constants.setUserDocumentStatus, userDocumentData);
    } catch (error) {
        throw new Error(error?.response?.data || 'Unknown error');
    }
}

export const getDocumentNotifications = async () => {
    try {
        const result = await axios.get(constants.getDocumentNotifications);
        return result.data;
    } catch (error) {
        throw new Error(error?.response?.data || 'Unknown error');
    }
}