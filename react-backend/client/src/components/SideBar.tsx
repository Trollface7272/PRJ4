import { useEffect, useState } from 'react'
import { Image, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router'
import { getLocal, getProfileData, loadLocal, loaded as localLoaded, getProfileFast } from '../shared/functions'
import { logoUrl } from '../shared/Globals'
import { EmptyUser } from '../types/api-users'

const SideBar = () => {
    const [loaded, setLoaded] = useState(localLoaded)
    const [profile, setProfile] = useState(getProfileFast())
    
    
    useEffect(() => {
        if (profile === EmptyUser)
            getProfileData().then(e => setProfile(e))
        if (!loaded)
            loadLocal().then(e => setLoaded(true))
    }, [])
    const path = useLocation()
    const LinkClasses = "nav-link text-white"
    const profileImage = logoUrl
    return (
        <Nav className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark vh-100" style={{width: "280px"}}>
                <Link to="/dashboard" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <Image src={logoUrl} width="32" height="32" className="bi me-2" />
                    <span className="fs-4" style={{textDecoration: "none"}}>{getLocal("app-name")}</span>
                </Link>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li>
                        <Link to="/dashboard" className={LinkClasses + (path.pathname === "/dashboard" ? "active" : "")}>
                            <Image src="/dashboard.svg" width="32px" className="bi me-2 fill-white" />
                            <span>{getLocal("dashboard")}</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/quests" className={LinkClasses + (path.pathname === "/quests" ? "active" : "")}>
                            <Image src="/quests.svg" width="32px" className="bi me-2 fill-white" />
                            <span>{getLocal("quests")}</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/scheadule" className={LinkClasses + (path.pathname === "/scheadule" ? "active" : "")}>
                            <Image src="/scheadule.svg" width="32px" className="bi me-2 fill-white" />
                            <span>{getLocal("scheadule")}</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/messages" className={LinkClasses + (path.pathname === "/messages" ? "active" : "")}>
                            <Image src="/messages.svg" width="32px" className="bi me-2 fill-white" />
                            <span>{getLocal("messages")}</span>
                        </Link>
                    </li>
                </ul>
                <hr />
                <div>
                    <Link to="/profile" className="text-decoration-none">
                        <Image src={profileImage} width="48" className="rounded-circle me-2" />
                        <strong className="text-white fs-5 align-middle">{profile.name}</strong>
                    </Link>
                </div>
            </Nav>
    )
}

export default SideBar
