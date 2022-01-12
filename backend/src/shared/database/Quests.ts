import { connection, FilterQuery, model, Schema, Types, _FilterQuery } from "mongoose"
import { IQuest } from "src/types/Database"

const schema = new Schema<IQuest>({
    _id: Types.ObjectId,
    name: String,
    description: String,
    requirements: Object,
    rewards: Object,
    submissions: Array,
})

const Model = model<IQuest>("quest", schema)

export const getQuests = async (query: any): Promise<IQuest[]> => {
    let out: IQuest[] = []
    for await (const doc of collection().find<IQuest>(query)) {
        out.push(doc)
    }
    return out
}

export const getQuest = async (id: string) => {
    const data = await collection().findOne<IQuest>(({_id: new Types.ObjectId(id)}))
    
    return data
}

export const addSubmission = (fileNames: string[], text: string, userId: string, questId: string) => {
    collection().updateOne({_id: new Types.ObjectId(questId)}, {$push: {submissions: {
        userId: userId,
        files: fileNames,
        text: text,
        submitedAt: new Date()
    }}})
}

const collection = () => connection.collection("quests")