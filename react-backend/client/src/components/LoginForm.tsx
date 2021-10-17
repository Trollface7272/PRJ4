import { useState } from "react"
import { Card } from "react-bootstrap"
import "../css/LoginForm.css"
import { getLocal, loadLocal } from "../shared/functions"

const LoginForm = () => {
    const [loaded, setLoaded] = useState(false)
    loadLocal().then(e => setLoaded(true))

    return loaded ? (
        <>
            <div>
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <Card className="bg-dark text-white" style={{borderRadius: "1rem"}}>
                                <div className="text-center p-5 card-body">
                                    <div className="mb-md-5 mt-md-4 pb-5">

                                        <h2 className="fw-bold mb-2 text-uppercase">{getLocal("login")}</h2>

                                        <p className="text-white-50 mp-5">{getLocal("login-please-enter-details")}</p>

                                        <div className="form-outline mb-4 form-floating">
                                            <input type="text" id="usernameInput" className="form-control form-control-lg bg-dark text-white" placeholder=" " />
                                            <label className="form-label" htmlFor="usernameInput">{getLocal("username")}</label>
                                        </div>

                                        <div className="form-outline mb-4 form-floating">
                                            <input type="password" id="passwordInput" className="form-control form-control-lg bg-dark text-white" placeholder=" " />
                                            <label className="form-label" htmlFor="passwordInput">{getLocal("password")}</label>
                                        </div>

                                        <button className="btn btn-outline-light btn-lg px-5" type="submit">{getLocal("login")}</button>

                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    ) : (
        <>
            <div className="vh-100 gradient"></div>
        </>
    )
}

export default LoginForm