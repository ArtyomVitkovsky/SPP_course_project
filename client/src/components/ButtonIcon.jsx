import Icon from "./Icon"

const typePerClass = {
  bare: 'hover:bg-zinc-200',
  outline: 'border border-zinc-200 hover:bg-zinc-300 active:bg-zinc-900 active:text-zinc-50'
};

const typePerClassIcon = {
  bare: 'text-white group-hover:text-zinc-800 transition-all duration-300',
  outline: 'group-active:text-zinc-50 transition-all duration-300'
};


const ButtonIcon = ({ type = 'bare', widthRem = 2, heightRem = 2, iconName = '', text = '', title = '', textColor = '', onClick }) => {
  const style = { width: `${widthRem}em`, height: `${heightRem}em` };
  
  return (
    <button className={"flex p-1 duration-300 rounded-lg group gap-2 items-center transition-all ease-in-out" + typePerClass[type]}
      style={style} title={title} onClick={(e) => onClick(e)}>
      <div className="flex w-auto h-full">
        <Icon iconName={iconName} iconClassName={typePerClassIcon[type]} textColor={textColor} />
      </div>
      <div className={"flex justify-start items-center font-semibold text-base w-full h-full"}>
        <span className="align-middle">{text}</span>
      </div>
    </button>
  );

}

export default ButtonIcon;