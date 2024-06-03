import { useState, useEffect } from "react";
import * as DocumentsService from "../services/DocumentsService";
import toast from "react-hot-toast";

const useDocuments = (url) => {
    const [documents, setDocuments] = useState([]);
    const [userDocumentStatuses, setUserDocumentStatuses] = useState([]);
    const [documentNotifications, setDocumentNotifications] = useState([]);
    const [isDocumentsLoading, setIsDocumentsLoading] = useState([]);

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
            const result = await DocumentsService.setDocument(document);
            getData();

            return result;
        } catch (error) {
            toast.error(error?.message || 'Unknown error');
        }
    }

    const handleDocumentDelete = async (document) => {
        try {
            await DocumentsService.deleteDocument(document);
            getData();
        }
        catch (error) {
            toast.error(error?.message || 'Unknown error');
        }
    }

    const handleDocumentSign = async (userDocumentData) => {
        try {
            console.log("handleDocumentSign : ", userDocumentData);
            await DocumentsService.setUserDocumentStatus(userDocumentData);
            getData();
        }
        catch (error) {
            toast.error(error?.message || 'Unknown error');
        }
    }

    const getAllDocuments = async () => {
        const result = await DocumentsService.getDocuments();
        setDocuments(result);
    }

    const getAllUserDocumentStatuses = async () => {
        const result = await DocumentsService.getUserDocumentStatuses();
        setUserDocumentStatuses(result);
    }

    const getAllDocumentNotifications = async () => {
        try {
            const result = await DocumentsService.getDocumentNotifications();
            setDocumentNotifications(result);
        } catch (error) {
            toast.error(error?.message || 'Unknown error');
        }
    }

    const getData = async () => {
        setIsDocumentsLoading(true);
        try {
            await getAllDocuments();
            await getAllUserDocumentStatuses();
            await getAllDocumentNotifications();

        } catch (error) {
            toast.error(error?.message || 'Unknown error');
        } finally {
            setIsDocumentsLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return {
        isDocumentsLoading,
        documents,
        documentData,
        userDocumentStatuses,
        selectedDocumentStatuses,
        documentNotifications,
        getData,
        handleDocumentDataChange,
        handleDocumentSelect,
        handleDocumentDataSave,
        handleDocumentDelete,
        handleDocumentSign
    };
};

export default useDocuments;