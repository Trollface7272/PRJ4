import { MouseEventHandler } from "react"

interface params {
    text?: String
    className?: String
    onClick?: MouseEventHandler,
    id?: string
}

const Button = ({text, className, onClick, id}: params) => {
    return (
        <>
            <button id={id} className={"btn btn-outline-light btn-lg px-5 " + className} onClick={onClick}>{text || ""}</button>
        </>
    )
}

export default Button
