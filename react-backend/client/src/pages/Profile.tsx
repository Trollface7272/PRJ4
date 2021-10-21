import { Container } from "react-bootstrap"
import InputTextBox from "../components/InputTextBox"
import SideNav from "../components/SideNav"

const Profile = () => {
    return (
        <>
            <SideNav />
            <div>
                <InputTextBox id="test" label="test" />
            </div>
        </>
    )
}

export default Profile
