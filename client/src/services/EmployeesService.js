import axios from 'axios';
import * as constants from '../utilities/constants';

export const getEmployees = async () => {
    try {
        const result = await axios.get(constants.getEmployees);
        return result.data;
    } catch (error) {
        throw new Error(error?.response?.data || 'Get employees : Unknown error');
    }
}

export const setEmployee = async (employeeData) => {
    try {
        console.log("EmployeesService setEmployee : ", employeeData);
        const result = await axios.post(constants.setEmployee, employeeData)
        return result.data;
    } catch (error) {
        throw new Error(error?.response?.data || 'Set employee : Unknown error');
    }
}

export const getEmployeeStatuses = async () => {
    try {
        const result = await axios.get(constants.getEmployeeStatuses)
        return result.data;
    } catch (error) {
        throw new Error(error?.response?.data || 'Get employee statuses: Unknown error');
    }
}
