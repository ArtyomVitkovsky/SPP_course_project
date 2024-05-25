import { useState, useEffect } from "react";
import { getDocuments, setDocument, deleteDocument, getUserDocumentStatuses, setUserDocumentStatus } from "../services/DocumentsService";
import toast from "react-hot-toast";

const useDocuments = (url) => {
    const [documents, setDocuments] = useState([]);
    const [userDocumentStatuses, setUserDocumentStatuses] = useState([]);
    const [isLoading, setIsLoading] = useState([]);

    const [documentData, setDocumentData] = useState({});
    const [selectedDocumentStatuses, setSelectedDocumentStatuses] = useState([]);

    const handleDocumentDataChange = (event, field) => {
        const value = event.target.value;
        setDocumentData(data => ({ ...data, [field]: value }))
    }

    const handleDocumentSelect = (document) => {
        setDocumentData(document)

        const statuses = [];
        userDocumentStatuses.forEach((status) => {
            if (status.document.id == document.id) statuses.push(status);
        });

        setSelectedDocumentStatuses(statuses);
    }

    const handleDocumentDataSave = async (document) => {
        try {
            await setDocument(document);

            getData();
        } catch (error) {
            toast.error(error?.message || 'Unknown error');
        }
    }

    const handleDocumentDelete = async (document) => {
        try {
            await deleteDocument(document);
            getData();
        }
        catch (error) {
            toast.error(error?.message || 'Unknown error');
        }
    }

    const handleDocumentSign = async (userDocumentData) => {
        try {
            console.log("handleDocumentSign : ", userDocumentData);
            await setUserDocumentStatus(userDocumentData);
            getData();
        }
        catch (error) {
            toast.error(error?.message || 'Unknown error');
        }
    }

    const getAllDocuments = async () => {
        const result = await getDocuments();
        setDocuments(result);
    }

    const getAllUserDocumentStatuses = async () => {
        const result = await getUserDocumentStatuses();
        setUserDocumentStatuses(result);
    }

    const getData = async () => {
        setIsLoading(true);
        try {
            await getAllDocuments();
            await getAllUserDocumentStatuses();

        } catch (error) {
            toast.error(error?.message || 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return {
        isLoading,
        documents,
        documentData,
        userDocumentStatuses,
        selectedDocumentStatuses,
        handleDocumentDataChange,
        handleDocumentSelect,
        handleDocumentDataSave,
        handleDocumentDelete,
        handleDocumentSign
    };
};

export default useDocuments;