import { ClientMessageTypes } from "@database/types/messages"

interface params {
    message: ClientMessageTypes.Message
}

const MessageCard = ({message}: params) => {
    return (
        <div style={{width: "250px"}} className="card background-dark">
            <div className="card-header d-flex justify-content-center align-items-center">
                <div className="card-title justify-content-center align-items-center d-flex h-100">
                    {"Message from:".localize()} {message.from.name}
                </div>
            </div>
            <div className="card-body">
                {message.text}
            </div>
            <div className="card-footer d-flex">
                <div className="w-50">{"%count% Attachments".localize().replace("%count%", message.fileNames.length.toString())}</div>
            </div>
        </div>
    )
}

export default MessageCard
