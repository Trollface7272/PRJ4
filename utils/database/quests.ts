import { connection, Types } from "mongoose"
import { Connect } from ".";
import { ClientQuestTypes, ServerQuestTypes } from "./types/quests"
import { ServerUserTypes } from "./types/users"

class Quests {
    private static questCluster = async () => { await Connect(); return connection.collection("quests") }
    public static async getAvailibleQuests(user: ServerUserTypes.User) {
        const cluster = await this.questCluster()
        const cursor = cluster.find<ServerQuestTypes.Quest>({ "requirements.groups": { $all: user.groups }, "requirements.level": { $lte: user.level } })
        const quests: ServerQuestTypes.Quest[] = []
        let next
        while (next = await cursor.next())
            quests.push(next)


        return quests
    }
    public static async getQuestByIdWithUser(user: ServerUserTypes.User, id: Types.ObjectId) {
        const cluster = await this.questCluster()
        const quest = cluster.findOne<ServerQuestTypes.Quest>({ "requirements.groups": { $all: user.groups }, "requirements.level": { $lte: user.level }, _id: id })
        return quest
    }
    public static async getQuestById(id: Types.ObjectId) {
        const cluster = await this.questCluster()
        const quest = cluster.findOne<ServerQuestTypes.Quest>({ _id: id })
        return quest
    }
    public static async addSubmission(
        id: Types.ObjectId, userId: Types.ObjectId, files: string[], text: string
    ) {
        const cluster = await this.questCluster()
        if (await cluster.findOne({ _id: id, "submissions.userId": new Types.ObjectId(userId) })) return console.log("Already has submitted")
        cluster.updateOne({ _id: id }, {
            $push: {
                submissions: {
                    type: "submitted",
                    userId: userId,
                    files: files,
                    text: text,
                    submitedAt: new Date()
                }
            }
        })
    }
    public static async getByGroup(id: Types.ObjectId) {
        const cluster = await this.questCluster()
        const cursor = cluster.find<ServerQuestTypes.Quest>({ "requirements.groups": { $all: [id] } })

        const quests = []
        let next
        while (next = await cursor.next())
            quests.push(next)
        return quests
    }
    public static async gradeSubmission(
        questId: Types.ObjectId, userId: Types.ObjectId, type: "graded" | "returned" | "failed", points: number = 0
    ) {
        const cluster = await this.questCluster()
        cluster.updateOne({ _id: questId, "submissions.userId": userId }, {
            $set: {
                "submissions.$.type": type,
                "submissions.$.points": points
            }
        })
    }
    public static async addQuest(name: string, description: string, groups: string[], level: number, xp: number, coins: number) {
        const cluster = await this.questCluster()
        cluster.insertOne({
            name, description, requirements: {groups: groups.map(e => new Types.ObjectId(e)), level}, rewards: { xp, coins }
        })
    }
}

export default Quests