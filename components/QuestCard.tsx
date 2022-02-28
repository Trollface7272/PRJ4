import { ClientQuestTypes } from '@database/types/quests'
import React from 'react'

interface params {
    quest: ClientQuestTypes.Quest
}

const QuestCard = ({quest}: params) => {
    return (
        <div style={{width: "250px"}} className="card background-dark">
            <div className="card-header d-flex justify-content-center align-items-center">
                <div className="card-title justify-content-center align-items-center d-flex h-100">
                    {quest.name}
                </div>
            </div>
            <div className='card-body'>
                {quest.description}
            </div>
            <div className="d-flex card-footer">
                <div className="w-50">Coins: {quest.rewards.coins}</div>
                <div className="w-50 d-flex justify-content-end">Xp: {quest.rewards.xp}</div>
            </div>
        </div>
    )
}

export default QuestCard
