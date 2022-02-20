import React from 'react'
import { Card } from 'react-bootstrap'

interface param {
    quest: Quest
}

const QuestCard = ({quest}: param) => {
    return (
        <Card style={{width: "250px"}} className="background-dark">
            <Card.Header className="d-flex justify-content-center align-items-center">
                <Card.Title className="justify-content-center align-items-center d-flex h-100">
                    {quest.name}
                </Card.Title>
            </Card.Header>
            <Card.Body>
                {quest.description}
            </Card.Body>
            <Card.Footer className="d-flex">
                <div className="w-50">Coins: {quest.rewards.coins}</div>
                <div className="w-50 d-flex justify-content-end">Xp: {quest.rewards.xp}</div>
            </Card.Footer>
        </Card>
    )
}

export default QuestCard
