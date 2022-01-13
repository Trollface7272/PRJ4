import { Card } from "react-bootstrap"
import { useCookies } from "react-cookie"
import useSWR from "swr"
import Button from "../components/Button"
import SideNav from "../components/SideNav"
import { getLocal, swrFetcher } from "../shared/functions"


const SendMessage = () => {
    const [cookies] = useCookies(["session"])
    const {data:namesRaw} = useSWR(["/api/users/getnames", cookies.session], swrFetcher)
    const names = namesRaw ? namesRaw : []
    return (
        <>
            <SideNav />
            <div className="d-flex justify-content-center align-items-center w-100 h-100" >
                <Card className="text-white bg-dark" style={{width: "60%", height: "75%"}}>
                    <Card.Header><Card.Title className="text-center">{getLocal("send-message-title")}</Card.Title></Card.Header>
                    <Card.Body>
                        <Card.Text>
                            <select style={{width: "100%"}}>
                                {names.map((name: {_id: string, name: string}) => <option key={name._id} value={name._id}>{name.name}</option>)}
                            </select>
                        </Card.Text>
                        <Card.Text className="mt-5" id="form">
                            <textarea id="textInput" className="w-100" style={{resize: "none", height: "100px"}}></textarea>
                            <input id="latest" className="fileInput" type="file" onChange={() => {}}/>
                        </Card.Text>
                        <Card.Text className="text-center">
                            <Button id="submitButton" text={getLocal("submit")} onClick={() => {}}></Button>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}



export default SendMessage