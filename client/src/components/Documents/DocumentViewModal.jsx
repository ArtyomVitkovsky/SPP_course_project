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

    const OnSignClick = (participant) => {
        const participantStatus = selectedDocumentUserStatuses.find(status => status.user.id == participant.id);

        if (!participantStatus) return;

        participantStatus.status = true;
        onSignClick(participantStatus);
    }

    const getStatusElement = (participant) => {

        const participantStatus = selectedDocumentUserStatuses.find(status => status.user.id == participant.id);

        if (!participantStatus) return;

        return participantStatus.status
            ? <div className="flex flex-row gap-2 p-1 w-18 h-8 ">
                <div className={"flex justify-start items-center font-semibold text-base w-full h-full"}>
                    <span>Signed!</span>
                </div>
                <div className="flex w-auto h-full">
                    <Icon iconName="CheckCircleIcon" iconClassName='group-active:text-zinc-50 transition-all duration-300' textColor="text-green-500"></Icon>
                </div>

            </div>
            : <div className="flex flex-row gap-2">
                <ButtonIcon type="outline" iconName="CheckCircleIcon" textColor="text-green-500" onClick={() => OnSignClick(participant)}></ButtonIcon>
                <ButtonIcon type="outline" iconName="XCircleIcon" textColor="text-red-500" onClick={() => OnSignClick(participant)}></ButtonIcon>
            </div>
    }

    return (
        <Modal className="overflow-auto" width="auto" title="Document view" onCloseClick={onCloseClick} buttons={buttons}>
            <DocumentPreview user={user} base64Content={documentData.content}/>
        </Modal>
    )
}

export default DocumentViewModal