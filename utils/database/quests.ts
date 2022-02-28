import { connection, Types } from "mongoose"
import { ServerQuestTypes } from "./types/quests"
import { ServerUserTypes } from "./types/users"

class Quests {
    private static questCluster = () => connection.collection("quests")
    public static async getAvailibleQuests(user: ServerUserTypes.User) {
        const cursor = this.questCluster().find<ServerQuestTypes.Quest>({ "requirements.groups": { $in: [user.groups] }, "requirements.level": { $lte: user.level } })
        const quests: ServerQuestTypes.Quest[] = []
        let next
        while(next = await cursor.next()) 
            quests.push(next)
        
            
        return quests
    }
    public static async getQuestByIdWithUser(user: ServerUserTypes.User, id: Types.ObjectId) {
        const quest = this.questCluster().findOne<ServerQuestTypes.Quest>({ "requirements.groups": { $in: [user.groups] }, "requirements.level": { $lte: user.level }, _id: id })
        return quest
    }
    public static async getQuestById(id: Types.ObjectId) {
        const quest = this.questCluster().findOne<ServerQuestTypes.Quest>({ _id: id })
        return quest
    }
    public static async addSubmission(
        id: Types.ObjectId, userId: Types.ObjectId, files: string[], originalFiles: string[], text: string
    ) {
        this.questCluster().updateOne({ _id: id }, {
            $push: {
                submissions: {
                    userId: userId,
                    files: files,
                    originalNames: originalFiles,
                    text: text,
                    submitedAt: new Date()
                }
            }
        })
    }
}

export default Quests