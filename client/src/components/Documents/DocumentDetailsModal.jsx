import Modal from '../Modal'
import InputField from '../InputField'
import Dropdown from '../Dropdown'
import useUsers from '../../hooks/useUsers'
import ButtonIcon from '../ButtonIcon'

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

import { useEffect, useState } from 'react'

import toast, { Toaster } from 'react-hot-toast'

import useEmployees from '../../hooks/useEmployees'
import SelectableSearchBox from '../SelectableSearchBox'
import useClients from '../../hooks/useClients'
import useProjects from '../../hooks/useProjects'
import DocumentPreview from './DocumentPreview'

function DocumentDetailsModal({ user, documentData = {}, onDataChange = () => { }, onSaveClick = async () => { }, onCloseClick = () => { } }) {
    const {
        isUsersLoading, userRoles, users, userData,
        handleUserDataChange, handleUserSelect, handleUserDataSave, handleUserDelete
    } = useUsers();

    const {
        isClientsLoading, clients, clientData,
        handleClientDataChange, handleClientSelect, handleClientDataSave
    } = useClients();

    const {
        isEmployeesLoading, employees, employeeData, employeeStatuses,
        handleEmployeeDataChange, handleEmployeeSelect, handleEmployeeDataSave
    } = useEmployees();

    const {
        isProjectsLoading, projects, projectStatuses, projectCreationRequests, projectData,
        handleProjectDataChange, handleProjectSelect, handleProjectDataSave, handleProjectCreationRequestSave
    } = useProjects();

    const [projectManager, setProjectManager] = useState({});
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [valuesToExclude, setValuesToExclude] = useState([]);
    const [projectCreationRequestData, setProjectCreationRequestData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [isDocumentSigned, setIsDocumentSigned] = useState(false);
    const [isUserStorageReceived, setIsUserStorageReceived] = useState(false);

    const buttons = [
        { name: 'Save', isLight: false, width_rem: 6, height_rem: 2.5, onClickAction: () => handleSave() }
    ];

    useEffect(() => {
        setIsDataLoading(isUsersLoading || isEmployeesLoading || isProjectsLoading);
    }, [isUsersLoading, isEmployeesLoading, isProjectsLoading])

    useEffect(() => {
        setIsLoading(isDataLoading || !isUserStorageReceived);
    }, [isDataLoading, isUserStorageReceived])

    useEffect(() => {
        if (isDataLoading) return;

        const projectCreationRequest = projectCreationRequests.find(request => request.document.id == documentData.id);
        setProjectCreationRequestData(projectCreationRequest ? projectCreationRequest : projectCreationRequestData);

        if (user.role.role == 'Client') {
            const client = clients.find((client) => client.clientUser.id == user.id);
            handleClientSelect(client);
            if (!projectCreationRequestData?.client) projectCreationRequestData.client = client;
        }

        if (projectCreationRequestData?.employees) setSelectedEmployees(getEmployeeNames(projectCreationRequestData.employees));
        if (projectCreationRequestData?.manager) setProjectManager(getEmployeeName(projectCreationRequestData.manager))

        setIsUserStorageReceived(true);
    }, [isDataLoading])

    const handleSave = async () => {
        if (!projectCreationRequestData.name) {
            toast.error('Select document name!');
            return;
        }

        if (!projectCreationRequestData.manager) {
            toast.error('Select project manager!');
            return;
        }

        if (!projectCreationRequestData.employees || projectCreationRequestData.employees.length == 0) {
            toast.error('Select employees!');
            return;
        }

        if (!documentData.content) {
            toast.error('Generate file!');
            return;
        }

        if (!isDocumentSigned) {
            toast.error('Sign document!');
            return;
        }

        console.log("documentData : ", documentData);

        const document = await onSaveClick(documentData);

        console.log("document : ", document);

        projectCreationRequestData.document = document;

        handleProjectCreationRequestSave(projectCreationRequestData);
    };

    const getEmployeeNames = (employees) => {
        const employeeNames = [];

        employees.forEach((employee) => {
            employeeNames.push(getEmployeeName(employee))
        })

        return employeeNames;
    }

    const getEmployeeName = (employee) => {
        return {
            key: employee.id,
            value: employee.employeeUser.firstName + ' ' + employee.employeeUser.lastName
        }
    }

    const handleDeleteEmployee = (employeeToDelete) => {
        const currentSelectedEmployees = selectedEmployees.filter((employee) => employee.key != employeeToDelete.key);
        setSelectedEmployees(currentSelectedEmployees);

        const keys = currentSelectedEmployees.map(employe => employe.key);

        const employeesData = employees.filter((employee) => !keys.includes(employee.id));
        projectCreationRequestData.employees = employeesData;
        setProjectCreationRequestData(projectCreationRequestData);
    }

    const onSelectableSearchBoxValueChange = (selectedEmployee) => {
        const currentSelectedEmployees = [...selectedEmployees];
        currentSelectedEmployees.push(selectedEmployee);
        setSelectedEmployees(currentSelectedEmployees);

        const currentValuesToExclude = [...valuesToExclude];
        currentValuesToExclude.push(selectedEmployee);
        setValuesToExclude(currentValuesToExclude);

        const keys = currentSelectedEmployees.map(employe => employe.key);

        const employeesData = employees.filter((employee) => keys.includes(employee.id));
        projectCreationRequestData.employees = employeesData;
        setProjectCreationRequestData(projectCreationRequestData);
    }

    const onDropDownValueChange = (index, selectedEmployee) => {
        const currentSelectedEmployees = [...selectedEmployees];
        currentSelectedEmployees.push(selectedEmployee);

        setValuesToExclude(currentSelectedEmployees);
        setProjectManager(selectedEmployee);

        const employee = employees.find((employee) => employee.id == selectedEmployee.key);
        projectCreationRequestData.manager = employee;

        documentData.receiver = employee.employeeUser;

        setProjectCreationRequestData(projectCreationRequestData);
    }

    const onProjectNameChange = (event) => {
        setProjectCreationRequestData(data => ({ ...data, ['name']: event.target.value }))
    }

    const onGenerateDocumentClick = (content) => {
        documentData.content = content;
    }

    const onSign = (content) => {
        setIsDocumentSigned(true);
        documentData.content = content;
    }

    return (
        <Modal width='auto' title='Document details' onCloseClick={onCloseClick} buttons={buttons}>
            {
                isLoading
                    ? <div className='flex w-full h-full items-center justify-center'>
                        <span>Loading...</span>
                    </div>
                    : <div className='flex flex-row gap-2'>
                        <div className='w-[300px]'>
                            <InputField
                                label='Project name'
                                placeHolder='Project name'
                                value={projectCreationRequestData?.name}
                                onValueChange={(e) => onProjectNameChange(e)}
                            />
                            <Dropdown
                                index={0}
                                label={'Select Project Manager'}
                                placeHolder={'Select Project Manager'}
                                value={projectManager}
                                values={getEmployeeNames(employees)}
                                valuesToExclude={Object.values(valuesToExclude)}
                                customClassName='w-full my-4'
                                onValueChange={onDropDownValueChange}
                            />
                            <div className={'flex flex-col gap-4 w-full pb-3 my-3 ' + (selectedEmployees.length > 0 ? 'border-b' : '')}>
                                <SelectableSearchBox
                                    values={getEmployeeNames(employees)}
                                    valuesToExclude={Object.values(valuesToExclude)}
                                    onItemSelect={onSelectableSearchBoxValueChange}
                                />
                            </div>
                            <div className='flex flex-col gap-2 w-full'>
                                {
                                    selectedEmployees.map((employee, i) => {
                                        return <div key={i} className='flex justify-between'>
                                            <span className='text-sm'>{employee.value}</span>
                                            <ButtonIcon iconName='XMarkIcon' type='outline' onClick={() => handleDeleteEmployee(employee)} />
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        <DocumentPreview
                            user={user}
                            base64Content={documentData?.content}
                            projectCreationRequestData={projectCreationRequestData}
                            onGenerateClick={onGenerateDocumentClick}
                            onSign={onSign}
                        />
                    </div>
            }
            <Toaster></Toaster>
        </Modal>
    )
}

export default DocumentDetailsModal