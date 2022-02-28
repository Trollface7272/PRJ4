import { connection } from "mongoose"
import { ServerShopTypes } from "./types/shop"
import { ServerUserTypes } from "./types/users"

class Shop {
    private static shopCluster = () => connection.collection("shopitems")
    public static async getAvailibleItems(user: ServerUserTypes.User) {
        const cursor = this.shopCluster().find<ServerShopTypes.Item>({ "requirements.groups": { $in: [user.groups] }, "requirements.level": { $lte: user.level } })
        const items: ServerShopTypes.Item[] = []
        let next
        while(next = await cursor.next()) 
            items.push(next)
        
            
        return items
    }
}

export default Shop