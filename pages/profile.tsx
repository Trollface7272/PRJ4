import InputTextBox from "../components/InputTextBox"
import SideNav from "../components/SideNav"
import Button from "../components/Button"
import { useRouter } from "next/router"
import { ENDPOINTS } from "utils/requests"
import { useCookie } from "next-cookie"
import { NextPageContext } from "next"
import { Cookie } from "utils/cookies"
import { getUserData } from "utils/serverUtils"

interface params {
    user: any
    languages: any
}

const Profile = ({user, languages}: params) => {
    const router = useRouter()
    const cookies = useCookie("language")
    const changeUsername = async () => {
        const newUsername = (document.getElementById("new-username") as HTMLInputElement).value
        const password = (document.getElementById("current-password-username") as HTMLInputElement).value
        if (newUsername.length <= 4) return
        await fetch(ENDPOINTS.CHANGE_USERNAME, { method: "POST", body: JSON.stringify({newUsername: newUsername, password: password}) })
        ;(document.getElementById("current-username") as HTMLInputElement).value = newUsername
    }
    const changeName = async () => {
        const newName = (document.getElementById("new-name") as HTMLInputElement).value
        const password = (document.getElementById("current-password-name") as HTMLInputElement).value
        if (newName.length <= 4) return
        await fetch(ENDPOINTS.CHANGE_NAME, { body: JSON.stringify({newName: newName, password: password}), method: "POST" })
        ;(document.getElementById("current-name") as HTMLInputElement).value = newName
    }
    const changePassword = async () => {
        const oldPassword = (document.getElementById("current-password") as HTMLInputElement).value
        const newPassword = (document.getElementById("new-password") as HTMLInputElement).value
        if (oldPassword === newPassword) return
        if (newPassword.length <= 8) return
        await fetch(ENDPOINTS.CHANGE_PASSWORD, { method: "POST", body: JSON.stringify({newPassword: newPassword, oldPassword: oldPassword}) })
    }
    const changeLanguage = async () => {
        const selectedLanguage = (document.getElementById("language-select") as HTMLSelectElement).value
        cookies.set("language", selectedLanguage, {expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60), path: "/"})
        router.reload()
    }
    return (
        <div className="d-flex">
            <SideNav user={user} />
            <div className="vh-100 mw-100 content flex-shrink-0 p-3" style={{overflowY: "scroll", overflowX: "hidden"}}>
                <div className="row">
                    <div style={{ width: "40vh" }} className="card bg-dark text-white float-left m-3">
                        <div className="card-title text-center pt-3">
                            {"Username".localize()}
                        </div>
                        <div className="card-body">
                            <InputTextBox id="current-username" label={"Current Username".localize()} type="text" value={user.username} readonly={true} />
                            {user.permissions.profile.usernameChange ?
                                <>
                                    <InputTextBox id="new-username" label={"New Username".localize()} type="text" />
                                    <InputTextBox id="current-password-username" label={"Current Password".localize()} type="password" />
                                    <Button onClick={changeUsername} className="w-100" text={"Change Username".localize()} />
                                </> : ""}
                        </div>
                    </div>

                    <div style={{ width: "40vh" }} className="card bg-dark text-white float-left m-3">
                        <div className="card-title text-center pt-3">
                            {"Name".localize()}
                        </div>
                        <div className="card-body">
                            <InputTextBox id="current-name" label={"Current Name".localize()} type="text" value={user.name} readonly={true} />
                            {user.permissions.profile.nameChange ?
                                <>
                                    <InputTextBox id="new-name" label={"New Name".localize()} type="text" />
                                    <InputTextBox id="current-password-name" label={"Current Password".localize()} type="password" />
                                    <Button onClick={changeName} className="w-100" text={"Change Name".localize()} />
                                </> : ""}
                        </div>
                    </div>

                    <div style={{ width: "40vh" }} className="card bg-dark text-white float-left m-3">
                        <div className="card-title text-center pt-3">
                            {"Password".localize()}
                        </div>
                        <div className="card-body">
                            <InputTextBox id="current-password" label={"Current Password".localize()} type="password" />
                            {user.permissions.profile.passwordChange ?
                                <>
                                    <InputTextBox id="new-password" label={"New Password".localize()} type="password" />
                                    <InputTextBox id="new-password-confirm" label={"New Password".localize()} type="password" />
                                    <Button onClick={changePassword} className="w-100" text={"Change Password".localize()} />
                                </> : ""}
                        </div>
                    </div>

                    <div style={{ width: "40vh" }} className="card bg-dark text-white float-left m-3">
                        <div className="card-title text-center pt-3">
                            {"Language".localize()}
                        </div>
                        <div className="card-body">
                            <select id="language-select" style={{width: "100%"}}>
                                {languages.map((lang: {name: string, displayName: string}) => <option key={lang.name} value={lang.name}>{lang.displayName}</option>)}
                            </select>
                            <Button onClick={changeLanguage} className="w-100" text={"Change Language.".localize()} />
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
    const [,user] = await getUserData(cookies.session)
    
    return { props: { user, languages: [{name: "EN", displayName: "English"},{name: "CZ", displayName: "Česky"}] } }
}

export default Profile
