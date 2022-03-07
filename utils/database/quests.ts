import { connection, Types } from "mongoose"
import { Connect } from ".";
import { ServerQuestTypes } from "./types/quests"
import { ServerUserTypes } from "./types/users"

class Quests {
    private static questCluster = async () => {await Connect(); return connection.collection("quests")}
    public static async getAvailibleQuests(user: ServerUserTypes.User) {
        const cluster = await this.questCluster()
        const cursor = cluster.find<ServerQuestTypes.Quest>({ "requirements.groups": { $in: [user.groups] }, "requirements.level": { $lte: user.level } })
        const quests: ServerQuestTypes.Quest[] = []
        let next
        while(next = await cursor.next()) 
            quests.push(next)
        
            
        return quests
    }
    public static async getQuestByIdWithUser(user: ServerUserTypes.User, id: Types.ObjectId) {
        const cluster = await this.questCluster()
        const quest = cluster.findOne<ServerQuestTypes.Quest>({ "requirements.groups": { $in: [user.groups] }, "requirements.level": { $lte: user.level }, _id: id })
        return quest
    }
    public static async getQuestById(id: Types.ObjectId) {
        const cluster = await this.questCluster()
        const quest = cluster.findOne<ServerQuestTypes.Quest>({ _id: id })
        return quest
    }
    public static async addSubmission(
        id: Types.ObjectId, userId: Types.ObjectId, files: string[], originalFiles: string[], text: string
    ) {
        const cluster = await this.questCluster()
        cluster.updateOne({ _id: id }, {
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