import { Card } from "react-bootstrap"
import InputTextBox from "../components/InputTextBox"
import SideNav from "../components/SideNav"
import Button from "../components/Button"
import { getLocal, getProfileFast } from "../shared/functions"

const Profile = () => {
    const profile = getProfileFast()
    return (
        <>
            <SideNav />
            <div className="vh-100 mw-100 content flex-shrink-0 p-3">
                <div className="row">
                    <Card style={{width: "40vh"}} className="bg-dark text-white float-left m-3">
                        <Card.Title className="text-center pt-3">
                            {getLocal("username")}
                        </Card.Title>
                        <Card.Body>
                            <InputTextBox id="current-username" label="Current Username" type="text" value={profile.username} readonly={true} />
                            {profile.permissions.profile.usernameChange ? 
                            <>
                                <InputTextBox id="new-username" label="New Username" type="text" />
                                <Button className="w-100" text={getLocal("change-username")} />
                            </> : ""}
                        </Card.Body>
                    </Card>

                    <Card style={{width: "40vh"}} className="bg-dark text-white float-left m-3">
                        <Card.Title className="text-center pt-3">
                            {getLocal("name")}
                        </Card.Title>
                        <Card.Body>
                            <InputTextBox id="current-name" label="Current Name" type="text" value={profile.name} readonly={true} />
                            {profile.permissions.profile.nameChange ? 
                            <>
                                <InputTextBox id="new-name" label="New Name" type="text" />
                                <Button className="w-100" text={getLocal("change-name")} />
                            </> : ""}
                        </Card.Body>
                    </Card>

                    <Card style={{width: "40vh"}} className="bg-dark text-white float-left m-3">
                        <Card.Title className="text-center pt-3">
                            {getLocal("password")}
                        </Card.Title>
                        <Card.Body>
                            <InputTextBox id="current-password" label="Current Password" type="password" />
                            {profile.permissions.profile.passwordChange ? 
                            <>
                                <InputTextBox id="new-password" label="New Password" type="password" />
                                <InputTextBox id="new-password-confirm" label="New Password" type="password" />
                                <Button className="w-100" text={getLocal("change-password")} />
                            </> : ""}
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default Profile
