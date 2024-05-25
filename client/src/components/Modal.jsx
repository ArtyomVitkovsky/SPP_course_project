import ButtonIcon from "./ButtonIcon";
import Button from "./Button";

function Modal({ width = "30rem", title, children, onCloseClick, buttons = [] }) {
    return (
        <div>
            <div className="flex items-center justify-center absolute inset-0">
                <div className="min-w-[600px] bg-zinc-100 rounded-lg flex flex-col z-50" style={{ width: `${width}` }}>
                    <div className="flex justify-between px-6 py-6 border-b-[1px] bg-blue-400 rounded-t-lg">
                        <h3 className="uppercase text-slate-50 text-lg font-semibold">{title}</h3>
                        <ButtonIcon iconName="XMarkIcon" type="bare" color="text-slate-50" onClick={(e) => onCloseClick(e)} />
                    </div>

                    <div className="flex-1 px-6 py-6">
                        {children}
                    </div>

                    <div className="flex justify-end px-6 py-6 border-t-[1px] gap-3">
                        {
                            buttons.map((button, i) => <Button
                                key={i}
                                name={button.name}
                                isLight={button.isLight}
                                width_rem={button.width_rem}
                                height_rem={button.height_rem}
                                onClickAction={() => button.onClickAction()}
                            />)
                        }
                    </div>
                </div>
            </div>
            <div className="backdrop-saturate-50 bg-zinc-900/30 h-full w-full absolute inset-0"></div>
        </div>
    );
}

export default Modal;