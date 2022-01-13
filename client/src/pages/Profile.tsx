import { Card } from "react-bootstrap"
import InputTextBox from "../components/InputTextBox"
import SideNav from "../components/SideNav"
import Button from "../components/Button"
import { getLocal, loadLocal, PostRequest, swrFetcher } from "../shared/functions"
import useSWR from "swr"
import { useCookies } from "react-cookie"
import { EmptyPermissions, EmptyUser } from "../types/api-users"

const Profile = () => {
    useSWR("local", loadLocal)
    const [cookies] = useCookies(["session"])
    const { data } = useSWR(["/api/users/user", cookies.session], swrFetcher)
    const { data:permRaw } = useSWR(["/api/users/permissions", cookies.session], swrFetcher)
    
    const profile = data ? data.user : EmptyUser
    const permissions = permRaw ? permRaw.permissions : EmptyPermissions.permissions

    const changeUsername = async () => {
        const newUsername = (document.getElementById("new-username") as HTMLInputElement).value
        const password = (document.getElementById("current-password-username") as HTMLInputElement).value
        if (newUsername.length <= 4) return
        await PostRequest("/api/users/changeusername", { newUsername: newUsername, session: cookies.session, password: password })
    }
    const changeName = async () => {
        const newName = (document.getElementById("new-name") as HTMLInputElement).value
        const password = (document.getElementById("current-password-name") as HTMLInputElement).value
        if (newName.length <= 4) return
        await PostRequest("/api/users/changename", { newName: newName, session: cookies.session, password: password })
    }
    const changePassword = async () => {
        const oldPassword = (document.getElementById("current-password") as HTMLInputElement).value
        const newPassword = (document.getElementById("new-password") as HTMLInputElement).value
        if (oldPassword === newPassword) return
        if (newPassword.length <= 8) return
        await PostRequest("/api/users/changepassword", { newPassword: newPassword, oldPassword: oldPassword, session: cookies.session })
    }
    return (
        <>
            <SideNav />
            <div className="vh-100 mw-100 content flex-shrink-0 p-3">
                <div className="row">
                    <Card style={{ width: "40vh" }} className="bg-dark text-white float-left m-3">
                        <Card.Title className="text-center pt-3">
                            {getLocal("username")}
                        </Card.Title>
                        <Card.Body>
                            <InputTextBox id="current-username" label="Current Username" type="text" value={profile.username} readonly={true} />
                            {permissions.profile.usernameChange ?
                                <>
                                    <InputTextBox id="new-username" label="New Username" type="text" />
                                    <InputTextBox id="current-password-username" label="Current Password" type="password" />
                                    <Button onClick={changeUsername} className="w-100" text={getLocal("change-username")} />
                                </> : ""}
                        </Card.Body>
                    </Card>

                    <Card style={{ width: "40vh" }} className="bg-dark text-white float-left m-3">
                        <Card.Title className="text-center pt-3">
                            {getLocal("name")}
                        </Card.Title>
                        <Card.Body>
                            <InputTextBox id="current-name" label="Current Name" type="text" value={profile.name} readonly={true} />
                            {permissions.profile.nameChange ?
                                <>
                                    <InputTextBox id="new-name" label="New Name" type="text" />
                                    <InputTextBox id="current-password-name" label="Current Password" type="password" />
                                    <Button onClick={changeName} className="w-100" text={getLocal("change-name")} />
                                </> : ""}
                        </Card.Body>
                    </Card>

                    <Card style={{ width: "40vh" }} className="bg-dark text-white float-left m-3">
                        <Card.Title className="text-center pt-3">
                            {getLocal("password")}
                        </Card.Title>
                        <Card.Body>
                            <InputTextBox id="current-password" label="Current Password" type="password" />
                            {permissions.profile.passwordChange ?
                                <>
                                    <InputTextBox id="new-password" label="New Password" type="password" />
                                    <InputTextBox id="new-password-confirm" label="New Password" type="password" />
                                    <Button onClick={changePassword} className="w-100" text={getLocal("change-password")} />
                                </> : ""}
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default Profile
