import { Router } from "express"
import authMiddleware from "../middleware/auth.middleware"
import { validateRegistration } from "../middleware/validation.middleware"
import authController from "../controllers/authController"

const router = Router()

router.post("/registration", validateRegistration, authController.registration)
router.post("/login", authController.login)
router.get("/get_me", authMiddleware, authController.getMe)

export default router
