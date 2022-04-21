import { connection, Types } from "mongoose"
import { Connect } from "."
import { ServerShopTypes } from "./types/shop"
import { ServerUserTypes } from "./types/users"

class Shop {
    private static shopCluster = async () => { await Connect(); return connection.collection("shopitems") }
    public static async getAvailibleItems(user: ServerUserTypes.User) {
        const cluster = await this.shopCluster()
        const cursor = cluster.find<ServerShopTypes.Item>({ "requirements.groups": { $all: user.groups }, "requirements.level": { $lte: user.level } })
        const items: ServerShopTypes.Item[] = []
        let next
        while (next = await cursor.next())
            items.push(next)


        return items
    }
    public static async getByGroup(id: Types.ObjectId) {
        const cluster = await this.shopCluster()
        const cursor = cluster.find<ServerShopTypes.Item>({ "requirements.groups": { $all: [id] } })

        const items = []
        let next
        while (next = await cursor.next())
            items.push(next)
        return items
    }
    public static async getById(id: Types.ObjectId) {
        const cluster = await this.shopCluster()
        const item = await cluster.findOne<ServerShopTypes.Item>({ _id: id })
        return item
    }
    public static async addPurchase(itemId: Types.ObjectId, userId: Types.ObjectId) {
        const cluster = await this.shopCluster()
        await cluster.updateOne({ _id: itemId }, { $push: { purchases: { userId: userId, date: new Date() } } })
    }
    public static async updateStock(itemId: Types.ObjectId, stock: number) {
        const cluster = await this.shopCluster()
        await cluster.updateOne({ _id: itemId }, { $inc: { stock: stock } })
    }
    public static async addItem(name: string, description: string, groups: string[], level: number, price: number, stock: number) {
        const cluster = await this.shopCluster()
        return await cluster.insertOne({ name: name, description: description, requirements: { groups: groups.map(e => new Types.ObjectId(e)), level: level }, cost: price, stock: stock })
    }
}

export default Shop