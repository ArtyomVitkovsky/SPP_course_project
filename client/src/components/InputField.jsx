function InputField({ type, label, placeHolder, value = '', onValueChange, required, customClassName }) {
    return (
        <div className={customClassName}>
            <label className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
            <input type={type} className={
                ("bg-gray-50 border border-gray-300 " +
                    "text-gray-900 text-sm " +
                    "rounded-lg " +
                    "focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5")}
                placeholder={placeHolder} required={required} value={value} onChange={onValueChange} />
        </div>
    )
}

export default InputField