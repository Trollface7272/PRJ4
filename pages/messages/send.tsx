import Button from "@components/Button"
import SideNav from "@components/SideNav"
import { ClientUserTypes } from "@database/types/users"
import { NextPageContext } from "next"
import { useRouter } from "next/router"
import { readFile } from "utils/clientUtils"
import { Cookie } from "utils/cookies"
import { ENDPOINTS, PostRequest } from "utils/requests"
import { getUserData, getUserNames } from "utils/serverUtils"

interface props {
    names: { _id: string, name: string }[]
    user: ClientUserTypes.User
}

const SendMessage = ({ user, names }: props) => {
    const router = useRouter()

    const fileInputHandle = () => {
        const input = document.getElementById("latest") as HTMLInputElement
        const form = document.getElementById("form")
        if (!input || !form) return

        input.onchange = () => { }
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
        PostRequest(ENDPOINTS.SEND_MESSAGE, { text: text, files: data, to: sendTo })
            .catch(e => submitButton.disabled = false)
            .then(e => {
                if (!e) router.push("/messages")
                else submitButton.disabled = false
            })
        submitButton.disabled = true
    }
    return (
        <div className="d-flex">
            <SideNav user={user} />
            <div className="d-flex justify-content-center align-items-center w-100 h-100" >
                <div className="card text-white bg-dark" style={{ width: "60%", height: "75%" }}>
                    <div className="card-header"><div className="card-title text-center">{"New Message".localize()}</div></div>
                    <div className="card-body">
                        <div className="card-text">
                            <select style={{ width: "100%" }} id="sendToSelect">
                                {names.map((name: { _id: string, name: string }) => <option key={name._id} value={name._id}>{name.name}</option>)}
                            </select>
                        </div>
                        <div className="card-text mt-5" id="form">
                            <textarea id="textInput" className="w-100" style={{ resize: "none", height: "100px" }}></textarea>
                            <input id="latest" className="fileInput" type="file" onChange={fileInputHandle} />
                        </div>
                        <div className="card-text text-center">
                            <Button id="submitButton" text={"Submit".localize()} onClick={submitHandle}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps({ req, res, query }: NextPageContext) {
    if (!req || !res) { console.log("weird stuff in login, getServerSideProps"); return { props: {} } }
    const cookies = Cookie.parse(req)
    if (!cookies.session) return { props: {} }
    const [backendUser, user] = await getUserData(cookies.session)
    const [backendNames, frontendNames] = await getUserNames()
    
    return { props: { user, names: frontendNames } }
}

export default SendMessage