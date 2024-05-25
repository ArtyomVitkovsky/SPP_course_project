import { useRef, useState } from "react";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { Document, Page, pdfjs } from 'react-pdf';
import SignatureModal from "./SignatureModal";
import Pagination from "../../../Pagination";
import ButtonIcon from '../../../ButtonIcon'
import { generateDocument } from "../../../services/pdfDocumentService";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const SupplieModal = ({ state, onClose = () => { } }) => {
  const [currentFile, setCurrentFile] = useState(null);
  const [pages, setPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

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
    const file = await generateDocument(sign);
    setCurrentFile(file);
    setIsSignatureModalOpen(false);
  };

  const handleClose = () => {
    setCurrentFile(null);
    onClose();
  };

  const generateDocumentClick = async () => {
    const file = await generateDocument();
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

  return <>
    <div className={"absolute flex items-center justify-center w-full h-full inset-0 z-20 " + (state ? "" : "hidden")} >
      <button onClick={generateDocumentClick}>Click</button>
      <button onClick={download}>Download</button>

      <div className="bg-white rounded-lg flex flex-col min-w-[20rem]">
        <div className="flex justify-between p-3 border-b-[1px]">
          <h3 className="text-xl font-semibold">Supplie</h3>
          <ButtonIcon iconName="XMarkIcon" type="bare" onClick={handleClose} />
        </div>
        <div className="p-3 ">
          {
            currentFile && <div className="flex justify-end mb-3">
              <ButtonIcon iconName="PencilSquareIcon" type="outline" title="Add signature" onClick={() => handleAddSignature(true)} />
            </div>
          }
          <div className="max-h-[calc(100vh-20rem)] overflow-auto" ref={documentRef}>
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
      <div className="backdrop-saturate-50 bg-zinc-900/30 h-full w-full absolute inset-0 -z-10"></div>
    </div>
  </>
};

export default SupplieModal;