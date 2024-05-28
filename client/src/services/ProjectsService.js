import axios from 'axios';
import * as constants from '../utilities/constants';

export const getProjects = async () => {
    try {
        const result = await axios.get(constants.getProjects);

        return result.data;
    } catch (error) {
        throw new Error(error?.response?.data || 'Get projects : Unknown error');
    }
}

export const setProject = async (projectData) => {
    try {
        const result = await axios.post(constants.setProject, projectData);
        return result.data;
    } catch (error) {
        throw new Error(error?.response?.data || 'Set project : Unknown error');
    }
}

export const getProjectStatuses = async () => {
    try {
        const result = await axios.get(constants.getProjectStatuses);
        return result.data;
    } catch (error) {
        throw new Error(error?.response?.data || 'Get project statuses : Unknown error');
    }
}

export const getProjectCreationRequests = async () => {
    try {
        const result = await axios.get(constants.getProjectCreationRequests);
        return result.data;
    } catch (error) {
        throw new Error(error?.response?.data || 'Get project creation requests : Unknown error');
    }
}

export const setProjectCreationRequest = async (projectCreationRequest) => {
    try {
        const result = await axios.post(constants.setProjectCreationRequest, projectCreationRequest);
        return result.data;
    } catch (error) {
        throw new Error(error?.response?.data || 'Set project creation request : Unknown error');
    }
}
