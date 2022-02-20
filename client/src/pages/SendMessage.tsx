import { Card } from "react-bootstrap"
import { useCookies } from "react-cookie"
import { useHistory } from "react-router"
import useSWR from "swr"
import Button from "../components/Button"
import SideNav from "../components/SideNav"
import { PostRequest, readFile, swrFetcher } from "../shared/functions"


const SendMessage = () => {
    const [cookies] = useCookies(["session"])
    const history = useHistory()
    const {data:namesRaw} = useSWR(["/api/users/getnames", cookies.session], swrFetcher)
    const names = namesRaw ? namesRaw : []
    const fileInputHandle = () => {
        const input = document.getElementById("latest") as HTMLInputElement
        const form = document.getElementById("form")
        if (!input || !form) return

        input.onchange = () => {}
        input.id = ""
        const newInput = document.createElement("input")
        newInput.id = "latest"
        newInput.className = "fileInput"
        newInput.type = "file"
        newInput.onchange = fileInputHandle
        form!.appendChild(newInput)
    }
    const submitHandle = async () => {
        const text = (document.getElementById("textInput") as HTMLInputElement).value
        const fileInput = (document.getElementsByClassName("fileInput") as HTMLCollectionOf<HTMLInputElement>)
        const sendTo = (document.getElementById("sendToSelect") as HTMLSelectElement).value
        const files = []
        
        for (let i = 0; i < fileInput.length; i++) {
            const input = fileInput[i]
            if (input.files?.length === 0) continue
            files.push(input.files![0])
        }

        const data = []
        for (const file of files) {
            data.push({
                name: file.name,
                type: file.type,
                data: await readFile(file)
            })
        }
        const submitButton = document.getElementById("submitButton") as HTMLButtonElement
        PostRequest(`/api/messages/send`, {text: text, files: data, session: cookies.session, to: sendTo})
        .catch(e => submitButton.disabled = false)
        .then(e => {
            if (!e) history.push("/messages")
            else submitButton.disabled = false
        })
        submitButton.disabled = true
    }
    return (
        <>
            <SideNav />
            <div className="d-flex justify-content-center align-items-center w-100 h-100" >
                <Card className="text-white bg-dark" style={{width: "60%", height: "75%"}}>
                    <Card.Header><Card.Title className="text-center">{"New Message".localize()}</Card.Title></Card.Header>
                    <Card.Body>
                        <Card.Text>
                            <select style={{width: "100%"}} id="sendToSelect">
                                {names.map((name: {_id: string, name: string}) => <option key={name._id} value={name._id}>{name.name}</option>)}
                            </select>
                        </Card.Text>
                        <Card.Text className="mt-5" id="form">
                            <textarea id="textInput" className="w-100" style={{resize: "none", height: "100px"}}></textarea>
                            <input id="latest" className="fileInput" type="file" onChange={fileInputHandle}/>
                        </Card.Text>
                        <Card.Text className="text-center">
                            <Button id="submitButton" text={"Submit".localize()} onClick={submitHandle}></Button>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}



export default SendMessage