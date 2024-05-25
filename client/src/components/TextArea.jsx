function TextArea({ label, placeHolder, value = '', onValueChange, customClassName, maxHeight, minHeight }) {
    const style = { minHeight: `${minHeight}px`, maxHeight: `${maxHeight}px` };

    return (
        <div className={"py-2" + { customClassName }} >
            <label className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
            <textarea id="message" rows="4"
                className={"block p-2.5 w-full text-sm " +
                    "text-gray-900 bg-gray-50 rounded-lg border border-gray-300" +
                    "focus:ring-blue-500 focus:border-blue-500"}
                style={style}
                placeholder={placeHolder} value={value} onChange={onValueChange}>
            </textarea>
        </div>
    )
}

export default TextArea