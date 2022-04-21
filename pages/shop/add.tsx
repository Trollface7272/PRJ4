import Groups from "@database/groups"
import { ClientGroupTypes } from "@database/types/groups"
import { ClientUserTypes } from "@database/types/users"
import axios from "axios"
import SideNav from "components/SideNav"
import { NextPageContext } from "next"
import { useRouter } from "next/router"
import { ChangeEventHandler, KeyboardEventHandler, MouseEventHandler, useState } from "react"
import { Cookie } from "utils/cookies"
import { ENDPOINTS } from "utils/requests"
import { getUserData } from "utils/serverUtils"
import styles from "../../styles/Quests.module.css"




const AddItem = ({ user, groups }: { user: ClientUserTypes.User, groups: ClientGroupTypes.Group[] }) => {
    const router = useRouter()
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [selectedGroups, setGroups] = useState([] as string[])
    const [level, setLevel] = useState(0)
    const [stock, setStock] = useState(0)
    const [price, setPrice] = useState(0)

    const nameChange: KeyboardEventHandler<HTMLInputElement> = (e) => setName(e.currentTarget.value)
    const descChange: KeyboardEventHandler<HTMLInputElement> = (e) => setDescription(e.currentTarget.value)
    const groupsChange: ChangeEventHandler<HTMLSelectElement> = (e) => setGroups(Array.from(e.currentTarget.options).filter(e => e.selected).map(e => e.value))
    const levelChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        let level = parseInt(e.currentTarget.value)
        if (isNaN(level) || level < 0) level = 0
        e.currentTarget.value = level.toString()
        setLevel(level)
    }
    const stockChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        let stock = parseInt(e.currentTarget.value)
        if (isNaN(stock) || stock < 0) stock = 0
        e.currentTarget.value = stock.toString()
        setStock(stock)
    }
    const costChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        let price = parseInt(e.currentTarget.value)
        if (isNaN(price) || price < 0) price = 0
        e.currentTarget.value = price.toString()
        setPrice(price)
    }

    const onSubmit: MouseEventHandler = (e) => {
        e.preventDefault()
        if (name.length === 0) return alert("Item name cannot be empty")
        if (description.length === 0) return alert("Item description cannot be empty")
        if (selectedGroups.length === 0) return alert("Item must be assigned to at least one group")

        const data = {
            name,
            description,
            groups: selectedGroups,
            level,
            stock,
            price
        }
        axios.post(ENDPOINTS.ADD_SHOP_ITEM, data).then(res => {
            if (res.status === 200) {
                router.push("/shop")
            } else {
                alert("Failed to add quest")
            }
        })
    }

    return (
        <div className="d-flex">
            <SideNav user={user} />
            <div className="w-100 d-flex justify-content-center" style={{ backgroundColor: "white" }}>
                <div id={styles.select} className="w-75 border">
                    <div>
                        <label htmlFor="nameInput">{"Item Name".localize()}</label>
                        <input type="text" id="nameInput" className="form-control" onInput={nameChange} />
                    </div>
                    <div>
                        <label htmlFor="descInput">{"Item Description".localize()}</label>
                        <input type="text" id="descInput" className="form-control" onInput={descChange} />
                    </div>
                    <div>
                        <label htmlFor="groupsSelect">{"Groups".localize()}</label>
                        <select multiple id="groupsSelect" className="form-control" onChange={groupsChange}>
                            {groups.map(el => <option key={el._id} value={el._id}>{el.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="lvlInput">{"Required Level".localize()}</label>
                        <input type="number" id="lvlInput" className="form-control" min="0" onChange={levelChange} />
                    </div>
                    <div>
                        <label htmlFor="stockInput">{"Stock".localize()}</label>
                        <input type="number" id="stockInput" className="form-control" min="0" onChange={stockChange} />
                    </div>
                    <div>
                        <label htmlFor="costInput">{"Cost".localize()}</label>
                        <input type="number" id="costInput" className="form-control" min="0" onChange={costChange} />
                    </div>
                    <br />
                    <div>
                        <button className="btn btn-primary form-control" onClick={onSubmit}>{"Submit Item".localize()}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(props: NextPageContext) {
    const { req, res } = props
    if (!req || !res) { console.log("weird stuff in add, getServerSideProps"); return { props: {} } }
    const cookies = Cookie.parse(req)
    if (!cookies.session) return { props: {} }
    const [backendUser, frontendUser] = await getUserData(cookies.session)
    const groups = backendUser.permissions.admin ?
        (await Groups.getAll()).filter(e => !e.admin && !e.teacher).map(el => ({ _id: el._id.toString(), name: el.name })) :
        (await Groups.getUserGroups(backendUser)).filter(e => !e.admin && !e.teacher).map(el => ({ _id: el._id.toString(), name: el.name }))

    return { props: { user: frontendUser, groups: groups } }
}

export default AddItem