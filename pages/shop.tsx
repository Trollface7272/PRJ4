import SideNav from "../components/SideNav"
import ShopCard from "../components/ShopCard"
import { ClientShopTypes } from "@database/types/shop"
import { ClientUserTypes } from "@database/types/users"
import { NextPageContext } from "next"
import { Connect } from "@database/index"
import { Cookie } from "utils/cookies"
import { getShopItems, getUserData } from "utils/serverUtils"

interface props {
    items: ClientShopTypes.Item[]
    user: ClientUserTypes.User
}

const Shop = ({items, user}: props) => {
    console.log(items);
    
    return (
        <div className="d-flex">
            <SideNav user={user} />
            <div className="content flex-shrink-0 p-3 d-inline-block" style={{overflowY: "auto"}}>
            {items.map(el => <div key={el._id} className="mx-2 my-1 float-start"><ShopCard item={el}></ShopCard></div>)}
            </div>
        </div>
    )
}

export async function getServerSideProps({ req, res }: NextPageContext) {
    await Connect()
    if (!req || !res) { console.log("weird stuff in login, getServerSideProps"); return { props: {} } }
    const cookies = Cookie.parse(req)
    if (!cookies.session) return { props: {} }
    const [backendUser, frontendUser] = await getUserData(cookies.session)
    const [backendItems, frontendItems] = await getShopItems(backendUser)

    return { props: { user: frontendUser, items: frontendItems } }
}

export default Shop
