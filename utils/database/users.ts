import { randomUUID } from "crypto"
import { connection, Types } from "mongoose"
import { Connect, Groups } from "."
import { ServerUserTypes } from "./types/users"

class Users {
    private static userCluster = async () => {await Connect(); return connection.collection("users")}
    private static hashPassword(password: string) {
        //TODO: implement hashing
        return password
    }
    public static async isSessionValid(session: string) {
        const cluster = await this.userCluster()
        return !!(await cluster.findOne({ sessions: { $all: [session] } }))
    }
    public static async fromSession(session: string) {
        const cluster = await this.userCluster()
        const user = await cluster.findOne<ServerUserTypes.User>({ sessions: { $all: [session] } })
        if (!user) return
        const permissions = await Groups.getPermissions(user)
        if (!permissions) return
        user.permissions = permissions
        return user
    }
    public static async fromId(id: Types.ObjectId) {
        const cluster = await this.userCluster()
        const user = await cluster.findOne<ServerUserTypes.User>({ _id: id })
        if (!user) return
        const permissions = await Groups.getPermissions(user)
        if (!permissions) return
        user.permissions = permissions
        return user
    }
    public static async login(username: string, password: string) {
        const cluster = await this.userCluster()
        password = this.hashPassword(password)

        //Find user
        const usernameRegex = new RegExp(`^${username}$`, "i")
        const user = await cluster.findOne({ username: usernameRegex, password })
        

        if (!user) return { success: false, cookie: null }

        //Generate session cookie
        let cookie = randomUUID()
        while (await cluster.findOne({ sessions: { $all: [cookie] } })) cookie = randomUUID()
        await cluster.updateOne({ username: usernameRegex, password }, { $push: { sessions: cookie } })

        return { success: true, cookie }
    }
    public static async logout(session: string) {
        const cluster = await this.userCluster()
        await cluster.updateOne({ sessions: { $all: [session] } }, { $pull: { sessions: session } })
    }
    public static async getUserNames(): Promise<{id: Types.ObjectId, name: string}[]> {
        const cluster = await this.userCluster()
        const cursor = cluster.find<ServerUserTypes.User>({})
        const out: {id: Types.ObjectId, name: string}[] = []
        let user
        while (user = await cursor.next()) out.push({id: user._id, name: user.name})
        return out
    }
    public static async validatePassword(session: string, password: string) {
        const cluster = await this.userCluster()
        const user = await cluster.findOne<ServerUserTypes.User>({ sessions: { $all: [session] } })
        if (!user) return false
        if (user.password !== this.hashPassword(password)) return false
        return true
    }
    public static async changeName(id: Types.ObjectId, newName: string) {
        const cluster = await this.userCluster()
        return cluster.updateOne({_id: id}, {name: newName})
    }
    public static async changeUsername(id: Types.ObjectId, newUsername: string) {
        const cluster = await this.userCluster()
        return cluster.updateOne({_id: id}, {username: newUsername})
    }
    public static async changePassword(id: Types.ObjectId, newPassword: string) {
        const cluster = await this.userCluster()
        return cluster.updateOne({_id: id}, {password: this.hashPassword(newPassword)})
    }
    public static async getByGroup(id: Types.ObjectId): Promise<ServerUserTypes.User[]> {
        const cluster = await this.userCluster()
        const cursor = cluster.find<ServerUserTypes.User>({groups: { $in: [id]}})
        const users = []

        let next
        while (next = await cursor.next())
            users.push(next)
        return users
    } 
}

export default Users