import { Types } from "mongoose"
import { ServerMessageTypes, ClientMessageTypes } from "@database/types/messages";
import { ClientQuestTypes, ServerQuestTypes } from "@database/types/quests";
import { ClientShopTypes, ServerShopTypes } from "@database/types/shop";
import { ServerUserTypes, ClientUserTypes } from "@database/types/users";
import { ServerResponse } from "http";
import { Quests, Users, Messages, Shop } from "./database";

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
        xp: backendUser.xp
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
        rewards: quest.rewards
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
        submissions: backendQuest.submissions
    }
    return [backendQuest, frontendQuest]
}

export const getShopItems = async (user: ServerUserTypes.User): Promise<[ServerShopTypes.Item[], ClientShopTypes.Item[]]> => {
    const backendItems = await Shop.getAvailibleItems(user)
    const frontendItems: ClientShopTypes.Item[] = backendItems.map(item => ({
        _id: item._id.toString(),
        description: item.description,
        name: item.name,
        cost: item.cost,
        stock: item.cost
    }))
    return [backendItems, frontendItems]
}

export const getMessages = async (user: ServerUserTypes.User): Promise<[ServerMessageTypes.Message[], ClientMessageTypes.Message[]]> => {
    const backendMessages = await Messages.getAllMessages(user)
    const frontendMessages: ClientMessageTypes.Message[] = backendMessages.map(msg => ({
        _id: msg._id.toString(),
        text: msg.text,
        fileNames: msg.fileNames,
        originalNames: msg.originalNames,
        to: {
            isMe: msg.to.isMe,
            _id: msg.to._id.toString(),
            name: msg.to.name
        },
        from: {
            isMe: msg.from.isMe,
            _id: msg.from._id.toString(),
            name: msg.from.name
        }
    }))
    return [backendMessages, frontendMessages]
}

export const getMessage = async (user: ServerUserTypes.User, id: string): Promise<[ServerMessageTypes.Message, ClientMessageTypes.Message]> => {
    const backendMessage = await Messages.getMessageByIdWithUser(user, new Types.ObjectId(id))
    if (!backendMessage) throw { message: "Not found" }
    const frontendMessage: ClientMessageTypes.Message = {
        _id: backendMessage._id.toString(),
        text: backendMessage.text,
        fileNames: backendMessage.fileNames,
        originalNames: backendMessage.originalNames,
        to: {
            isMe: backendMessage.to.isMe,
            _id: backendMessage.to._id.toString(),
            name: backendMessage.to.name
        },
        from: {
            isMe: backendMessage.from.isMe,
            _id: backendMessage.from._id.toString(),
            name: backendMessage.from.name
        }
    }
    return [backendMessage, frontendMessage]
}