import { useRef, useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf';

import ButtonIcon from '../ButtonIcon'

import Pagination from '../Pagination';

import * as pdfDocumentService from '../../services/pdfDocumentService';
import Button from '../Button'
import SignatureModal from '../DocumentsConstructor/SuppliesPage/components/SignatureModal'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
function DocumentPreview({ user, base64Content, projectCreationRequestData = {}, isRegeneratable = true, onGenerateClick = () => { }, onSign = () => { } }) {

    const [currentFile, setCurrentFile] = useState(null);
    const [pages, setPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

    const documentRef = useRef(null);

    useEffect(() => {
        if (base64Content) {
            pregenerateDocument();
        }
    }, [])

    const pregenerateDocument = async () => {
        const existedFile = await pdfDocumentService.getFileFromString(base64Content);
        setCurrentFile(existedFile);
    }

    const handleLoadSuccess = (e) => {
        setPages(e.numPages);
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleAddSignature = (state) => {
        setIsSignatureModalOpen(state);
    };

    const handleSaveSign = async (signature) => {

        const file = user.role.role == 'Client'
            ? await pdfDocumentService.generateProjectContractDocument(signature, projectCreationRequestData)
            : await pdfDocumentService.signDocumentByReceiver(currentFile, signature);

        const data = await pdfDocumentService.getStringFromFile(file);

        setCurrentFile(file);

        onGenerateClick(data);

        onSign(data);

        setIsSignatureModalOpen(false);
    };

    const handleDeleteDocument = () => {
        setCurrentFile(null);

        onGenerateClick(data);
    };

    const generateDocumentClick = async () => {
        console.log("projectCreationRequestData : ", projectCreationRequestData);
        const file = await pdfDocumentService.generateProjectContractDocument(null, projectCreationRequestData);
        setCurrentFile(file);

        const data = await pdfDocumentService.getStringFromFile(file);
        onGenerateClick(data);
    }

    const download = () => {
        const url = window.URL.createObjectURL(currentFile);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file.pdf');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    }

    return (
        <div>
            <div className='flex justify-end gap-1 mb-2'>
                {
                    isRegeneratable && <div className=''>
                        <Button name={'Generate Document'} isLight={true} isBordered={true} onClickAction={generateDocumentClick} />
                    </div>
                }
                <div className=''>
                    <Button name={'Download Document'} isLight={true} isBordered={true} onClickAction={download} />
                </div>
            </div>
            <div className='bg-white rounded-lg flex flex-col min-w-[30rem]'>
                <div className='flex justify-between p-3 border-b-[1px]'>
                    <h3 className='text-xl font-semibold'>Document preview</h3>
                    {
                        currentFile && <ButtonIcon iconName='XMarkIcon' type='outline' onClick={handleDeleteDocument} />
                    }
                </div>
                <div className='w-full h-12 p-3 mb-3 '>
                    {
                        currentFile && <div className='flex justify-end'>
                            <ButtonIcon widthRem={5} iconName='PencilSquareIcon' text='Sign' type='outline' title='Add signature' onClick={() => handleAddSignature(true)} />
                        </div>
                    }
                </div>
                <div className='p-3'>
                    <div className='max-h-[calc(100vh-30rem)] overflow-auto' ref={documentRef}>
                        {
                            currentFile && <Document file={currentFile} onLoadSuccess={handleLoadSuccess}>
                                <Page pageNumber={currentPage} />
                            </Document>
                        }
                    </div>
                    {
                        (currentFile && pages) && <div className='flex justify-center mt-5'>
                            <Pagination totalCount={pages} pageSize={1} onPageClick={(pageNumber) => handlePageClick(pageNumber)} />
                        </div>
                    }
                </div>
            </div>
            {
                isSignatureModalOpen && <SignatureModal onClose={() => handleAddSignature(false)} onSave={handleSaveSign} />
            }
        </div>
    )
}

export default DocumentPreview;