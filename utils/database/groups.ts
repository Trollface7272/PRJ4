import { Connect } from ".";
import { connection } from "mongoose"
import { ServerGroupTypes } from "./types/groups";
import { ServerUserTypes } from "./types/users";

class Groups {
    private static groupsCluster = async () => { await Connect(); return connection.collection("groups") }
    public static async getUserGroups(user: ServerUserTypes.User) {
        const cluster = await this.groupsCluster()
        const cursor = cluster.find<ServerGroupTypes.Group>({ "_id": { $in: user.groups } })
        const groups: ServerGroupTypes.Group[] = []
        let next
        while (next = await cursor.next())
            groups.push(next)

        return groups
    }
    public static async getPermissions(user: ServerUserTypes.User) {
        const cluster = await this.groupsCluster()
        const cursor = cluster.find<ServerGroupTypes.Group>({ "_id": { $in: user.groups } })
        let permissions: ServerUserTypes.UserPermissions = {
            admin: false,
            teacher: false,
            student: false,
            profile: {
                avatarChange: false,
                nameChange: false,
                passwordChange: false,
                usernameChange: false
            },
            users: {
                addUsers: false,
                assignGroups: false
            }
        }
        let next
        while (next = await cursor.next()) {
            permissions = {
                admin: permissions.admin || next.admin,
                teacher: permissions.teacher || next.teacher,
                student: permissions.student || next.student,
                profile: {
                    avatarChange: permissions.profile.avatarChange || next.profile.avatarChange,
                    nameChange: permissions.profile.nameChange || next.profile.nameChange,
                    passwordChange: permissions.profile.passwordChange || next.profile.passwordChange,
                    usernameChange: permissions.profile.usernameChange || next.profile.usernameChange
                },
                users: {
                    addUsers: permissions.users.addUsers || next.users.addUsers,
                    assignGroups: permissions.users.assignGroups || next.users.assignGroups
                }
            }
        }
        return permissions
    }
}

export default Groups