import { Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getLocal } from '../shared/functions'
import { IQuest } from '../types/api-quests'

interface param {
    quest: IQuest
}

const QuestCard = ({quest}: param) => {
    return (
        <Card style={{width: "250px"}} className="background-dark mx-auto m-3 py-3" >
            <Card.Header className="d-flex justify-content-center align-items-center">
                <Card.Title className="justify-content-center align-items-center d-flex h-100">
                    {quest.name}
                </Card.Title>
            </Card.Header>
            <Card.Body>
                {quest.description}
            </Card.Body>
            <Card.Footer>
                <div className="rewards d-flex">
                    <div className="w-50">Coins: {quest.rewards.coins}</div>
                    <div className="w-50 d-flex justify-content-end">Xp: {quest.rewards.xp}</div>
                </div>
            </Card.Footer>
            <Link to={"/quests/turnin/" + quest.id}>
                <Button className="w-100">{getLocal("quest-turn-in")}</Button>
            </Link>
        </Card>
    )
}

export default QuestCard
