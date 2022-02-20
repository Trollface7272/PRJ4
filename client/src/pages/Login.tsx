import { MouseEvent, useState } from "react"
import { Card } from "react-bootstrap"
import { useCookies } from "react-cookie"
import { useHistory } from "react-router"
import InputTextBox from "../components/InputTextBox"
import "../css/LoginForm.css"
import { PostRequest } from "../shared/functions"

enum Errors {
    OK = 0,
    UserNotFound,
    InternalServerError
}
const ErrorTexts = [
    ,
    "Invalid username or password.",
    "Unknown error occured."
]

const LoginForm = () => {
    const [error, setError] = useState(0)
    const [cookies, setCookie, removeCookie] = useCookies(["session"])
    const history = useHistory()

    if (cookies.session) {
        PostRequest("/api/users/session", { session: cookies.session }).then(r => r.json()).then(res => {
            if (res.valid) return history.push("/dashboard")
            removeCookie("session")
        })
    }

    const onClick = async (e: MouseEvent) => {
        e.preventDefault()
        const name = (document.getElementById("usernameInput") as HTMLInputElement).value
        const password = (document.getElementById("passwordInput") as HTMLInputElement).value

        const raw = await PostRequest("/api/users/login", { name, password })
        if (!raw || !raw.json) return setError(Errors.InternalServerError)

        const data: { session: string, found: boolean } = await raw.json()
        if (!data.found) return setError(Errors.UserNotFound)

        setCookie("session", data.session, { path: "/" })
        history.push("/dashboard")
    }

    return (
        <div className="w-100">
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <Card className="bg-dark text-white" style={{ borderRadius: "1rem" }}>
                            <div className="text-center p-5 card-body">
                                <div className="mb-md-5 mt-md-4 pb-5">

                                    <h2 className="fw-bold mb-2 text-uppercase">{"Login".localize()}</h2>
                                    {error ? (<p className="mp-5">{ErrorTexts[error]}</p>) : <><p className="text-white-50 mp-5">{"Please enter your login and password!".localize()}</p>    </>}

                                    <form>
                                        <InputTextBox id="usernameInput" type="text" label={"Username".localize()} />
                                        <InputTextBox id="passwordInput" type="password" label={"Password".localize()} />

                                        <button id="submit-button" className="btn btn-outline-light btn-lg px-5" type="submit" onClick={onClick}>{"Login".localize()}</button>
                                    </form>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginForm