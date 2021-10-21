
interface type {
    id: string
    label?: string
    placeholder?: string
}
const InputTextBox = ({id, label, placeholder}: type) => {
    return (<div className="form-outline mb-4 form-floating">
        <input type="text" id={id} className="form-control form-control-lg bg-dark text-white" placeholder={placeholder} />
        {label ? <label className="form-label text-white" htmlFor={id}>{label}</label> : ""}
    </div>)
}

export default InputTextBox