import { Card } from "react-bootstrap"
import { useCookies } from "react-cookie"
import { useParams } from "react-router"
import useSWR from "swr"
import SideNav from "../components/SideNav"
import { swrFetcher } from "../shared/functions"
import { IMessage } from "../types/api-quests"

const Message = () => {
    const { id } = useParams<{ id: string }>()
    const [cookies] = useCookies(["session"])
    const { data: msgRaw } = useSWR([`/api/messages/message/${id}`, cookies.session], swrFetcher)
    const message: IMessage = msgRaw ? msgRaw : { _id: "", to: { name: "", _id: "" }, from: { name: "", _id: "" }, text: "", fileNames: [] }
    const images: { name: string, originalName: string }[] = []
    const rest: { name: string, originalName: string }[] = []
    console.log(message);
    
    message.fileNames.forEach((file, index) => {
        if (file.endsWith(".jpg") || file.endsWith(".png")) images.push({ name: file, originalName: message.originalNames[index] })
        else rest.push({ name: file, originalName: message.originalNames[index] })
    })
    return (
        <>
            <SideNav />
            <div className="d-flex justify-content-center align-items-center w-100 h-100" >
                <Card className="text-white bg-dark" style={{ width: "60%", height: "75%" }}>
                    <Card.Header><Card.Title className="text-center">{"Message from:".localize()} {message.to.name}</Card.Title></Card.Header>
                    <Card.Body>
                        <Card.Text>{message.text}</Card.Text>
                        <Card.Text>
                            {message.fileNames.length === 0 ? "" : "Attachments:"}
                            <div>{rest.map((file) => (<a key={file.name} href={`/files/${file.name}`} download={file.originalName}>{"Download".localize()} {file.originalName}</a>))}</div>
                            <div>{images.map((file) => (<img alt="" key={file.name} src={`/files/${file.name}`} style={{maxWidth: "50%"}} />))}</div>

                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}

export default Message
