import { Card } from "react-bootstrap"
import InputTextBox from "../components/InputTextBox"
import SideNav from "../components/SideNav"
import Button from "../components/Button"
import { PostRequest, swrFetcher } from "../shared/functions"
import useSWR from "swr"
import { useCookies } from "react-cookie"
import { EmptyPermissions, EmptyUser } from "../types/api-users"
import { useHistory } from "react-router"
import { LanguageNameList } from "../prestart"

const Profile = () => {
    const history = useHistory()
    const [cookies, setCookie] = useCookies(["session", "language"])
    const { data } = useSWR(["/api/users/user", cookies.session], swrFetcher)
    const { data:permRaw } = useSWR(["/api/users/permissions", cookies.session], swrFetcher)
    
    
    const profile = data ? data.user : EmptyUser
    const permissions = permRaw ? permRaw.permissions : EmptyPermissions.permissions
    const languages = LanguageNameList

    const changeUsername = async () => {
        const newUsername = (document.getElementById("new-username") as HTMLInputElement).value
        const password = (document.getElementById("current-password-username") as HTMLInputElement).value
        if (newUsername.length <= 4) return
        await PostRequest("/api/users/changeusername", { newUsername: newUsername, session: cookies.session, password: password })
        ;(document.getElementById("current-username") as HTMLInputElement).value = newUsername
    }
    const changeName = async () => {
        const newName = (document.getElementById("new-name") as HTMLInputElement).value
        const password = (document.getElementById("current-password-name") as HTMLInputElement).value
        if (newName.length <= 4) return
        await PostRequest("/api/users/changename", { newName: newName, session: cookies.session, password: password })
        ;(document.getElementById("current-name") as HTMLInputElement).value = newName
    }
    const changePassword = async () => {
        const oldPassword = (document.getElementById("current-password") as HTMLInputElement).value
        const newPassword = (document.getElementById("new-password") as HTMLInputElement).value
        if (oldPassword === newPassword) return
        if (newPassword.length <= 8) return
        await PostRequest("/api/users/changepassword", { newPassword: newPassword, oldPassword: oldPassword, session: cookies.session })
    }
    const changeLanguage = async () => {
        const selectedLanguage = (document.getElementById("language-select") as HTMLSelectElement).value
        setCookie("language", selectedLanguage)
        //TODO: fix
        history.push("/dashboard")
    }
    return (
        <>
            <SideNav />
            <div className="vh-100 mw-100 content flex-shrink-0 p-3" style={{overflowY: "scroll", overflowX: "hidden"}}>
                <div className="row">
                    <Card style={{ width: "40vh" }} className="bg-dark text-white float-left m-3">
                        <Card.Title className="text-center pt-3">
                            {"Username".localize()}
                        </Card.Title>
                        <Card.Body>
                            <InputTextBox id="current-username" label="Current Username" type="text" value={profile.username} readonly={true} />
                            {permissions.profile.usernameChange ?
                                <>
                                    <InputTextBox id="new-username" label="New Username" type="text" />
                                    <InputTextBox id="current-password-username" label="Current Password" type="password" />
                                    <Button onClick={changeUsername} className="w-100" text={"Change Username".localize()} />
                                </> : ""}
                        </Card.Body>
                    </Card>

                    <Card style={{ width: "40vh" }} className="bg-dark text-white float-left m-3">
                        <Card.Title className="text-center pt-3">
                            {"Name".localize()}
                        </Card.Title>
                        <Card.Body>
                            <InputTextBox id="current-name" label="Current Name" type="text" value={profile.name} readonly={true} />
                            {permissions.profile.nameChange ?
                                <>
                                    <InputTextBox id="new-name" label="New Name" type="text" />
                                    <InputTextBox id="current-password-name" label="Current Password" type="password" />
                                    <Button onClick={changeName} className="w-100" text={"Change Name".localize()} />
                                </> : ""}
                        </Card.Body>
                    </Card>

                    <Card style={{ width: "40vh" }} className="bg-dark text-white float-left m-3">
                        <Card.Title className="text-center pt-3">
                            {"Password".localize()}
                        </Card.Title>
                        <Card.Body>
                            <InputTextBox id="current-password" label="Current Password" type="password" />
                            {permissions.profile.passwordChange ?
                                <>
                                    <InputTextBox id="new-password" label="New Password" type="password" />
                                    <InputTextBox id="new-password-confirm" label="New Password" type="password" />
                                    <Button onClick={changePassword} className="w-100" text={"Change Password".localize()} />
                                </> : ""}
                        </Card.Body>
                    </Card>

                    <Card style={{ width: "40vh" }} className="bg-dark text-white float-left m-3">
                        <Card.Title className="text-center pt-3">
                            {"Language".localize()}
                        </Card.Title>
                        <Card.Body>
                            <select id="language-select" style={{width: "100%"}}>
                                {languages.map((lang: {name: string, displayName: string}) => <option key={lang.name} value={lang.name}>{lang.displayName}</option>)}
                            </select>
                            <Button onClick={changeLanguage} className="w-100" text={"Change Language.".localize()} />
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default Profile