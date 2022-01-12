import { Card } from 'react-bootstrap'
import { getLocal } from '../shared/functions'
import { IShopItem } from '../types/api-shop'
import Button from './Button'

interface param {
    shopItem: IShopItem
}

const QuestCard = ({shopItem}: param) => {
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
                <div className="w-50 d-flex justify-content-end"><button className="btn btn-outline-dark btn-lg px-5">{getLocal("buy")}</button></div>
            </Card.Footer>
        </Card>
    )
}

export default QuestCard
