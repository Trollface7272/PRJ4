import { ClientUserTypes, ServerUserTypes } from "@database/types/users"
import { NextPageContext } from "next"
import { useRouter } from "next/router"
import { Cookie } from "utils/cookies"
import { getQuests, getUserData } from "utils/serverUtils"
import QuestCard from "../components/QuestCard"
import SideNav from "../components/SideNav"
import { ClientQuestTypes } from "@database/types/quests"
import styles from "../styles/Quests.module.css"
import useSWR from "swr"
import Groups from "@database/groups"
import { MouseEventHandler, ReactElement, useEffect, useRef, useState } from "react"
import { ENDPOINTS } from "utils/requests"
import { getStaticFilePath, imageFormats } from "utils/clientUtils"
import axios from "axios"

interface baseProps {
    user: ClientUserTypes.User
    quests: ClientQuestTypes.Quest[]
}

interface studentProps extends baseProps { }

interface teacherProps extends baseProps {
    groups: { _id: string, name: string }[]
}

const Quests = (props: studentProps | teacherProps) => {


    if (props.user.permissions.teacher || props.user.permissions.admin) return TeacherView2(props as teacherProps)
    else return StudentView(props as studentProps)


}
const fetcher = (url: string) => axios.post(url).then(res => res.data)

const TeacherView2 = ({ groups, user }: teacherProps) => {
    const [activeGroup, setActiveGroup] = useState(0)
    const [activeQuest, setActiveQuest] = useState(0)
    const group = groups[activeGroup]
    const { data: rQuests } = useSWR<{ quests: ClientQuestTypes.Quest[] }>(ENDPOINTS.QUESTS_BY_GROUP.replace("{id}", group._id), fetcher)
    const { data: rUsers } = useSWR<{ users: ClientUserTypes.User[] }>(ENDPOINTS.USERS_BY_GROUP.replace("{id}", group._id), fetcher)

    const quests = rQuests?.quests || []
    const users = rUsers?.users || []
    const quest = quests[activeQuest]
    console.log(rQuests, activeQuest, group);



    return (
        <div className="d-flex">
            <SideNav user={user} />
            <div className="w-100 d-flex justify-content-center" style={{ backgroundColor: "white" }}>
                <div id={styles.select} className="w-75 border">
                    <select className="w-100" onChange={(e) => setActiveGroup(parseInt(e.target.value))}>
                        {groups.map((el, i) =>
                            <option key={el._id} value={i}>{el.name}</option>
                        )}
                    </select>
                    <select className="w-100" onChange={(e) => setActiveQuest(parseInt(e.target.value))}>
                        {quests.map((el, i) =>
                            <option key={el._id} value={i}>{el.name}</option>
                        )}
                    </select>
                    <table className={"table mt-3 w-100 " + styles.table}>
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">{"Name".localize()}</th>
                                <th scope="col">{"Points".localize()}</th>
                                <th scope="col">{"Status".localize()}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((el, i) => {
                                return <ListItem user={el} quest={quest} index={i} />
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

const ListItem = ({ user, quest, index: i }: { user: ClientUserTypes.User, quest: ClientQuestTypes.Quest, index: number }) => {
    const onClick: MouseEventHandler = (e) => {
        const el = e.currentTarget.nextElementSibling?.classList
        if (!el || !e.currentTarget.classList.contains("has-submission")) return
        if (el.contains("td-hidden")) el.remove("td-hidden")
        else el.add("td-hidden")
    }
    const submission = quest?.submissions?.find(quest => quest.userId == user._id)
    let state = "-"
    if (submission)
        state = "?"

    return (<>
        <tr onClick={onClick} key={user._id} className={submission ? "has-submission pointer" : ""}>
            <td>{i + 1}</td>
            <td>{user.name}</td>
            <td>0/100</td>
            <td>{state}</td>
        </tr>
        <SubmissionDisplay submission={submission} user={user} index={i} questId={quest._id} />
    </>)
}

const SubmissionDisplay = ({ submission, user, index: i, questId }: { submission?: ClientQuestTypes.QuestSubmissions, user: ClientUserTypes.User, index: number, questId: string }) => {
    if (!submission) return (<></>)

    const onAccept = () => {
        submit({ action: "accept" })
    }
    const onDeny = () => {
        submit({ action: "deny" })
    }
    const onReturn = () => {
        submit({ action: "return" })
    }

    const submit = async (data: any) => {
        const url = ENDPOINTS.GRADE_QUEST_SUBMISSION.replace("{quest}", questId).replace("{user}", submission.userId)
        const resp = await axios.post(url, data)
    }

    return (
        <tr className="td-hidden no-border" key={user._id + i}>
            <td colSpan={4} className="no-border">
                <div>{submission.text}</div>
                <div className="text-center">
                    <button className="btn btn-success" onClick={onAccept}>{"Accept".localize()}</button>
                    <button className="btn btn-danger ms-1" onClick={onDeny}>{"Deny".localize()}</button>
                    <button className="btn btn-warning ms-1" onClick={onReturn}>{"Return".localize()}</button>
                </div>
            </td>
        </tr>
    )
}

const TeacherView = ({ groups, user }: teacherProps) => {
    const router = useRouter()
    const [group, setGroup] = useState(groups[0])
    const questsRef = useRef<HTMLSelectElement>(null)
    const tableRef = useRef<HTMLTableSectionElement>(null)

    useEffect(() => {
        (async () => {
            //Return if refs are for some reason null (should never happen)
            if (!questsRef.current) return
            if (!tableRef.current) return

            //Clear the refs
            while (questsRef.current.children.length)
                questsRef.current.removeChild(questsRef.current.children[0])
            while (tableRef.current.children.length)
                tableRef.current.removeChild(tableRef.current.children[0])

            //Fetch all groups
            const data: ClientQuestTypes.Quest[] = (await (await fetch(ENDPOINTS.QUESTS_BY_GROUP.replace("{id}", group._id), { method: "POST" })).json()).quests
            data.map(el => {
                const option = document.createElement("option")
                option.innerText = el.name
                option.value = el._id
                questsRef.current!.append(option)
            })

            //Fetch selected users for groups
            const users: ClientUserTypes.User[] = (await (await fetch(ENDPOINTS.USERS_BY_GROUP.replace("{id}", group._id), { method: "POST" })).json()).users
            users.map((user, i) => {
                const submission = data[0].submissions?.filter(el => el.userId == user._id)?.pop() || { text: "Unsubmited", files: [], originalNames: [], submitedAt: new Date(), userId: "" }
                if (submission) console.log(submission);

                const tr = document.createElement("tr")
                const count = document.createElement("td")
                const name = document.createElement("td")
                const points = document.createElement("td")
                const arrow = document.createElement("td")

                count.innerText = (i + 1).toString()
                count.className = "col"
                name.innerText = user.name
                name.className = "col"
                points.innerText = "0/100"
                points.className = "col"
                arrow.innerText = "v"
                arrow.className = "col pointer"

                tr.append(count, name, points, arrow)

                tableRef.current!.append(tr)

                const drop = document.createElement("tr")
                const content = document.createElement("th")
                const text = document.createElement("div")
                const filesWrapper = document.createElement("div")
                filesWrapper.className = "w-100 h-25"

                submission.files.map(el => {
                    const isImage = imageFormats.indexOf(el.split(".").pop() as string) !== -1
                    if (isImage) {
                        const img = document.createElement("img")
                        img.src = getStaticFilePath(submission.userId, el)
                        filesWrapper.append(img)
                    }//TODO: non image download
                })
                text.className = "w-100"
                text.innerText = submission.text
                content.colSpan = 4
                content.innerText = ""
                content.style.border = "none"
                drop.className = "td-hidden no-border"
                content.append(text)
                content.append(filesWrapper)
                drop.append(content)

                arrow.onclick = () => {
                    let visible = !drop.classList.contains("td-hidden")
                    if (visible) drop.classList.add("td-hidden")
                    else drop.classList.remove("td-hidden")
                }

                tableRef.current!.append(drop)
            })
        })()
    }, [group])

    return (
        <div className="d-flex">
            <SideNav user={user} />
            <div className="w-100 d-flex justify-content-center" style={{ backgroundColor: "white" }}>
                <div id={styles.select} className="w-75 border">
                    <select className="w-100">
                        {groups.map(el =>
                            <option key={el._id} value={el._id}>{el.name}</option>
                        )}
                    </select>
                    <select className="w-100" ref={questsRef}> </select>
                    <table className={"table mt-3 w-100 " + styles.table}>
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">{"Name".localize()}</th>
                                <th scope="col">{"Points".localize()}</th>
                                <th scope="col float-end"></th>
                            </tr>
                        </thead>
                        <tbody ref={tableRef}>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )

}

const StudentView = ({ quests, user }: baseProps) => {
    const router = useRouter()
    return (
        <div className="d-flex">
            <SideNav user={user} />
            <div className="content flex-shrink-0 p-3 d-inline-block" style={{ overflowY: "auto" }}>
                {quests.map(el => <div key={el._id} className="mx-2 my-1 float-start" onClick={() => router.push(`/quest/${el._id}`)}><QuestCard quest={el}></QuestCard></div>)}
            </div>
        </div>
    )
}

export async function getServerSideProps(props: NextPageContext) {
    const { req, res } = props
    if (!req || !res) { console.log("weird stuff in login, getServerSideProps"); return { props: {} } }
    const cookies = Cookie.parse(req)
    if (!cookies.session) return { props: {} }

    const [backendUser, frontendUser] = await getUserData(cookies.session)
    if (backendUser.permissions.admin || backendUser.permissions.teacher)
        return getTeacherServersideProps(props, backendUser, frontendUser)
    else return getStudentServersideProps(props, backendUser, frontendUser)
}

const getTeacherServersideProps = async ({ req, res }: NextPageContext, backendUser: ServerUserTypes.User, frontendUser: ClientUserTypes.User) => {
    const groups = (await Groups.getUserGroups(backendUser)).map(el => ({ _id: el._id.toString(), name: el.name }))
    return { props: { user: frontendUser, groups } }
}

const getStudentServersideProps = async ({ req, res }: NextPageContext, backendUser: ServerUserTypes.User, frontendUser: ClientUserTypes.User) => {
    const [backendQuests, frontendQuests] = await getQuests(backendUser)

    return { props: { user: frontendUser, quests: frontendQuests } }
}

export default Quests
