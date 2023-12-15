import { Router } from "express"
// import { verifySession } from "supertokens-node/recipe/session/framework/express"
import centrifugeController from "../controllers/centrifugeController"

const router = Router()

router.post("/publish", centrifugeController.centrifugePublish)

export default router
