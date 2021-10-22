interface params {
    text?: String
}

const Button = ({text}: params) => {
    return (
        <>
            <button className="btn btn-outline-light btn-lg px-5">{text || ""}</button>
        </>
    )
}

export default Button
