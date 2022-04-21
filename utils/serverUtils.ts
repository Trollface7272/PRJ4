import { Types } from "mongoose"
import { ClientQuestTypes, ServerQuestTypes } from "@database/types/quests";
import { ClientShopTypes, ServerShopTypes } from "@database/types/shop";
import { ServerUserTypes, ClientUserTypes } from "@database/types/users";
import { ServerResponse } from "http";
import { Quests, Users, Shop } from "./database";

export const validateSession = async (session: string, res: ServerResponse) => {
    if (!await Users.isSessionValid(session)) {
        res.setHeader("location", "/login");
        res.statusCode = 302;
        res.end();
        return { props: {} }
    }
    return null
}

export const getUserData = async (session: string): Promise<[ServerUserTypes.User, ClientUserTypes.User]> => {
    const backendUser = await Users.fromSession(session) as ServerUserTypes.User
    const frontendUser: ClientUserTypes.User = {
        _id: backendUser._id.toString(),
        name: backendUser.name,
        username: backendUser.username,
        coins: backendUser.coins,
        level: backendUser.level,
        xp: backendUser.xp,
        permissions: backendUser.permissions
    }
    return [backendUser, frontendUser]
}

export const getUserNames = async (): Promise<[{id: Types.ObjectId, name: string}[], {id: string, name: string}[]]> => {
    const backendNames = await Users.getUserNames()
    const frontendNames = backendNames.map(el => ({id: el.id.toString(), name: el.name}))

    return [backendNames, frontendNames]
}

export const getQuests = async (user: ServerUserTypes.User): Promise<[ServerQuestTypes.Quest[], ClientQuestTypes.Quest[]]> => {
    const backendQuests = await Quests.getAvailibleQuests(user)
    const frontendQuests: ClientQuestTypes.Quest[] = backendQuests.map(quest => ({
        _id: quest._id.toString(),
        description: quest.description,
        name: quest.name,
        rewards: quest.rewards,
        submissions: quest.submissions?.map(submission => ({
            files: submission.files,
            submitedAt: submission.submitedAt.toString(),
            text: submission.text,
            userId: submission.userId.toString(),
            type: submission.type,
            points: submission.points || 0
        })) || null
    }))
    return [backendQuests, frontendQuests]
}

export const getQuest = async (user: ServerUserTypes.User, id: string): Promise<[ServerQuestTypes.Quest, ClientQuestTypes.Quest]> => {
    const backendQuest = await Quests.getQuestByIdWithUser(user, new Types.ObjectId(id))
    if (!backendQuest) throw { message: "Not found" }
    const frontendQuest: ClientQuestTypes.Quest = {
        _id: backendQuest._id.toString(),
        description: backendQuest.description,
        name: backendQuest.name,
        rewards: backendQuest.rewards,
        submissions: backendQuest.submissions?.map(el => ({
            userId: el.userId.toString(),
            files: el.files,
            text: el.text,
            submitedAt: el.submitedAt.toString()
        } as ClientQuestTypes.QuestSubmissions))
    }
    return [backendQuest, frontendQuest]
}

export const getShopItems = async (user: ServerUserTypes.User): Promise<[ServerShopTypes.Item[], ClientShopTypes.Item[]]> => {
    const backendItems = await Shop.getAvailibleItems(user)
    const frontendItems: ClientShopTypes.Item[] = backendItems.map(item => ({
        _id: item._id.toString(),
        description: item.description,
        requirements: {
            groups: item.requirements.groups.map(e => e.toString()),
            level: item.requirements.level
        },
        purchases: [],
        name: item.name,
        cost: item.cost,
        stock: item.stock
    }))
    return [backendItems, frontendItems]
}

export const calculateLevel = (xp: number) => {
    const level = Math.floor(xp / (250 * 1.5))
    return level
}