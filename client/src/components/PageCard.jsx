
function PageCard({ headerText, children }) {

    const getContent = () => {
        const elements = [];

        if (Array.isArray(children)) {
            children.forEach((child, i) => {
                if (children.indexOf(child) == 0) {
                    elements.push(
                        <div key={i} className='w-60 rounded-b-3xl overflow-hidden'>
                            {child}
                        </div>
                    )
                }
                else {
                    elements.push(
                        <div key={i} className='w-full rounded-b-3xl'>
                            {child}
                        </div>
                    )
                }
            });
        }
        else {
            elements.push(
                <div key={elements.length} className='w-60 rounded-b-3xl'>
                    {children}
                </div>
            )
        }

        return elements;
    }

    return (
        <div className='flex-1 flex-col justify-center bg-white rounded-3xl shadow-md mx-56'>
            <div className='flex justify-center w-full rounded-t-3xl py-3 bg-sky-900'>
                <div className='flex items-center font-semibold text-gray-100 text-3xl'>
                    <span className='align-middle'>{headerText}</span>
                </div>
            </div>

            <div className='flex flex-row w-full'>
                {getContent()}
            </div>
        </div>
    )
}

export default PageCard;