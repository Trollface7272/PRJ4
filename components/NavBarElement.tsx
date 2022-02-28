import { useRouter } from "next/router"

interface props {
    url: string
    img: string
    text: string
}

const NavBarElement = ({ url, img, text }: props) => {
    const router = useRouter()
    return (
        <li>
            <a href={url} className={"nav-link text-white" + (router.pathname === url ? "active" : "")}>
                <img src={img} width="32px" className="bi me-2 fill-white" />
                <span>{text.localize()}</span>
            </a>
        </li>
    )
}


export default NavBarElement