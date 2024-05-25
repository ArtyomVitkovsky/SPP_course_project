import Modal from '../Modal'
import InputField from '../InputField'
import Dropdown from '../Dropdown'
import useUsers from '../../hooks/useUsers'
import ButtonIcon from '../ButtonIcon'
import Pagination from "../Pagination";

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { Document, Page, pdfjs } from 'react-pdf';

import { useRef, useEffect, useState } from 'react'
import FileInput from '../FileInput'

import { getDocument } from '../../utilities/getDocumentFromBase64'
import toast from 'react-hot-toast'

import { generateProjectContractDocument } from "../../services/pdfDocumentService";
import Button from '../Button'
import SignatureModal from '../DocumentsConstructor/SuppliesPage/components/SignatureModal'
import * as constants from '../../utilities/constants'
import useEmployees from '../../hooks/useEmployees'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
function DocumentDetailsModal({ documentData = {}, onDataChange = () => { }, onSaveClick = () => { }, onCloseClick = () => { } }) {
    const {
        isLoading,
        userRoles,
        users,
        userData,
        handleUserDataChange,
        handleUserSelect,
        handleUserDataSave,
        handleUserDelete
    } = useUsers();

    const {
        isEmployeesLoading,
        employees,
        employeeData,
        employeeStatuses,
        handleEmployeeDataChange,
        handleEmployeeSelect,
        handleEmployeeDataSave
    } = useEmployees();

    const [currentFile, setCurrentFile] = useState(null);
    const [pages, setPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [authorizedUser, setAuthorizedUser] = useState({});
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [employeeNames, setEmployeeNames] = useState([]);

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem(constants.authorizedUser));
        setAuthorizedUser(user);

        setEmployeeNames(getEmployeeNames());
    }, [])

    const documentRef = useRef(null);

    const handleLoadSuccess = (e) => {
        setPages(e.numPages);
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleAddSignature = (state) => {
        setIsSignatureModalOpen(state);
    };

    const handleSaveSign = async (sign) => {
        const file = await generateProjectContractDocument(sign);
        setCurrentFile(file);
        setIsSignatureModalOpen(false);
    };

    const handleDeleteDocument = () => {
        setCurrentFile(null);
    };

    const generateDocumentClick = async () => {
        const file = await generateProjectContractDocument();
        setCurrentFile(file);
    };

    const download = () => {
        const url = window.URL.createObjectURL(currentFile);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file.pdf');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    }

    const handleSave = () => {
        documentData.sender = users.find((user) => user.id == authorizedUser.id);

        if (!documentData.name) {
            toast.error('Select document name!');
            return;
        }

        if (!documentData.content) {
            toast.error('Select file!');
            return;
        }

        onSaveClick(documentData);
    };

    const buttons = [
        { name: 'Save', isLight: false, width_rem: 6, height_rem: 2.5, onClickAction: () => handleSave() }
    ];

    const getEmployeeNames = () => {
        const employeeNames = [];

        employees.forEach((employee) => {
            employeeNames.push(getEmployeeName(employee))
        })

        console.log(employeeNames)

        return employeeNames;
    }

    const getEmployeeName = (employee) => {
        return {
            key: employee.id,
            value: employee.employeeUser.firstName + ' ' + employee.employeeUser.lastName
        }
    }

    const handleDeleteEmployee = (employeeToDelete) => {
        const employees = selectedEmployees.filter((employee) => employee.key != employeeToDelete.key);

        setSelectedEmployees(employees);
    }

    const onDropDownValueChange = (index, employee) => {
        setSelectedEmployees(data => ({ ...data, [index]: employee }));
    }

    const onDocumentContentChange = (base64Content) => {
        documentData.content = base64Content;
        setContentFile(base64Content);
    }

    return (
        <Modal width='auto' title='Document details' onCloseClick={onCloseClick} buttons={buttons}>
            <div className='flex flex-row gap-2'>
                <div className='w-[300px]'>
                    <InputField
                        label='Document name'
                        placeHolder='Document name'
                        value={documentData?.name}
                        onValueChange={(e) => onDataChange(e, 'name')}
                    />
                    <div className='flex flex-col gap-4 w-full border-b-2 pb-3 my-3'>
                        <Dropdown
                            index={0}
                            label={'Employees'}
                            placeHolder={'Select Employee'}
                            value={null}
                            values={employeeNames}
                            valuesToExclude={Object.values(selectedEmployees)}
                            onValueChange={(index, value) => onDropDownValueChange(index, value)}
                            isChangeable={true} >
                        </Dropdown>
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                        {
                            selectedEmployees.map((employee, i) => {
                                return <div key={i} className='flex flex-row justify-between'>
                                    <span>{employee.value}</span>
                                    <ButtonIcon iconName="XMarkIcon" type="outline" onClick={() => handleDeleteEmployee(employee)} />
                                </div>
                            })
                        }
                    </div>
                </div>
                <div>
                    <div className='flex flex-row gap-2 mb-2'>
                        <div className='w-full h-8'><Button name={'Generate Document'} isLight={true} onClickAction={generateDocumentClick} /></div>
                        <div className='w-full h-8'><Button name={'Download Document'} isLight={true} onClickAction={download} /></div>
                    </div>
                    <div className="bg-white rounded-lg flex flex-col min-w-[30rem]">
                        <div className="flex justify-between p-3 border-b-[1px]">
                            <h3 className="text-xl font-semibold">Document preview</h3>
                            <ButtonIcon iconName="XMarkIcon" type="outline" onClick={handleDeleteDocument} />
                        </div>
                        <div className='w-full h-12 p-3 mb-3 '>
                            {
                                currentFile && <div className="flex justify-end">
                                    <ButtonIcon widthRem={5} iconName="PencilSquareIcon" text='Sign' type="outline" title="Add signature" onClick={() => handleAddSignature(true)} />
                                </div>
                            }
                        </div>
                        <div className="p-3">
                            <div className="max-h-[calc(100vh-30rem)] overflow-auto" ref={documentRef}>
                                {
                                    currentFile && <Document file={currentFile} onLoadSuccess={handleLoadSuccess}>
                                        <Page pageNumber={currentPage} />
                                    </Document>
                                }
                            </div>
                            {
                                (currentFile && pages) && <div className="flex justify-center mt-5">
                                    <Pagination totalCount={pages} pageSize={1} onPageClick={(pageNumber) => handlePageClick(pageNumber)} />
                                </div>
                            }
                        </div>
                    </div>
                    {
                        isSignatureModalOpen && <SignatureModal onClose={() => handleAddSignature(false)} onSave={handleSaveSign} />
                    }
                </div>
            </div>
        </Modal>
    )
}

export default DocumentDetailsModal