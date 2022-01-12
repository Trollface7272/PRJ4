import { useEffect, useState } from 'react'
import { Card, Container } from 'react-bootstrap'
import { useParams } from 'react-router'
import SideNav from '../../components/SideNav'
import { GetQuestById } from '../../shared/functions'
import { EmptyQuest, IQuest } from '../../types/api-quests'

const TurnIn = () => {
    const [quest, setQuest] = useState(EmptyQuest)
    let { id }: {id: string} = useParams()
    let q = GetQuestById(id)
    useEffect(() => {
        q.then(data => setQuest(data as IQuest))
    }, [])
    return (
        <>
        <SideNav />
        <Card className="w-50 h-75 justify-content-center">
            <Card.Header>
                {quest.name}
            </Card.Header>
            <Card.Body>
                {quest.description}
            </Card.Body>
        </Card>
        </>
    )
}

export default TurnIn
