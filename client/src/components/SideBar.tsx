import { Image, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router'
import { swrFetcher } from '../shared/functions'
import { logoUrl } from '../shared/Globals'
import { EmptyUser, User } from '../types/api-users'
import useSWR from "swr"
import { useCookies } from 'react-cookie'

const SideBar = () => {
    const [cookies, , removeCookie] = useCookies(["session"])
    const { data, error } = useSWR(["/api/users/user", cookies.session], swrFetcher)
    let profile: User
    if (!data || error) profile = EmptyUser
    else profile = data.user

    const path = useLocation()
    const LinkClasses = "nav-link text-white"
    const profileImage = logoUrl
    return (
        <Nav className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark vh-100" style={{width: "280px"}}>
                <Link to="/dashboard" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    {/*<Image src={logoUrl} width="32" height="32" className="bi me-2" />*/}
                    <span className="fs-4" style={{textDecoration: "none"}}>{"App Name".localize()}</span>
                </Link>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li>
                        <Link to="/dashboard" className={LinkClasses + (path.pathname === "/dashboard" ? "active" : "")}>
                            <Image src="/dashboard.svg" width="32px" className="bi me-2 fill-white" />
                            <span>{"Dashboard".localize()}</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/quests" className={LinkClasses + (path.pathname === "/quests" ? "active" : "")}>
                            <Image src="/quests.svg" width="32px" className="bi me-2 fill-white" />
                            <span>{"Quests".localize()}</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/shop" className={LinkClasses + (path.pathname === "/shop" ? "active" : "")}>
                            <Image src="/shop.svg" width="32px" className="bi me-2 fill-white" />
                            <span>{"Shop".localize()}</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/messages" className={LinkClasses + (path.pathname === "/messages" ? "active" : "")}>
                            <Image src="/messages.svg" width="32px" className="bi me-2 fill-white" />
                            <span>{"Messages".localize()}</span>
                        </Link>
                    </li>
                </ul>
                <hr />
                <div>
                    <Link to="/profile" className="text-decoration-none">
                        <Image src={profileImage} width="48" className="rounded-circle me-2" />
                        <strong className="text-white fs-5 align-middle">{profile.name}</strong>
                        <button style={{maxWidth: "50%", fontSize: "12px"}} className="float-end btn" onClick={() => {removeCookie("session")}}>
                            <Image src="/logout.svg" width="32px" className="bi me-2 fill-white" />
                        </button>
                    </Link>
                </div>
            </Nav>
    )
}

export default SideBar
