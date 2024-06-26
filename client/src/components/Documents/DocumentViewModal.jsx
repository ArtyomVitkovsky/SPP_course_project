import Modal from "../Modal"
import DocumentPreview from "./DocumentPreview";

function DocumentViewModal({ user, documentData = {}, selectedDocumentUserStatuses = [], onSignClick = () => { }, onDoneClick = () => { }, onCloseClick = () => { } }) {

    const buttons = [
        { name: "Done", isLight: false, width_rem: 6, height_rem: 2.5, onClickAction: () => onDoneClick(documentData) }
    ];

    const onDocumentSign = () => {
        const participantStatus = selectedDocumentUserStatuses.find(status => status.user.id == user.id);

        if (!participantStatus) return;

        participantStatus.status = true;

        onSignClick(participantStatus);
    }

    return (
        <Modal className="overflow-auto" width="auto" title="Document view" onCloseClick={onCloseClick} buttons={buttons}>
            <DocumentPreview user={user} base64Content={documentData.content} isRegeneratable={false}
                onSign={onDocumentSign} />
        </Modal>
    )
}

export default DocumentViewModal