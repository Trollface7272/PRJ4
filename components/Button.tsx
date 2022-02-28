import { CSSProperties, MouseEventHandler } from "react"

interface params {
    text?: String
    className?: String
    onClick?: MouseEventHandler,
    id?: string,
    style?: CSSProperties
}

const Button = ({text, className, onClick, id, style}: params) => {
    return (
        <>
            <button style={style} id={id} className={"btn btn-outline-light btn-lg px-5 " + className} onClick={onClick}>{text || ""}</button>
        </>
    )
}

export default Button
