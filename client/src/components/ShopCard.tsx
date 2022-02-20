import { useRef } from 'react'
import { Card } from 'react-bootstrap'
import { useCookies } from 'react-cookie'
import { PostRequest } from '../shared/functions'
import { IShopItem } from '../types/api-shop'

interface param {
    shopItem: IShopItem
}

const ShopCard = ({shopItem}: param) => {
    const [cookies] = useCookies(["session"])
    const ref = useRef<HTMLButtonElement>(null)

    const buyHandler = () => {
        PostRequest("/api/shop/buy", {id: shopItem._id, session: cookies.session})
        .catch(e => ref.current!.disabled = false)
        .then(e => ref.current!.disabled = false)
        ref.current!.disabled = true
    }

    return (
        <Card style={{width: "250px"}} className="background-dark">
            <Card.Header className="d-flex justify-content-center align-items-center">
                <Card.Title className="justify-content-center align-items-center d-flex h-100">
                    {shopItem.name}
                </Card.Title>
            </Card.Header>
            <Card.Body>
                {shopItem.description}
            </Card.Body>
            <Card.Footer className="d-flex">
                <div className="w-50">Coins: {shopItem.cost}</div>
                <div className="w-50 d-flex justify-content-end"><button ref={ref} onClick={buyHandler} className="btn btn-outline-dark btn-lg px-5">{"Buy".localize()}</button></div>
            </Card.Footer>
        </Card>
    )
}

export default ShopCard
