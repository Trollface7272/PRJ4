import { Router } from 'express'
import { getLocalization } from './Localizations'
import { getAllVisibleQuests, getQuest, submitQuest } from './Quests'
import { getAllVisibleItems } from './Shop'
import { getAllUsers, isSessionValid, getUser, login } from './Users'


// User-route
const userRouter = Router()
userRouter.get('/all', getAllUsers)
userRouter.post('/session', isSessionValid)
userRouter.post('/user', getUser)
userRouter.post('/login', login)

// Localization-route
const localizationRouter = Router()
localizationRouter.get("/get", getLocalization)

// Quests-route
const questsRouter = Router()
questsRouter.post("/load", getAllVisibleQuests)
questsRouter.post("/quest/:id", getQuest)
questsRouter.post("/submit/:id", submitQuest)

// Shop-route
const shopRouter = Router()
shopRouter.post("/load", getAllVisibleItems)
shopRouter.post("/item/:id", )
shopRouter.post("/submit/:id", )


// Export the base-router
const baseRouter = Router()
baseRouter.use('/users', userRouter)
baseRouter.use('/local', localizationRouter)
baseRouter.use("/quests", questsRouter)
baseRouter.use("/shop", shopRouter)
export default baseRouter
