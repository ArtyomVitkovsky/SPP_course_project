import { useEffect, useState } from "react";
import useDocuments from "../hooks/useDocuments"
import Button from "../components/Button";
import Table from "../components/Table";
import DocumentDetailsModal from '../components/Documents/DocumentDetailsModal'
import DocumentViewModal from '../components/Documents/DocumentViewModal'
import Avatar from "../components/Avatar"
import * as constants from "../utilities/constants"

import { useSubscription } from 'react-stomp-hooks';
import toast from "react-hot-toast";
import useProjects from "../hooks/useProjects";

function DocumentsPage({ user, isSendedDocuments }) {

    useSubscription(`/topic/notif/${user?.id}`, async => {
        getNotifications();
    });

    const {
        isDocumentsLoading, documents, documentData, userDocumentStatuses, selectedDocumentStatuses, documentNotifications,
        getData, handleDocumentDataChange, handleDocumentSelect, handleDocumentDataSave, handleDocumentDelete, handleDocumentSign
    } = useDocuments();

    const {
        isProjectsLoading, projects, projectStatuses, projectCreationRequests, projectData,
        handleProjectDataChange, handleProjectSelect, handleProjectDataSave, handleProjectCreationRequestSave
    } = useProjects();

    const [isLoading, setIsLoading] = useState(true);
    const [isShowEditModal, setIsShowEditModal] = useState(false);
    const [isShowViewModal, setIsShowViewModal] = useState(false);

    useEffect(() => {
        setIsLoading(isDocumentsLoading || isProjectsLoading);
    }, [isDocumentsLoading, isProjectsLoading])

    const getNotifications = async () => {
        await getData();
        setIsDocumentNotificationReceived(false);
    }

    const onCloseEditModalClick = () => {
        setIsShowEditModal(false);
        handleDocumentSelect({});
    }

    const onCloseViewModalClick = () => {
        setIsShowViewModal(false);
        handleDocumentSelect({});
    }

    const onViewModalDoneClick = async (documentData) => {
        await handleDocumentDataSave(documentData);

        setIsShowViewModal(false);
        handleDocumentSelect({});
    }

    const onSaveButtonClick = async (documentData) => {
        const document = await handleDocumentDataSave(documentData);
        onCloseEditModalClick();

        return document;
    }

    const onDeleteClick = async (document) => {
        await handleDocumentDelete(document)
    }

    const onEditClick = (document) => {
        handleDocumentSelect(document);
        setIsShowEditModal(true);
    }

    const onViewClick = (document) => {
        handleDocumentSelect(document);
        setIsShowViewModal(true);
    }

    const onSignClick = async (userDocumentStatus) => {
        await handleDocumentSign(userDocumentStatus);

        const projectCreationRequest = projectCreationRequests.find(
            request => request.document.id == userDocumentStatus.document.id
                && request.manager.employeeUser.id == userDocumentStatus.user.id
        );

        const projectStatus = projectStatuses.find(status => status.status == 'Active');

        const project = {
            client: projectCreationRequest.client,
            manager: projectCreationRequest.manager,
            employees: projectCreationRequest.employees,
            name: projectCreationRequest.name,
            status: projectStatus
        };

        handleProjectDataSave(project);
    }

    const columns = [
        "id", "content", "creationDate", "name"
    ]

    const extraColumns = ["participants", "status"];

    const columnsToExclude = [
        "id", "content", "participants", "status"
    ]

    const getActionColumns = () => {
        return user.role.role == 'Client'
            ? [
                { type: 'outline', title: 'Edit', iconName: 'Cog6ToothIcon', action: (document) => onEditClick(document) },
                { type: 'outline', title: 'Delete', iconName: 'TrashIcon', action: (document) => onDeleteClick(document) },
            ]
            : [
                { type: 'outline', title: 'Sign', iconName: 'PencilSquareIcon', action: (document) => onViewClick(document) }
            ]
    }

    const getExtraColumns = () => {
        const extraColumnsData = {};

        extraColumnsData["participants"] = participantsColumns();
        extraColumnsData["status"] = statusColumns();

        return extraColumnsData;
    }

    const statusColumns = () => {
        const statuses = {};

        documents.forEach((document) => {
            if (isSendedDocuments ? document.sender.id == user.id : document.receiver.id == user.id)
                statuses[document.id] =
                    <span key={document.id}>
                        {document.status.status}
                    </span>
        })

        return statuses;
    }

    const participantsColumns = () => {
        const participantAvatars = {};

        documents.forEach((document) => {
            if (isSendedDocuments ? document.sender.id == user.id : document.receiver.id == user.id) {
                const participants = [document.sender, document.receiver];

                let otherUsersCount = 0;
                participantAvatars[document.id] =
                    <div key={document.id} className="flex flex-row gap-1">
                        {
                            participants.map((participant, i) => {
                                if (participant) {
                                    if (i < 2) return <Avatar key={i} firstName={participant.firstName} lastName={participant.lastName}></Avatar>
                                    else otherUsersCount++
                                }
                            })

                        }
                        {
                            otherUsersCount > 1
                                ? <Avatar key={document.id} firstName="+" lastName={`${otherUsersCount}`}></Avatar>
                                : otherUsersCount == 1
                                    ? <Avatar key={document.id}
                                        firstName={participants[participants.length - 1]?.firstName}
                                        lastName={participants[participants.length - 1]?.lastName}>
                                    </Avatar>
                                    : null
                        }
                    </div>
            }
        })

        return participantAvatars;
    }

    const onAddDocumentClick = () => {
        setIsShowEditModal(true);
        documentData.sender = user;
    }

    const getDocuments = () => {
        return documents.filter((document) => isSendedDocuments
            ? document.sender.id == user.id
            : document.receiver.id == user.id)
    }

    return (
        isLoading
            ? <div className='flex w-full h-full items-center justify-center'>
                <span>Loading...</span>
            </div>
            : <div className="w-full h-full">
                {
                    isSendedDocuments
                        ?
                        <div className="w-full bg-sky-900 p-4 rounded-b-3xl">
                            <div className="flex justify-end">
                                <Button
                                    name="Add Document"
                                    isLight={true}
                                    width_rem={10} height_rem={2}
                                    onClickAction={onAddDocumentClick}>
                                </Button>
                            </div>
                        </div>
                        : null
                }
                <div className="px-2 mt-3">
                    <Table data={getDocuments()}
                        columns={columns}
                        extraColumns={extraColumns}
                        extraColumnsData={getExtraColumns()}
                        actionsColumns={getActionColumns()}
                        columnsToExclude={columnsToExclude}>
                    </Table>
                </div>

                {
                    isShowEditModal &&
                    <DocumentDetailsModal
                        user={user}
                        documentData={documentData}
                        selectedDocumentUserStatuses={selectedDocumentStatuses}
                        onDataChange={handleDocumentDataChange}
                        onSaveClick={onSaveButtonClick}
                        onCloseClick={onCloseEditModalClick}>
                    </DocumentDetailsModal>
                }

                {
                    isShowViewModal &&
                    <DocumentViewModal
                        user={user}
                        documentData={documentData}
                        selectedDocumentUserStatuses={selectedDocumentStatuses}
                        onSignClick={onSignClick}
                        onDoneClick={onViewModalDoneClick}
                        onCloseClick={onCloseViewModalClick}>
                    </DocumentViewModal>
                }
            </div >
    )
}

export default DocumentsPage