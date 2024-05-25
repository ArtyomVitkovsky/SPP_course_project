import { useState, useEffect } from "react";
import * as EmployeesService from "../services/EmployeesService";
import toast from "react-hot-toast";

const useEmployees = (url) => {
    const [employees, setEmployees] = useState([]);

    const [isEmployeesLoading, setIsLoading] = useState(true);
    const [employeeData, setEmployeeData] = useState({});
    const [employeeStatuses, setEmployeeStatuses] = useState([]);

    const handleEmployeeDataChange = (event, field) => {
        const value = event.target.value;
        setEmployeeData(data => ({ ...data, [field]: value }))
    }

    const handleEmployeeSelect = (employee) => {
        setEmployeeData(employee)
    }

    const handleEmployeeDataSave = async (employee) => {
        try {
            console.log("handleEmployeeDataSave employee : ", employeeData);
            await EmployeesService.setEmployee(employee);
            getAllEmployees();

        } catch (error) {
            toast.error(error?.message || 'Unknown error');
        }
    }

    const getAllEmployees = async () => {
        const result = await EmployeesService.getEmployees();
        setEmployees(result);
    }

    const getEmployeeStatuses = async () => {
        const result = await EmployeesService.getEmployeeStatuses();
        setEmployeeStatuses(result);
    }

    const getData = async () => {
        setIsLoading(true);
        try {
            await getAllEmployees();
            await getEmployeeStatuses();
        } catch (error) {
            toast.error(error?.message || 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return { isEmployeesLoading, employees, employeeData, employeeStatuses, handleEmployeeDataChange, handleEmployeeSelect, handleEmployeeDataSave };
};

export default useEmployees;