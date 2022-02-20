import { Card } from 'react-bootstrap'
import { IMessage } from '../types/api-quests'

interface param {
    message: IMessage
}

const MessageCard = ({message}: param) => {
    return (
        <Card  style={{width: "250px"}} className="background-dark">
            <Card.Header className="d-flex justify-content-center align-items-center">
                <Card.Title className="justify-content-center align-items-center d-flex h-100">
                    {"Message from:".localize()} {message.from.name}
                </Card.Title>
            </Card.Header>
            <Card.Body>
                {message.text}
            </Card.Body>
            <Card.Footer className="d-flex">
                <div className="w-50">{"%count% Attachments".localize().replace("%count%", message.fileNames.length.toString())}</div>
            </Card.Footer>
        </Card>
    )
}

export default MessageCard
