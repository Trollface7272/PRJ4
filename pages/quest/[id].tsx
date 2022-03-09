import Button from "@components/Button"
import SideNav from "@components/SideNav"
import { ClientQuestTypes } from "@database/types/quests"
import { ClientUserTypes } from "@database/types/users"
import { NextPageContext } from "next"
import { useRouter } from "next/router"
import { useEffect, useRef } from "react"
import { getStaticFilePath, imageFormats, readFile } from "utils/clientUtils"
import { Cookie } from "utils/cookies"
import { ENDPOINTS, PostRequest } from "utils/requests"
import { getQuest, getUserData } from "utils/serverUtils"

interface params {
    user: ClientUserTypes.User
    quest: ClientQuestTypes.Quest
    id: string
}

const Quest = (param: params) => {
    const { user } = param
    if (!user.permissions.admin && !user.permissions.teacher) return studentView(param)
    if (!user.permissions.admin) return teacherView(param)
    return teacherView(param)
}

const studentView = ({ user, quest, id }: params) => {
    const router = useRouter()
    if (!user || !quest) return <><SideNav user={user} /></>
    const fileInputHandle = () => {
        const input = document.getElementById("latest")
        const form = document.getElementById("form")

        input!.onchange = () => { }
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
        const submitButton = document.getElementById("submitButton") as HTMLButtonElement
        PostRequest(`/api/quests/submit/${id}`, { text: text, files: data })
            .catch(e => submitButton.disabled = false)
            .then(e => router.push("/quests"))
        submitButton.disabled = true
    }

    return (
        <div className="d-flex">
            <SideNav user={user} />
            <div className="d-flex justify-content-center align-items-center w-100 h-100" >
                <div className="card text-white bg-dark" style={{ width: "60%", height: "75%" }}>
                    <div className="card-header"><div className="card-title text-center">{quest.name}</div></div>
                    <div className="card-body">
                        <div className="card-text">{quest.description}</div>
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

const teacherView = ({ user, quest }: params) => {
    const submissionRef = useRef<HTMLDivElement>(null)
    if (!user || !quest || !quest.submissions) return <><SideNav user={user} /></>
    let offset = 0

    //TODO: enlarge image on click
    const run = async () => {
        if (!user || !quest || !quest.submissions || !submissionRef) return
        const submission: ClientQuestTypes.QuestSubmissions = quest.submissions[offset]
        if (!submission || !submissionRef.current) return
        const res = (await PostRequest(ENDPOINTS.GET_USER, { id: submission.userId })).data.user as ClientUserTypes.User
        const el =
            `<div class="card-title text-center">${"Submission by %name%".localize().replace("%name%", res.name)}</div>
            <div>${submission.text}</div>
            <div class="d-flex w-100 h-100 justify-content-center">${submission.files.map((el: string, i: number) => (
                `<div key=${el} style="float: left">
                    ${(imageFormats.indexOf(el.split(".").pop() || "") !== -1) ?
                    `<img width="128" src="${getStaticFilePath(submission.userId, el)}" />` :
                    `<a href="${getStaticFilePath(submission.userId, el)}" download="${submission.originalNames[i]}" >${submission.originalNames[i]}</a>`
                }
                </div>`)).join("")}
            </div>
            `
        submissionRef.current.innerHTML = el

    }


    useEffect(() => {
        run()
    }, [offset])



    return (
        <div className="d-flex">
            <SideNav user={user} />
            <div className="d-flex justify-content-center align-items-center w-100 h-100" >
                <div className="card text-white bg-dark" style={{ width: "60%", height: "75%" }}>
                    <div className="card-header"><div className="card-title text-center">{quest.name}</div></div>
                    <div className="card-body">
                        <div className="card-text">{quest.description}</div>
                        <hr />
                        <div ref={submissionRef} className="card-text h-100">
                        </div>
                        <div style={{ clear: "both" }}>
                            <button style={{float: "left"}} onClick={() => {
                                if (offset === 0) return
                                offset--
                                run()
                            }}>Previous</button>
                            <button style={{float: "right"}} onClick={() => {
                                if (offset === (quest.submissions?.length || 0) - 1) return
                                offset++
                                run()
                            }}>Next</button>
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
    const id = query.id as string
    const [backendQuest, frontendQuest] = await getQuest(backendUser, id)
    if (!backendUser.permissions.admin && !backendUser.permissions.teacher) delete frontendQuest.submissions

    return { props: { user, quest: frontendQuest, id } }
}

export default Quest