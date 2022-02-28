import { randomUUID } from "crypto"
import { connection, Types } from "mongoose"
import { ServerUserTypes } from "./types/users"

class Users {
    private static userCluster = () => connection.collection("users")
    private static hashPassword(password: string) {
        //TODO: implement hashing
        return password
    }
    public static async isSessionValid(session: string) {
        return !!(await this.userCluster().findOne({ sessions: { $all: [session] } }))
    }
    public static async fromSession(session: string) {
        return this.userCluster().findOne<ServerUserTypes.User>({ sessions: { $all: [session] } })
    }
    public static async fromId(id: Types.ObjectId) {
        return this.userCluster().findOne({ _id: id })
    }
    public static async login(username: string, password: string) {
        password = this.hashPassword(password)

        //Find user
        const usernameRegex = new RegExp(`^${username}$`, "i")
        const user = await this.userCluster().findOne({ username: usernameRegex, password })
        

        if (!user) return { success: false, cookie: null }

        //Generate session cookie
        let cookie = randomUUID()
        while (await this.userCluster().findOne({ sessions: { $all: [cookie] } })) cookie = randomUUID()
        await this.userCluster().updateOne({ username: usernameRegex, password }, { $push: { sessions: cookie } })

        return { success: true, cookie }
    }
    public static async logout(session: string) {
        this.userCluster().updateOne({ sessions: { $all: [session] } }, { $pull: { sessions: session } })
    }
}

export default Users