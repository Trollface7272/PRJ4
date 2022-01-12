import { Types } from "mongoose"
import { IUser } from "src/types/Database"

// Put shared constants here
export const isDev = true

export const emptyUser: IUser = {
    _id: new Types.ObjectId("111111111111111111111111"),
    name: "",
    username: "",
    password: "",
    sessions: [""],
    coins: 0,
    groups: [],
    level: 0,
    xp: 0
}
export const paramMissingError = 'One or more of the required parameters was missing.'
