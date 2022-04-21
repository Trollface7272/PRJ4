import SideNav from "../components/SideNav"
import ShopCard from "../components/ShopCard"
import { ClientShopTypes } from "@database/types/shop"
import { ClientUserTypes, ServerUserTypes } from "@database/types/users"
import { NextPageContext } from "next"
import { Cookie } from "utils/cookies"
import styles from "../styles/Quests.module.css"
import { getShopItems, getUserData } from "utils/serverUtils"
import { MouseEventHandler, useState } from "react"
import useSWR from "swr"
import axios from "axios"
import { ENDPOINTS } from "utils/requests"
import Groups from "@database/groups"
import { useRouter } from "next/router"

interface BaseProps {
    user: ClientUserTypes.User
}

interface StudentProps extends BaseProps {
    items: ClientShopTypes.Item[]
}

interface TeacherProps extends BaseProps {
    groups: { _id: string, name: string }[]
}

const Shop = (props: StudentProps | TeacherProps) => {
    if (props.user.permissions.teacher || props.user.permissions.admin) return TeacherView(props as TeacherProps)
    else return StudentView(props as StudentProps)
}

const fetcher = (url: string) => axios.post(url).then(res => res.data)

const DisplayPurchases = ({ purchases, visible, itemId }: { purchases: ClientShopTypes.Purchase[], visible: boolean, itemId: string }) => {
    if (purchases.length === 0) return <></>

    return (
        <tr className={(visible ? "" : "td-hidden ") + "no-border"} key={itemId + 1}>
            <td colSpan={6} className="no-border">
                <table className={"table mt-3 w-100 border " + styles.table}>
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.map((purchase, i) => (
                            <tr key={i}>
                                <td scope="col">{i + 1}</td>
                                <td scope="col">{purchase.name}</td>
                                <td scope="col">{new Date(purchase.date).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </td>
        </tr>
    )
}

const ListItem = ({ item, index: i }: { item: ClientShopTypes.Item, index: number }) => {
    const [visible, setVisible] = useState(false)
    const onClick: MouseEventHandler = (e) => {
        e.preventDefault()
        setVisible(!visible)
    }
    return (
        <>
            <tr onClick={onClick} key={item._id} className={item.purchases.length > 0 ? "has-submission pointer" : ""}>
                <td>{i + 1}</td>
                <td>{item.name}</td>
                <td>{item.cost}</td>
                <td>{item.requirements?.level || 0}</td>
                <td>{item.stock}</td>
                <td>{item.purchases.length}</td>
            </tr>
            <DisplayPurchases purchases={item.purchases} visible={visible} itemId={item._id} />
        </>
    )
}

const TeacherView = ({ user, groups }: TeacherProps) => {
    const router = useRouter()
    const [activeGroup, setActiveGroup] = useState(0)
    const group = groups[activeGroup]
    const { data: rShopItems } = useSWR<{ items: ClientShopTypes.Item[] }>(ENDPOINTS.SHOP_ITEMS_BY_GROUP.replace("{id}", group._id), fetcher)

    const items = rShopItems?.items || []
    return (
        <div className="d-flex">
            <SideNav user={user} />
            <div className="w-100 d-flex justify-content-center" style={{ backgroundColor: "white" }}>
                <div id={styles.select} className="w-75 border">
                <button className="btn btn-primary my-2 w-100" onClick={() => router.push("/shop/add")}>{"Add Item".localize()}</button>
                    <select className="w-100" onChange={(e) => setActiveGroup(parseInt(e.target.value))}>
                        {groups.map((el, i) =>
                            <option key={el._id} value={i}>{el.name}</option>
                        )}
                    </select>
                    <table className={"table mt-3 w-100 " + styles.table}>
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">{"Name".localize()}</th>
                                <th scope="col">{"Price".localize()}</th>
                                <th scope="col">{"Required Level".localize()}</th>
                                <th scope="col">{"Stock".localize()}</th>
                                <th scope="col">{"Purchases".localize()}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((el, i) => {
                                return <ListItem item={el} index={i} key={el._id} />
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

const StudentListItem = ({ item, index: i, user }: { item: ClientShopTypes.Item, index: number, user: ClientUserTypes.User }) => {
    const onPurchase: MouseEventHandler = async (e) => {
        e.preventDefault()
        if (item.stock <= 0 || user.coins < item.cost) return //MAybe notify not enough moners

        const resp = await axios.post(ENDPOINTS.SHOP_PURCHASE.replace("{item}", item._id)).catch(err => console.log(err))
        if (resp?.data?.success) {
            window.location.reload()
        }
    }

    return (
        <tr key={item._id}>
            <td>{i + 1}</td>
            <td>{item.name}</td>
            <td>{item.cost}</td>
            <td>{item.requirements?.level || 0}</td>
            <td>{item.stock}</td>
            <td><button className="btn btn-primary" onClick={onPurchase}>{"Purchase".localize()}</button></td>
        </tr>)
}

const StudentView = ({ items, user }: StudentProps) => {

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
                                <th scope="col">{"Cost".localize()}</th>
                                <th scope="col">{"Required Level".localize()}</th>
                                <th scope="col">{"Stock".localize()}</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((el, i) => {
                                return <StudentListItem user={user} item={el} index={i} key={el._id} />
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps({ req, res }: NextPageContext) {
    if (!req || !res) { console.log("weird stuff in login, getServerSideProps"); return { props: {} } }
    const cookies = Cookie.parse(req)
    if (!cookies.session) return { props: {} }
    const [backendUser, frontendUser] = await getUserData(cookies.session)

    if (backendUser.permissions.admin) return getAdminProps(backendUser, frontendUser)
    else if (backendUser.permissions.teacher) return getTeacherProps(backendUser, frontendUser)
    else return getStudentProps(backendUser, frontendUser)
}

const getTeacherProps = async (backendUser: ServerUserTypes.User, frontendUser: ClientUserTypes.User) => {
    const groups = (await Groups.getUserGroups(backendUser)).filter(e => !e.admin && !e.teacher).map(el => ({ _id: el._id.toString(), name: el.name }))
    return { props: { user: frontendUser, groups } }
}

const getAdminProps = async (backendUser: ServerUserTypes.User, frontendUser: ClientUserTypes.User) => {
    const groups = (await Groups.getAll()).filter(e => !e.admin && !e.teacher).map(el => ({ _id: el._id.toString(), name: el.name }))
    return { props: { user: frontendUser, groups } }
}

const getStudentProps = async (backendUser: ServerUserTypes.User, frontendUser: ClientUserTypes.User) => {
    const [backendItems, frontendItems] = await getShopItems(backendUser)

    return { props: { user: frontendUser, items: frontendItems } }
}

export default Shop
