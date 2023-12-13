import { Router } from "express"
import { verifySession } from "supertokens-node/recipe/session/framework/express"
import authMiddleware from "../middleware/auth.middleware"
import authController from "../controllers/authController"

const router = Router()

router.post("/registration", authController.registration)
router.post("/login", authController.login)
router.get("/get_me", verifySession(), authMiddleware, authController.getMe)

export default router
