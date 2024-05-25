export const api = 'http://localhost:8080/';

export const userRoleToPage = {
    Client: '/clientPage',
    Employee: '/employeePage'
}

export const authorizedUser = 'localStorage/authorizedUser';

export const getDocuments = api + 'documents/getDocuments';
export const setDocument = api + 'documents/setDocument';
export const deleteDocument = api + 'documents/deleteDocument';
export const getUserDocumentStatuses = api + 'documents/getUserDocumentStatuses';
export const setUserDocumentStatus = api + 'documents/setUserDocumentStatus';

export const getUsers = api + 'users/getUsers';
export const setUser = api + 'users/setUser';
export const deleteUser = api + 'users/deleteUser';
export const authorizeUser = api + 'users/authorizeUser';
export const getUserRoles = api + 'users/getUserRoles';

export const setEmployee = api + 'employees/setEmployee';
export const getEmployees = api + 'employees/getEmployees';
export const getEmployeeStatuses = api + 'employees/getEmployeeStatuses';

export const setClient = api + 'clients/setClient';
export const getClients = api + 'clients/getClients';

