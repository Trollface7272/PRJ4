import { ClientUserTypes } from '@database/types/users'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { calculateProgress } from 'utils/clientUtils'
import { ENDPOINTS, PostRequest } from 'utils/requests'
import NavBarElement from './NavBarElement'

interface props {
    user: ClientUserTypes.User
}
const SideNav = ({ user }: props) => {
    const profileImage = ""
    const router = useRouter()
    return (
        <nav className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark vh-100" style={{ width: "280px" }}>
            <Link href="/dashboard">
                <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none justify-content-center w-100 pointer">
                    {/*<Image src={logoUrl} width="32" height="32" className="bi me-2" />*/}
                    <span className="fs-4" style={{ textDecoration: "none" }}>{"App Name".localize()}</span>
                </div>
            </Link>
            {!user.permissions.admin && !user.permissions.teacher ? <div className="d-flex flex-column">
                <div>{"Coins:".localize()} {user.coins}</div>
                <div className="w-75"><span>{"Level:".localize()} {user.level} ({calculateProgress(user.level, user.xp)}%)</span></div>
            </div> : ""}
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                <NavBarElement url={["/dashboard"]} img="/dashboard.svg" text="Dashboard" />
                <NavBarElement url={["/quests", "/quest/add"]} img="/quests.svg" text="Quests" />
                <NavBarElement url={["/shop", "/shop/add"]} img="/shop.svg" text="Shop" />
                {/* <NavBarElement url={["/messages"]} img="/messages.svg" text="Messages" /> */}
                {user.permissions.admin ? <NavBarElement url={["/users/add"]} img="/add.svg" text={"Add Users".localize()} /> : ""}
                {/* {user.permissions.admin ? <NavBarElement url={["/users/list"]} img="/list.svg" text={"Userlist".localize()} /> : ""} */}
            </ul>
            <hr />
            <div>
                <Link href="/profile">
                    <div className="text-decoration-none pointer">
                        <img src={profileImage} width="48" className="rounded-circle me-2" />
                        <strong className="text-white fs-5 align-middle">{user.name}</strong>
                        <button style={{ maxWidth: "50%", fontSize: "12px" }} className="float-end btn" onClick={(e) => { e.preventDefault(); PostRequest(ENDPOINTS.LOGOUT, {}).then(e => router.push("/login")) }}>
                            <img src="/logout.svg" width="32px" className="bi me-2 fill-white" />
                        </button>
                    </div>
                </Link>
            </div>
        </nav>
    )
}

export default SideNav
