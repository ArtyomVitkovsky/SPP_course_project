import Modal from "../Modal"
// import FileViewer from 'react-file-viewer';
import { getDocument } from "../../utilities/getDocumentFromBase64"
import ButtonIcon from "../ButtonIcon";
import Icon from "../Icon";
import { useEffect } from "react";

function DocumentViewModal({ documentData = {}, selectedDocumentUserStatuses = [], onSignClick = () => { }, onDoneClick = () => { }, onCloseClick = () => { } }) {

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

    const getParticipants = () => {
        return [documentData.firstParticipant, documentData.secondParticipant];
    }

    return (
        <Modal className="overflow-auto" width="auto" title="Document view" onCloseClick={onCloseClick} buttons={buttons}>
            <div className="flex flex-col gap-4 w-full border-b-2 pb-3 my-3">
                <span>{documentData.name}</span>
            </div>
            <div className="overflow-auto h-[450px]">
                {/* <FileViewer fileType="docx" filePath={getDocument(documentData.content)} /> */}
            </div>
            <div className="overflow-auto flex flex-col gap-4 h-[150px] p-4">
                {
                    getParticipants().map((participant, i) => {
                        return <div key={i} className="flex justify-between w-[400px] py-2">
                            <span className="align-middle center">{participant.firstName + " " + participant.lastName}</span>
                            {getStatusElement(participant)}
                        </div>
                    })
                }
            </div>
        </Modal>
    )
}

export default DocumentViewModal