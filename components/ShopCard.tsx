import { ClientShopTypes } from '@database/types/shop'
import { useRef } from 'react'
import { PostRequest } from 'utils/requests'

interface params {
    item: ClientShopTypes.Item
}

const ShopCard = ({item}: params) => {
    const ref = useRef<HTMLButtonElement>(null)

    const buyHandler = () => {
        PostRequest("/api/shop/buy", {id: item._id})
        .catch(e => ref.current!.disabled = false)
        .then(e => ref.current!.disabled = false)
        ref.current!.disabled = true
    }

    return (
        <div style={{width: "250px"}} className="card background-dark">
            <div className="card-header d-flex justify-content-center align-items-center">
                <div className="card-title justify-content-center align-items-center d-flex h-100">
                    {item.name}
                </div>
            </div>
            <div className="card-body">
                {item.description}
            </div>
            <div className="card-footer d-flex">
                <div className="w-50">Coins: {item.cost}</div>
                <div className="w-50 d-flex justify-content-end"><button ref={ref} onClick={buyHandler} className="btn btn-outline-dark btn-lg px-5">{"Buy".localize()}</button></div>
            </div>
        </div>
    )
}

export default ShopCard
