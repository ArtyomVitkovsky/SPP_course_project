import { useEffect, useState } from "react";
import useDocuments from "../hooks/useDocuments"
import Button from "../components/Button";
import Table from "../components/Table";
import DocumentDetailsModal from '../components/Documents/DocumentDetailsModal'
import DocumentViewModal from '../components/Documents/DocumentViewModal'
import Avatar from "../components/Avatar"

function DocumentsPage({ user, isSendedDocuments }) {
    const {
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
    } = useDocuments();

    const [isShowEditModal, setIsShowEditModal] = useState(false);
    const [isShowViewModal, setIsShowViewModal] = useState(false);
    const [isDocumentCreation, setIsDocumentCreation] = useState(false);

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
        await handleDocumentDataSave(documentData);
        onCloseEditModalClick();
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

    const onSignClick = (userDocumentStatus) => {
        handleDocumentSign(userDocumentStatus);
    }

    const columns = [
        "id", "content", "creationDate", "name"
    ]

    const extraColumns = ["participants", "status"];

    const columnsToExclude = [
        "id", "content", "participants", "status"
    ]

    const actionColumns = [
        { type: 'outline', title: 'Edit', iconName: 'Cog6ToothIcon', action: (document) => onEditClick(document) },
        { type: 'outline', title: 'Delete', iconName: 'TrashIcon', action: (document) => onDeleteClick(document) },
        { type: 'outline', title: 'Sign', iconName: 'PencilSquareIcon', action: (document) => onViewClick(document) }
    ]

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
                const participants = [document.firstParticipant, document.secondParticipant];

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
        setIsDocumentCreation(true);
        documentData.sender = user;
    }

    return (
        <div className="w-full h-full">

            {
                isSendedDocuments
                    ?
                    <div className="w-full bg-blue-400 p-2 border-t-slate-50 border-solid border-t rounded-lg">
                        <div className="w-[150px] h-full">
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
            <Table data={documents.find((document) => isSendedDocuments ? document.sender.id == user.id : document.receiver.id == user.id)}
                columns={columns}
                extraColumns={extraColumns}
                extraColumnsData={getExtraColumns()}
                actionsColumns={actionColumns}
                columnsToExclude={columnsToExclude}>
            </Table>

            {
                isShowEditModal &&
                <DocumentDetailsModal
                    documentData={documentData}
                    onDataChange={handleDocumentDataChange}
                    onSaveClick={onSaveButtonClick}
                    onCloseClick={onCloseEditModalClick}>
                </DocumentDetailsModal>
            }

            {
                isShowViewModal &&
                <DocumentViewModal
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