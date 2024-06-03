import { useEffect, useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UsersPage from './pages/UsersPage'
import DocumentsPage from './pages/DocumentsPage'
import RegistrationPage from './pages/Authorization/RegistrationPage'
import AuthorizationPage from './pages/Authorization/AuthorizationPage'
import ClientPage from './pages/ClientPage'
import EmployeePage from './pages/EmployeePage'
import * as constants from './utilities/constants'
import { StompSessionProvider } from "react-stomp-hooks";

function App() {

    const [user, setUser] = useState({});

    useEffect(() => {
        setUser(JSON.parse(sessionStorage.getItem(constants.authorizedUser)));
    }, [])

    const onUserSelect = (user) => {
        setUser(user);
    }

    return (
        <StompSessionProvider url={'http://localhost:8080/ws'}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<RegistrationPage />}></Route>
                    <Route path='/registration' element={<RegistrationPage onUserChanged={onUserSelect}/>}></Route>
                    <Route path='/authorization' element={<AuthorizationPage onUserChanged={onUserSelect}/>}></Route>
                    <Route path='/clientPage' element={<ClientPage user={user}></ClientPage>}>
                        <Route path='/clientPage/sended' element={
                            <DocumentsPage user={user} isSendedDocuments={true} />
                        }></Route>
                        <Route path='/clientPage/inbox' element={
                            <DocumentsPage user={user} isSendedDocuments={false} />
                        }></Route>
                        <Route path='/clientPage/projects' element={<DocumentsPage />}></Route>
                    </Route>
                    <Route path='/employeePage' element={<EmployeePage user={user} />}>
                        <Route path='/employeePage/inbox' element={
                            <DocumentsPage user={user} isSendedDocuments={false}
                            />
                        }></Route>
                        <Route path='/employeePage/projects' element={<DocumentsPage />}></Route>
                    </Route>
                    <Route path='/home' element={<HomePage />}>
                        <Route path='/home/users' element={<UsersPage />}></Route>
                        <Route path='/home/documents' element={<DocumentsPage />}></Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </StompSessionProvider>
    )
}

export default App
