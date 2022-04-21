import { randomUUID } from "crypto"
import { connection, Types } from "mongoose"
import { calculateLevel } from "utils/serverUtils"
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
        while (next = await cursor.next()) {
            next.permissions = await Groups.getPermissions(next)
            users.push(next)
        }
            
        return users
    }
    public static async getNameFromId(id: Types.ObjectId): Promise<string> {
        const cluster = await this.userCluster()
        const user = await cluster.findOne<ServerUserTypes.User>({_id: id})
        if (!user) return ""
        return user.name
    }
    public static async updateCoins(id: Types.ObjectId, amount: number) {
        const cluster = await this.userCluster()
        return cluster.updateOne({_id: id}, {$inc: {coins: amount}})
    }
    public static async updateXp(id: Types.ObjectId, amount: number) {
        const cluster = await this.userCluster()
        this.recalculateLevel(id)
        return cluster.updateOne({_id: id}, {$inc: {xp: amount}})
    }
    public static async addUser(name: string, username: string, groups: string[], password: string) {
        const cluster = await this.userCluster()
        const user = {
            name,
            username,
            password: this.hashPassword(password),
            groups,
            xp: 0,
            coins: 0,
            level: 0,
            sessions: []
        }
        return cluster.insertOne(user)
    }
    private static async recalculateLevel(userId: Types.ObjectId) {
        const cluster = await this.userCluster()
        const user = await cluster.findOne<ServerUserTypes.User>({_id: userId})
        if (!user) return
        const level = calculateLevel(user.xp)
        console.log(level);
        
        return cluster.updateOne({_id: userId}, {$set: {level}})
    }
}

export default Users