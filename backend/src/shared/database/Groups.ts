import { connection, model, Schema, Types } from "mongoose"
import { IGroup, IUser } from "src/types/Database"



const schema = new Schema<IGroup>({
    _id: Types.ObjectId,
    name: String,
    admin: Boolean,
    teacher: Boolean,
    student: Boolean,
    permissions: Object
})

const Model = model<IGroup>("group", schema)

export const getGroup = async (id: string) => {
    const res = await collection().findOne({_id: new Types.ObjectId(id)})

    return res
}

export const getPermissions = async (user: IUser) => {
    const groups: IGroup[] = []
    for (let group of user.groups) {
        const data = await collection().findOne<IGroup>({_id: new Types.ObjectId(group)})
        if (data) groups.push(data)
    }
    if (groups.length < 1) return
    const group = groups.pop()!

    for (let nextGroup of groups) {
        group.admin = group.admin || nextGroup.admin
        group.teacher = (group.teacher || nextGroup.teacher) && !group.admin
        group.student = (group.student || nextGroup.student) && (!group.admin || group.teacher)
        group.permissions.profile.avatarChange = group.permissions.profile.avatarChange || nextGroup.permissions.profile.avatarChange
        group.permissions.profile.nameChange = group.permissions.profile.nameChange || nextGroup.permissions.profile.nameChange
        group.permissions.profile.passwordChange = group.permissions.profile.passwordChange || nextGroup.permissions.profile.passwordChange
        group.permissions.profile.usernameChange = group.permissions.profile.usernameChange || nextGroup.permissions.profile.usernameChange
    }
    return group   
}

const collection = () => connection.collection("groups")