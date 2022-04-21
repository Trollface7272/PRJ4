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
import React, { Dispatch, MouseEventHandler, SetStateAction, useEffect, useState } from "react"
import { ENDPOINTS } from "utils/requests"
import axios from "axios"
import Link from "next/link"
import { imageFormats, readFile } from "utils/clientUtils"

interface baseProps {
    user: ClientUserTypes.User
    quests: ClientQuestTypes.Quest[]
}

interface studentProps extends baseProps { }

interface teacherProps extends baseProps {
    groups: { _id: string, name: string }[]
}

const Quests = (props: studentProps | teacherProps) => {
    if (props.user.permissions.teacher || props.user.permissions.admin) return TeacherView(props as teacherProps)
    else return StudentView(props as studentProps)


}
const fetcher = (url: string) => axios.post(url).then(res => res.data)

const TeacherView = ({ groups, user }: teacherProps) => {
    const [activeGroup, setActiveGroup] = useState(0)
    const [activeQuest, setActiveQuest] = useState(0)
    const group = groups[activeGroup]
    const router = useRouter()

    const { data: rQuests } = useSWR<{ quests: ClientQuestTypes.Quest[] }>(ENDPOINTS.QUESTS_BY_GROUP.replace("{id}", group?._id), fetcher)
    const { data: rUsers } = useSWR<{ users: ClientUserTypes.User[] }>(ENDPOINTS.USERS_BY_GROUP.replace("{id}", group?._id), fetcher)

    const quests = rQuests?.quests || []
    const users = rUsers?.users?.filter(e => !e.permissions.admin && !e.permissions.teacher) || []
    const quest = quests[activeQuest]
    console.log(users);


    return (
        <div className="d-flex">
            <SideNav user={user} />
            <div className="w-100 d-flex justify-content-center" style={{ backgroundColor: "white" }}>
                <div id={styles.select} className="w-75 border">
                    <button className="btn btn-primary my-2 w-100" onClick={() => router.push("/quest/add")}>{"Add Quest".localize()}</button>
                    <select className="w-100 my-2" onChange={(e) => setActiveGroup(parseInt(e.target.value))}>
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
                                <th scope="col">{"Xp".localize()}</th>
                                <th scope="col">{"Coins".localize()}</th>
                                <th scope="col">{"Points".localize()}</th>
                                <th scope="col">{"Status".localize()}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quest ? users.map((el, i) => {
                                return <ListItem user={el} quest={quest} index={i} key={el._id} />
                            }) : ""}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

const ListItem = ({ user, quest, index: i }: { user: ClientUserTypes.User, quest: ClientQuestTypes.Quest, index: number }) => {
    const [state, setState] = useState("❓")
    const [points, setPoints] = useState(0)
    const onClick: MouseEventHandler = (e) => {
        const el = e.currentTarget.nextElementSibling?.classList
        if (!el || !e.currentTarget.classList.contains("has-submission")) return
        if (el.contains("td-hidden")) el.remove("td-hidden")
        else el.add("td-hidden")
    }

    const submission = quest.submissions?.find(quest => quest.userId == user._id)

    useEffect(() => {
        if (!submission) {
            setState("❓")
            setPoints(0)
            return
        }
        setPoints(submission.type === "graded" ? submission.points || 0 : 0)

        switch (submission.type) {
            case "graded":
                setState("✅")
                break
            case "failed":
                setState("❌")
                break
            case "not-submitted":
            case "returned":
                setState("❓")
                break
            case "submitted":
                setState("⏳")
                break
        }
    }, [submission, quest])
    if (!quest) return <></>
    return (<>
        <tr onClick={onClick} key={user._id} className={submission ? "has-submission pointer" : ""}>
            <td>{i + 1}</td>
            <td>{user.name}</td>
            <td>{submission?.type == "graded" ? Math.round(quest.rewards.xp * (points/100)) : quest.rewards.xp}</td>
            <td>{submission?.type == "graded" ? Math.round(quest.rewards.coins * (points/100)) : quest.rewards.coins}</td>
            <td>{points}/100</td>
            <td>{state}</td>
        </tr>
        <SubmissionDisplay submission={submission} user={user} index={i} state={state} questId={quest._id} changeSubmission={setState} changePoints={setPoints} />
    </>)
}

const SubmissionDisplay = ({ submission, user, index: i, questId, changeSubmission, changePoints, state }: { submission?: ClientQuestTypes.QuestSubmissions, user: ClientUserTypes.User, index: number, questId: string, changeSubmission: Dispatch<SetStateAction<string>>, changePoints: Dispatch<SetStateAction<number>>, state: string }) => {
    const [points, setPoints] = useState<string | number>(submission?.points || 0)
    if (!submission) return (<></>)

    const onAccept = async () => {
        await submit({ action: "graded", points })
        changeSubmission("✅")
        changePoints(typeof points == "number" ? points : 0)
        submission.type = "graded"
    }
    const onDeny = async () => {
        await submit({ action: "failed", points: 0 })
        changeSubmission("❌")
        changePoints(0)
        submission.type = "failed"
    }
    const onReturn = async () => {
        await submit({ action: "returned", points: 0 })
        changeSubmission("⏳")
        changePoints(0)
        submission.type = "returned"
    }

    const submit = async (data: any) => {
        const url = ENDPOINTS.GRADE_QUEST_SUBMISSION.replace("{quest}", questId).replace("{user}", submission.userId)
        const resp = await axios.post(url, data).catch(err => console.log(err.response))
        if (!resp?.data?.success) return
    }

    const onPointsChange = (e: React.FormEvent<HTMLInputElement>) => {
        if (e.currentTarget.value == "") return setPoints("")
        let val = parseInt(e.currentTarget.value)
        if (val > 100) val = 100
        else if (val < 0) val = 0
        setPoints(val)
    }

    return (
        <tr className="td-hidden no-border" key={user._id + i}>
            <td colSpan={6} className="no-border">
                <div>{submission.text}</div>
                <hr />
                <div className="images" style={{ overflowX: "auto" }}>
                    {submission.files.map((el, i) =>
                        <FileDisplay url={el} key={el} />
                    )}
                </div>
                {submission.type !== "failed" && submission.type !== "graded" && submission.type !== "returned" && state !== "✅" && state !== "❌" ? <div className="text-center">
                    <input type="number" placeholder="0-100" min={0} max={100} value={points} onChange={onPointsChange} />
                    <br />
                    <button className="btn btn-success" onClick={onAccept}>{"Accept".localize()}</button>
                    <button className="btn btn-danger ms-1" onClick={onDeny}>{"Deny".localize()}</button>
                    <button className="btn btn-warning ms-1" onClick={onReturn}>{"Return".localize()}</button>
                </div> : ""}
            </td>
        </tr>
    )
}

const FileDisplay = ({ url }: { url: string }) => {
    const extension = url.split(".").pop() || ""
    if (imageFormats.includes(extension)) return (
        <Link key={url} passHref href={url.replaceAll("\\", "/")}>
            <a target="_blank" rel="noopener noreferrer">
                <img src={url} style={{ maxWidth: "200px" }} />
            </a>
        </Link>
    )

    return (
        <Link key={url} passHref href={url.replaceAll("\\", "/")}>
            <a target="_blank" rel="noopener noreferrer">
            <button style={{maxWidth: "200px"}} className="btn btn-primary" key={url}>{"Download".localize()} {url.split("\\").pop()}</button>
            </a>
        </Link>
        
    )
}

const InputDisplay = ({ inputVisible, questId }: { inputVisible: boolean, questId: string }) => {
    const [text, setText] = useState("")
    const [files, setFiles] = useState<File[]>([])
    const router = useRouter()

    const onSubmit: MouseEventHandler = async (e) => {
        e.preventDefault()
        const data = []
        for (const file of files) {
            data.push({
                name: file.name,
                type: file.type,
                data: await readFile(file)
            })
        }
        const url = ENDPOINTS.SUBMIT_QUEST.replace("{quest}", questId)
        const resp = await axios.post(url, { text, files: data }).catch(err => console.log(err.response))
        if (!resp?.data?.success) return
        router.reload()
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files
        if (!files) return
        setFiles(Array.from(files))
    }
    return (
        <>
            <tr className={(inputVisible ? "" : "td-hidden ") + "no-border"} key={questId + 1}>
                <td colSpan={6} className="no-border">
                    <textarea placeholder="Text" className="w-100" style={{ resize: "none", height: "100px" }} onInput={(e) => setText(e.currentTarget.value)} value={text} />
                    <input type="file" multiple onChange={onFileChange} />
                    <div className="text-center">
                        <button className="btn btn-success" onClick={onSubmit}>{"Submit".localize()}</button>
                    </div>
                </td>
            </tr>
        </>
    )
}

const ListQuest = ({ quest, index: i }: { quest: ClientQuestTypes.Quest, index: number }) => {
    const submission = quest.submissions ? quest.submissions[0] : undefined

    const [state, setState] = useState("❓")
    const [points, setPoints] = useState(submission?.points || 0)
    const [inputVisible, setInputVisible] = useState(false)

    useEffect(() => {
        if (!submission) {
            setState("❓")
            setPoints(0)
            return
        }
        setPoints(submission.type === "graded" ? submission.points || 0 : 0)

        switch (submission.type) {
            case "graded":
                setState("✅")
                break
            case "failed":
                setState("❌")
                break
            case "not-submitted":
            case "returned":
                setState("❓")
                break
            case "submitted":
                setState("⏳")
                break
        }
    }, [quest])

    const onClick: MouseEventHandler = (e) => {
        if (submission && submission.type !== "returned") return
        setInputVisible(!inputVisible)
    }

    return <>
        <tr onClick={onClick} key={quest._id} className={!quest.submissions ? "has-submission pointer" : ""}>
            <td>{i + 1}</td>
            <td>{quest.name}</td>
            <td>{submission?.type == "graded" ? Math.round(quest.rewards.xp * (points/100)) : quest.rewards.xp}</td>
            <td>{submission?.type == "graded" ? Math.round(quest.rewards.coins * (points/100)) : quest.rewards.coins}</td>
            <td>{points}/100</td>
            <td>{state}</td>
        </tr>
        <InputDisplay inputVisible={inputVisible} questId={quest._id} />
    </>
}

const StudentView = ({ quests, user }: baseProps) => {
    return (
        <div className="d-flex">
            <SideNav user={user} />
            <div className="w-100 d-flex justify-content-center" style={{ backgroundColor: "white" }}>
                <div id={styles.select} className="w-75 border">
                    <table className={"table mt-3 w-100 " + styles.table}>
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">{"Name".localize()}</th>
                                <th scope="col">{"Xp".localize()}</th>
                                <th scope="col">{"Coins".localize()}</th>
                                <th scope="col">{"Points".localize()}</th>
                                <th scope="col">{"Status".localize()}</th>
                            </tr>
                        </thead>
                        <tbody style={{ overflowY: "auto" }}>
                            {quests.map((el, i) => {
                                return <ListQuest quest={el} index={i} key={el._id} />
                            })}
                        </tbody>
                    </table>
                </div>
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
    if (backendUser.permissions.admin)
        return getAdminServersideProps(props, backendUser, frontendUser)
    else if (backendUser.permissions.teacher)
        return getTeacherServersideProps(props, backendUser, frontendUser)
    else return getStudentServersideProps(props, backendUser, frontendUser)
}

const getAdminServersideProps = async ({ req, res }: NextPageContext, backendUser: ServerUserTypes.User, frontendUser: ClientUserTypes.User) => {
    const groups = (await Groups.getAll()).filter(e => !e.admin && !e.teacher).map(el => ({ _id: el._id.toString(), name: el.name }))
    console.log(groups);

    return { props: { user: frontendUser, groups } }
}

const getTeacherServersideProps = async ({ req, res }: NextPageContext, backendUser: ServerUserTypes.User, frontendUser: ClientUserTypes.User) => {
    const groups = (await Groups.getUserGroups(backendUser)).filter(e => !e.admin && !e.teacher).map(el => ({ _id: el._id.toString(), name: el.name }))
    console.log(groups);

    return { props: { user: frontendUser, groups } }
}

const getStudentServersideProps = async ({ req, res }: NextPageContext, backendUser: ServerUserTypes.User, frontendUser: ClientUserTypes.User) => {
    const [backendQuests, frontendQuests] = await getQuests(backendUser)
    for (let i = 0; i < frontendQuests.length; i++) {
        const el = frontendQuests[i];
        const submission = el.submissions?.find(el => el.userId === frontendUser._id)
        if (submission) el.submissions = [submission]
        else delete el.submissions
    }

    return { props: { user: frontendUser, quests: frontendQuests } }
}

export default Quests
