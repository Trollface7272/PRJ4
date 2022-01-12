import { Card } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { useHistory, useParams } from "react-router"
import useSWR from "swr";
import Button from "../components/Button";
import SideNav from "../components/SideNav";
import { getLocal, PostRequest, readFile, swrFetcher } from "../shared/functions";



const Quest = () => {
    const { id } = useParams<{id: string}>()
    const [cookies] = useCookies(["session"])
    const { data } = useSWR([`/api/quests/quest/${id}`, cookies.session], swrFetcher)
    const history = useHistory()
    console.log(data);
    if (!data) return <><SideNav /></>
    const fileInputHandle = () => {
        const input = document.getElementById("latest")
        const form = document.getElementById("form")

        input!.onchange = () => {}
        input!.id = ""
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
        
        console.log(data)
        const submitButton = document.getElementById("submitButton") as HTMLButtonElement
        PostRequest(`/api/quests/submit/${id}`, {text: text, files: data, session: cookies.session})
        .catch(e => submitButton.disabled = false)
        .then(e => history.push("/quests"))
        submitButton.disabled = true
    }

    return (
        <>
            <SideNav />
            <div className="d-flex justify-content-center align-items-center w-100 h-100" >
                <Card className="text-white bg-dark" style={{width: "60%", height: "75%"}}>
                    <Card.Header><Card.Title className="text-center">{data.name}</Card.Title></Card.Header>
                    <Card.Body>
                        <Card.Text>{data.description}</Card.Text>
                        <Card.Text className="mt-5" id="form">
                            <textarea id="textInput" className="w-100" style={{resize: "none", height: "100px"}}></textarea>
                            <input id="latest" className="fileInput" type="file" onChange={fileInputHandle}/>
                        </Card.Text>
                        <Card.Text className="text-center">
                            <Button id="submitButton" text={getLocal("submit")} onClick={submitHandle}></Button>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}


export default Quest