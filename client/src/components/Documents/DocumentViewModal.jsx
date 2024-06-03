import Modal from "../Modal"
// import FileViewer from 'react-file-viewer';
import { getDocument } from "../../utilities/getDocumentFromBase64"
import ButtonIcon from "../ButtonIcon";
import Icon from "../Icon";
import { useEffect } from "react";
import DocumentPreview from "./DocumentPreview";

function DocumentViewModal({ user, documentData = {}, selectedDocumentUserStatuses = [], onSignClick = () => { }, onDoneClick = () => { }, onCloseClick = () => { } }) {

    const buttons = [
        { name: "Done", isLight: false, width_rem: 6, height_rem: 2.5, onClickAction: () => onDoneClick(documentData) }
    ];

    const onDocumentSign = () => {
        const participantStatus = selectedDocumentUserStatuses.find(status => status.user.id == user.id);

        if (!participantStatus) {
            console.log("!participantStatus")
            return;
        }

        participantStatus.status = true;

        console.log("onSignClick")
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