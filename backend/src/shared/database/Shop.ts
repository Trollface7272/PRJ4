import { connection } from "mongoose"
import { IShopItem } from "src/types/Database"


export const getShopItems = async (query: any) => {
    let out: IShopItem[] = []
    
    for await (const doc of collection().find<IShopItem>(query)) {
        out.push(doc)
    }
    return out
}



const collection = () => connection.collection("shopitems")