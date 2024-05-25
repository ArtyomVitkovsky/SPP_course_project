import { useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UsersPage from './pages/UsersPage'
import DocumentsPage from './pages/DocumentsPage'
import RegistrationPage from './pages/Authorization/RegistrationPage'
import AuthorizationPage from './pages/Authorization/AuthorizationPage'
import ClientPage from './pages/ClientPage'
import * as constants from './utilities/constants'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<RegistrationPage />}></Route>
        <Route path='/registration' element={<RegistrationPage />}></Route>
        <Route path='/authorization' element={<AuthorizationPage />}></Route>
        <Route path='/clientPage' element={<ClientPage></ClientPage>}>
          <Route path='/clientPage/sended' element={
            <DocumentsPage
              user={JSON.parse(sessionStorage.getItem(constants.authorizedUser))} isSendedDocuments={true}
            />
          }></Route>
          <Route path='/clientPage/inbox' element={
            <DocumentsPage
              user={JSON.parse(sessionStorage.getItem(constants.authorizedUser))} isSendedDocuments={false}
            />
          }></Route>
          <Route path='/clientPage/projects' element={<DocumentsPage />}></Route>
        </Route>
        <Route path='/home' element={<HomePage />}>
          <Route path='/home/users' element={<UsersPage />}></Route>
          <Route path='/home/documents' element={<DocumentsPage />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
