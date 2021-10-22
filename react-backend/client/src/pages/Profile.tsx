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
                <Card style={{width: "40vh"}} className="bg-dark text-white">
                    <Card.Title className="text-center pt-3">
                        {getLocal("username")}
                    </Card.Title>
                    <Card.Body>
                        <InputTextBox id="test" label="test" type="text" />
                        <Button text={getLocal("change-username")} />
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}

export default Profile
