import { ClientUserTypes } from "@database/types/users"
import { NextPageContext } from "next"
import { useRouter } from "next/router"
import { Cookie } from "utils/cookies"
import { getQuests, getUserData } from "utils/serverUtils"
import QuestCard from "../components/QuestCard"
import SideNav from "../components/SideNav"
import { ClientQuestTypes } from "@database/types/quests"
import styles from "../styles/Quests.module.css"

interface props {
    user: ClientUserTypes.User
    quests: ClientQuestTypes.Quest[]
}

const Quests = ({ quests, user }: props) => {
    

    if (user.permissions.teacher || user.permissions.admin) return TeacherView({ quests, user })
    else return StudentView({ quests, user })


}

const TeacherView = ({ quests, user }: props) => {
    const router = useRouter()

    return (
        <div className="d-flex">
            <SideNav user={user} />
            <div className="w-100" style={{backgroundColor: "white"}}>
                <div id={styles.select} className="w-75 border h-25 flex-shrink-1">

                </div>
            </div>
        </div>
    )

}

const StudentView = ({ quests, user }: props) => {
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

export async function getServerSideProps({ req, res }: NextPageContext) {
    if (!req || !res) { console.log("weird stuff in login, getServerSideProps"); return { props: {} } }
    const cookies = Cookie.parse(req)
    if (!cookies.session) return { props: {} }
    const [backendUser, frontendUser] = await getUserData(cookies.session)
    const [backendQuests, frontendQuests] = await getQuests(backendUser)

    return { props: { user: frontendUser, quests: frontendQuests } }
}

export default Quests
