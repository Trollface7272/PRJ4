import { connection, Types } from "mongoose"
import { IShopItem } from "src/types/Database"

export namespace Shop {

    export const customQuery = async (query: any) => {
        let out: IShopItem[] = []

        for await (const doc of collection().find<IShopItem>(query)) {
            out.push(doc)
        }
        return out
    }

    export const getItemById = async (id: string) => {
        const res = await collection().findOne<IShopItem>({ _id: new Types.ObjectId(id) })

        return res
    }

}

const collection = () => connection.collection("shopitems")