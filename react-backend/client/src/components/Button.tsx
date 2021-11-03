interface params {
    text?: String
    className?: String
}

const Button = ({text, className}: params) => {
    return (
        <>
            <button className={"btn btn-outline-light btn-lg px-5 " + className}>{text || ""}</button>
        </>
    )
}

export default Button
