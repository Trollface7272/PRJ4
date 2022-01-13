import useSWR from "swr"
import SideNav from "../components/SideNav"
import { loadLocal } from "../shared/functions"

const Messages = () => {
    useSWR("local", loadLocal)
    return (
        <>
            <SideNav />
        </>
    )
}

export default Messages
