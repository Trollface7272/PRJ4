import { connection, Types } from "mongoose"
import { Connect } from "."
import { ServerShopTypes } from "./types/shop"
import { ServerUserTypes } from "./types/users"

class Shop {
    private static shopCluster = async () => {await Connect(); return connection.collection("shopitems")}
    public static async getAvailibleItems(user: ServerUserTypes.User) {
        const cluster = await this.shopCluster()
        const cursor = cluster.find<ServerShopTypes.Item>({ "requirements.groups": { $in: [user.groups] }, "requirements.level": { $lte: user.level } })
        const items: ServerShopTypes.Item[] = []
        let next
        while(next = await cursor.next()) 
            items.push(next)
        
            
        return items
    }
    public static async getByGroup(id: Types.ObjectId) {
        const cluster = await this.shopCluster()
        const cursor = cluster.find<ServerShopTypes.Item>({"requirements.groups": {$all: [id]}})

        const items = []
        let next
        while (next = await cursor.next())
            items.push(next)
        return items
    }
}

export default Shop