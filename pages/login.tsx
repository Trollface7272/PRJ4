import { MouseEvent, useState } from "react"
import InputTextBox from "../components/InputTextBox"
import { NextPageContext } from "next"
import { Cookie } from "../utils/cookies"
import { ENDPOINTS } from "../utils/requests"
import styles from '../styles/Login.module.css'
import { Users } from "@database/index"
import axios from "axios"
import { useRouter } from "next/router"

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
    const router = useRouter()

    const onClick = async (e: MouseEvent) => {
        e.preventDefault()
        const username = (document.getElementById("usernameInput") as HTMLInputElement).value
        const password = (document.getElementById("passwordInput") as HTMLInputElement).value

        const req = axios.post("/api/users/login", { username, password })
        console.log(req);
        const raw = await req
        console.log(raw);
        
        const status = raw.status
        if (status !== 200) {
            switch (status) {
                case 403:
                    return setError(Errors.UserNotFound)
                case 400:
                default:
                    return setError(Errors.InternalServerError)
            }
        }
        if (raw.data.success) router.push("/dashboard")
    }

    return (
        <div className={styles.main + " gradient"}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="card bg-dark text-white" style={{ borderRadius: "1rem" }}>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps({ req, res }: NextPageContext) {
    if (!req || !res) { console.log("weird stuff in login, getServerSideProps"); return { props: {} } }
    const cookies = Cookie.parse(req)
    if (!cookies.session) return { props: {} }
    if (await Users.isSessionValid(cookies.session)) {
        res.setHeader("location", "/dashboard");
        res.statusCode = 302;
        res.end();
    }
    return { props: {} }
}

export default LoginForm

/*
⠀⠀⠀⠀⠀  ⠀⠀⠀⠀⠀⠀⣠⣤⣤⣤⣤⣤⣶⣦⣤⣄⡀
⠀⠀⠀  ⠀⠀⠀⠀⠀⢀⣴⣿⡿⠛⠉⠙⠛⠛⠛⠛⠻⢿⣿⣷⣤⡀
 ⠀⠀ ⠀⠀⠀⠀⠀⠀⣼⣿⠋⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⠈⢻⣿⣿⡄
 ⠀ ⠀⠀⠀⠀⠀⠀⣸⣿⡏⠀⠀ ⠀⣠⣶⣾⣿⣿⣿⠿⠿⠿⢿⣿⣿⣿⣄
 ⠀ ⠀⠀⠀⠀⠀⠀⣿⣿⠁⠀ ⠀⢰⣿⣿⣯⠁⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣷⡄
  ⠀⠀⣀⣤⣴⣶⣶⣿⡟⠀⠀ ⠀⢸⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣷
  ⠀⢰⣿⡟⠋⠉⣹⣿⡇⠀⠀ ⠀⠘⣿⣿⣿⣿⣷⣦⣤⣤⣤⣶⣶⣶⣶⣿⣿⣿
  ⠀⢸⣿⡇⠀⠀⣿⣿⡇⠀⠀ ⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃
  ⠀⣸⣿⡇⠀⠀⣿⣿⡇⠀⠀ ⠀⠀⠀⠉⠻⠿⣿⣿⣿⣿⡿⠿⠿⠛⢻⣿⡇
  ⠀⣿⣿⠁⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀   ⠀⠀⢸⣿⣧
  ⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀  ⠀⢸⣿⣿
  ⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀  ⠀⠀ ⢸⣿⣿
  ⠀⢿⣿⡆⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀ ⠀ ⢸⣿⡇
  ⠀⠸⣿⣧⡀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀ ⠀ ⢸⣿⡇
 ⠀  ⠀⠛⢿⣿⣿⣿⣿  ⠀⠀⠀ ⣰⣿⣿⣷⣶⣶⡆      ⢸⣿⣿
  ⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀ ⠀⠀ ⣿⣿⡇ ⠀⣽⣿  ⠀⠀   ⣿⣿⡇
  ⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀ ⣿⣿⡇ ⠀⢹⣿⡆⠀⠀   ⣸⣿⠇
  ⠀⠀⠀⠀⠀⠀⠀⢿⣿⣦⣄⣀⣠⣴⣿⣿⠁⠀  ⠈⠻⣿⣿⣿⣿⡿⠏
  ⠀⠀⠀⠀⠀⠀⠀⠈⠛⠻⠿⠿⠿⠿⠋⠁
*/