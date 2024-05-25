import { useRef } from "react";
import SignatureCanvas from 'react-signature-canvas';
import ButtonIcon from "../../../ButtonIcon";

const SignatureModal = ({ onClose = () => { }, onSave = () => { } }) => {
  const signRef = useRef({});

  const handleClear = () => {
    signRef.current.clear();
  };

  const handleSave = () => {
    if (!signRef.current.isEmpty()) {
      const sign = signRef.current.toDataURL();
      onSave(sign);
    }
  };

  return <div className="absolute flex items-center justify-center w-full h-full inset-0 z-30">
    <div className="bg-white rounded-lg flex flex-col min-w-[20rem]">
      <div className="border-b-[1px] p-3 text-lg font-semibold text-zinc-500 flex justify-between">
        Add signature
        <div>
          <ButtonIcon iconName="XMarkIcon" type="bare" onClick={onClose} />
        </div>
      </div>
      <div className="p-4">
        <div className="flex gap-1 justify-end mb-5">
          <ButtonIcon title="Save" iconName="CheckIcon" type="outline" onClick={() => handleSave()}/>
          <ButtonIcon title="Clear" iconName="TrashIcon" type="outline" onClick={handleClear} />
        </div>
        <SignatureCanvas canvasProps={{ className: "w-full shadow-lg rounded-lg" }} ref={signRef} />
      </div>
    </div>
    <div className="backdrop-saturate-50 bg-zinc-900/30 h-full w-full absolute inset-0 -z-20"></div>
  </div>
};

export default SignatureModal;