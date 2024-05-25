import Draggable from 'react-draggable';
import ButtonIcon from '../../../components/ButtonIcon/ButtonIcon';

const Sign = ({sign, onCancel = () => {}, onSave = () => {}, onStop = () => {} }) => {
  return <Draggable onStop={onStop}>
    <div className="absolute z-30">
      <div className="flex gap-1 justify-end bg-zinc-800 rounded-lg shadow-lg p-1 mb-1">
        <ButtonIcon title="Save" iconName="CheckIcon" type="bare" onClick={onSave}/>
        <ButtonIcon title="Cancel" iconName="XMarkIcon" type="bare" onClick={onCancel}/>
      </div>
      <div className="bg-zinc-800/10 rounded-lg flex items-center justify-center p-1">
        <img src={sign} className="w-[10rem]" draggable={false}/>
      </div>
    </div>
  </Draggable>
};

export default Sign;