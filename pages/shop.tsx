import SideNav from "../components/SideNav"
import ShopCard from "../components/ShopCard"
import { ClientShopTypes } from "@database/types/shop"
import { ClientUserTypes } from "@database/types/users"
import { NextPageContext } from "next"
import { Cookie } from "utils/cookies"
import styles from "../styles/Quests.module.css"
import { getShopItems, getUserData } from "utils/serverUtils"
import { useState } from "react"
import useSWR from "swr"
import axios from "axios"
import { ENDPOINTS } from "utils/requests"

interface BaseProps {
    user: ClientUserTypes.User
}

interface StudentProps extends BaseProps {
    items: ClientShopTypes.Item[]
}

interface TeacherProps extends BaseProps {
    groups: { _id: string, name: string }[]
}

const Shop = (props: StudentProps|TeacherProps) => {
    if (props.user.permissions.teacher || props.user.permissions.admin) return TeacherView(props as TeacherProps)
    else return StudentView(props as StudentProps)
}

const fetcher = (url: string) => axios.post(url).then(res => res.data)

const TeacherView = ({user, groups}: TeacherProps) => {
    const [activeGroup, setActiveGroup] = useState(0)
    const [activeQuest, setActiveQuest] = useState(0)
    const group = groups[activeGroup]
    const { data: rShopItems } = useSWR<{ items: ClientShopTypes.Item[] }>(ENDPOINTS.SHOP_ITEMS_BY_GROUP.replace("{id}", group._id), fetcher)

    const items = rShopItems?.items || []
    const quest = items[activeQuest]
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
                        {items.map((el, i) =>
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
                                return <ListItem user={el} quest={quest} index={i} key={el._id} />
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
const StudentView = ({items, user}: StudentProps) => {

    return (
        <div className="d-flex">
            <SideNav user={user} />
            <div className="content flex-shrink-0 p-3 d-inline-block" style={{overflowY: "auto"}}>
            {items.map(el => <div key={el._id} className="mx-2 my-1 float-start"><ShopCard item={el}></ShopCard></div>)}
            </div>
        </div>
    )
}

export async function getServerSideProps({ req, res }: NextPageContext) {
    if (!req || !res) { console.log("weird stuff in login, getServerSideProps"); return { props: {} } }
    const cookies = Cookie.parse(req)
    if (!cookies.session) return { props: {} }
    const [backendUser, frontendUser] = await getUserData(cookies.session)
    const [backendItems, frontendItems] = await getShopItems(backendUser)

    return { props: { user: frontendUser, items: frontendItems } }
}

export default Shop
