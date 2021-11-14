import { Router } from 'express'
import { getLocalization } from './Localizations'
import { getAllVisibleQuests } from './Quests'
import { getAllUsers, addOneUser, updateOneUser, deleteOneUser, isSessionValid, getUser } from './Users'


// User-route
const userRouter = Router()
userRouter.get('/all', getAllUsers)
userRouter.post('/add', addOneUser)
userRouter.put('/update', updateOneUser)
userRouter.delete('/delete/:id', deleteOneUser)

userRouter.post('/session', isSessionValid)
userRouter.post('/user', getUser)

// Localization-route
const localizationRouter = Router()
localizationRouter.get("/get", getLocalization)

// Quests-route
const questsRouter = Router()
questsRouter.post("/load", getAllVisibleQuests)


// Export the base-router
const baseRouter = Router()
baseRouter.use('/users', userRouter)
baseRouter.use('/local', localizationRouter)
baseRouter.use("/quests", questsRouter)
export default baseRouter
