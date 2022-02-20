import { Router } from 'express'
import { getMessage, loadMessages, onSubmit } from './Messages'
import { getNewNotifications } from './Notifications'
import { getAllVisibleQuests, getQuest, submitQuest } from './Quests'
import { buyItem, getAllVisibleItems } from './Shop'
import { getAllUsers, isSessionValid, getUser, login, changeUsername, changeName, changePassword, getPermissions, getNames } from './Users'


// User-route
const userRouter = Router()
userRouter.get('/all', getAllUsers)
userRouter.post('/session', isSessionValid)
userRouter.post('/user', getUser)
userRouter.post('/login', login)
userRouter.post('/permissions', getPermissions)
userRouter.post('/changeusername', changeUsername)
userRouter.post('/changename', changeName)
userRouter.post('/changepassword', changePassword)
userRouter.post('/getnames', getNames)

// Quests-route
const questsRouter = Router()
questsRouter.post("/load", getAllVisibleQuests)
questsRouter.post("/quest/:id", getQuest)
questsRouter.post("/submit/:id", submitQuest)

// Shop-route
const shopRouter = Router()
shopRouter.post("/load", getAllVisibleItems)
shopRouter.post("/buy", buyItem)

// Shop-route
const messagesRouter = Router()
messagesRouter.post("/send", onSubmit)
messagesRouter.post("/load", loadMessages)
messagesRouter.post("/message/:id", getMessage)

// Notifications-route
const notificationsRouter = Router()
notificationsRouter.post("/all", getNewNotifications)

// Export the base-router
const baseRouter = Router()
baseRouter.use('/users', userRouter)
baseRouter.use("/quests", questsRouter)
baseRouter.use("/shop", shopRouter)
baseRouter.use("/notifications", notificationsRouter)
baseRouter.use("/messages", messagesRouter)
export default baseRouter
