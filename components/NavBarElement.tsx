import Link from "next/link"
import { useRouter } from "next/router"

interface props {
    url: string[]
    img: string
    text: string
}

const NavBarElement = ({ url, img, text }: props) => {
    const router = useRouter()
    return (
        <li>
            <Link href={url[0]}>
                <div className={"nav-link text-white pointer " + (url.includes(router.pathname) ? "active" : "")}>
                    <img src={img} width="32px" className="bi me-2 fill-white" />
                    <span>{text.localize()}</span>
                </div>
            </Link>
        </li>
    )
}


export default NavBarElement