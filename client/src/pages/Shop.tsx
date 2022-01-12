import { useCookies } from "react-cookie"
import { useHistory } from "react-router"
import useSWR from "swr"
import SideNav from "../components/SideNav"
import { swrFetcher } from "../shared/functions"
import { IShopItem } from "../types/api-shop"
import ShopCard from "../components/ShopCard"

const Shop = () => {
    const [cookies] = useCookies(["session"])
    const { data } = useSWR(["/api/shop/load", cookies.session], swrFetcher)
    const history = useHistory()
    let shopItems: IShopItem[]
    if (data) shopItems = data
    else shopItems = []
    console.log(data);
    
    return (
        <>
            <SideNav />
            <div className="content flex-shrink-0 p-3 d-inline-block" style={{overflowY: "scroll"}}>
            {shopItems.map(el => <div key={el._id} className="mx-2 my-1 float-start"><ShopCard shopItem={el}></ShopCard></div>)}
            </div>
        </>
    )
}

export default Shop
