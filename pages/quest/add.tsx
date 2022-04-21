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




const AddQuest = ({ user, groups }: { user: ClientUserTypes.User, groups: ClientGroupTypes.Group[] }) => {
    const router = useRouter()
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [selectedGroups, setGroups] = useState([] as string[])
    const [level, setLevel] = useState(0)
    const [xp, setXp] = useState(0)
    const [coins, setCoins] = useState(0)

    const nameChange: KeyboardEventHandler<HTMLInputElement> =  (e) => setName(e.currentTarget.value)
    const descChange: KeyboardEventHandler<HTMLInputElement> =  (e) => setDescription(e.currentTarget.value)
    const groupsChange: ChangeEventHandler<HTMLSelectElement> = (e) => setGroups(Array.from(e.currentTarget.options).filter(e => e.selected).map(e => e.value))
    const levelChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        let level = parseInt(e.currentTarget.value)
        if (isNaN(level) || level < 0) level = 0
        e.currentTarget.value = level.toString()
        setLevel(level)
    }
    const xpChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        let xp = parseInt(e.currentTarget.value)
        if (isNaN(xp) || xp < 0) xp = 0
        e.currentTarget.value = xp.toString()
        setXp(xp)
    }
    const coinsChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        let coins = parseInt(e.currentTarget.value)
        if (isNaN(coins) || coins < 0) coins = 0
        e.currentTarget.value = coins.toString()
        setCoins(coins)
    }

    const onSubmit: MouseEventHandler = (e) => {
        e.preventDefault()
        if (name.length === 0) return alert("Quest name cannot be empty")
        if (description.length === 0) return alert("Quest description cannot be empty")
        if (selectedGroups.length === 0) return alert("Quest must be assigned to at least one group")

        const data = {
            name,
            description,
            groups: selectedGroups,
            level,
            xp,
            coins
        }
        axios.post(ENDPOINTS.ADD_QUEST, data).then(res => {
            if (res.status === 200) {
                router.push("/quests")
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
                        <label htmlFor="nameInput">{"Quest Name".localize()}</label>
                        <input type="text" id="nameInput" className="form-control" onInput={nameChange} />
                    </div>
                    <div>
                        <label htmlFor="descInput">{"Quest Description".localize()}</label>
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
                        <label htmlFor="xpInput">{"Xp Reward".localize()}</label>
                        <input type="number" id="xpInput" className="form-control" min="0" onChange={xpChange} />
                    </div>
                    <div>
                        <label htmlFor="coinsInput">{"Coins Reward".localize()}</label>
                        <input type="number" id="coinsInput" className="form-control" min="0" onChange={coinsChange} />
                    </div>
                    <br />
                    <div>
                        <button className="btn btn-primary form-control" onClick={onSubmit}>{"Submit Quest".localize()}</button>
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

export default AddQuest