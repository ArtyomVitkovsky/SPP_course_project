function Tooltip({text}) {
    return (
        <div role="tooltip" className="z-[9999] mt-1 hidden group-hover:inline-block absolute bg-zinc-800/75 text-zinc-50 text-sm p-1 rounded-lg">
            {text}
            <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
    )
}

export default Tooltip;