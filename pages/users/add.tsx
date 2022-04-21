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




const AddUser = ({ user, groups }: { user: ClientUserTypes.User, groups: ClientGroupTypes.Group[] }) => {
    const router = useRouter()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [selectedGroups, setGroups] = useState([] as string[])
    
    const nameChange: KeyboardEventHandler<HTMLInputElement> = (e) => setName(e.currentTarget.value)
    const usernameChange: KeyboardEventHandler<HTMLInputElement> = (e) => setUsername(e.currentTarget.value)
    const passwordChange: KeyboardEventHandler<HTMLInputElement> = (e) => setPassword(e.currentTarget.value)
    const groupsChange: ChangeEventHandler<HTMLSelectElement> = (e) => setGroups(Array.from(e.currentTarget.options).filter(e => e.selected).map(e => e.value))


    const onSubmit: MouseEventHandler = (e) => {
        e.preventDefault()
        if (name.length === 0) return alert("Name cannot be empty")
        if (password.length === 0) return alert("Password cannot be empty")
        if (selectedGroups.length === 0) return alert("User must be assigned to at least one group")

        let uName = username
        if (username.length === 0) uName = name.split(" ").map(e => e.toLowerCase().slice(0, 3)).join("") + Math.floor(Math.random() * 10000).toString()

        const data = {
            name,
            password,
            username: uName,
            groups: selectedGroups,
        }

        axios.post(ENDPOINTS.ADD_USER, data)
            .then(() => router.reload())
            .catch(err => alert(err.response.data.message))
    }
        

    return (
        <div className="d-flex">
            <SideNav user={user} />
            <div className="w-100 d-flex justify-content-center" style={{ backgroundColor: "white" }}>
                <div id={styles.select} className="w-75 border">
                    <div>
                        <label htmlFor="nameInput">{"Name".localize()}</label>
                        <input type="text" id="nameInput" className="form-control" onInput={nameChange} />
                    </div>
                    <div>
                        <label htmlFor="usernameInput">{"Username".localize()}</label>
                        <input placeholder={"Leave empty to generate a random one".localize()} type="text" id="usernameInput" className="form-control" onInput={usernameChange} />
                    </div>
                    <div>
                        <label htmlFor="passwordInput">{"Password".localize()}</label>
                        <input type="password" id="passwordInput" className="form-control" onInput={passwordChange} />
                    </div>
                    <div>
                        <label htmlFor="groupsSelect">{"Groups".localize()}</label>
                        <select multiple id="groupsSelect" className="form-control" onChange={groupsChange}>
                            {groups.map(el => <option key={el._id} value={el._id}>{el.name}</option>)}
                        </select>
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

export default AddUser