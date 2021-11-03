
interface type {
    id: string
    label?: string
    placeholder?: string
    type: string
    value?: string
    readonly?: boolean
}
const InputTextBox = ({id, label, placeholder, type, value, readonly}: type) => {
    return (<div className="form-outline mb-4 form-floating">
        <input type={type} id={id} className="form-control form-control-lg bg-dark text-white" placeholder={placeholder || " "} defaultValue={value} readOnly={readonly} />
        {label ? <label className="form-label text-white" htmlFor={id}>{label}</label> : ""}
    </div>)
}

export default InputTextBox