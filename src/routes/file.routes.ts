import { Router } from "express"
import authMiddleware from "../middleware/auth.middleware"
import fileController from "../controllers/fileController"

const router = Router()

router.post("", authMiddleware, fileController.createDir)
router.post("/upload", authMiddleware, fileController.uploadFile)
router.post("/avatar", authMiddleware, fileController.uploadAvatar)
router.get("", authMiddleware, fileController.fetchFiles)
router.get("/download", authMiddleware, fileController.downloadFile)
router.get("/search", authMiddleware, fileController.searchFile)
router.delete("/delete", authMiddleware, fileController.deleteFile)
router.delete("/avatar", authMiddleware, fileController.deleteAvatar)

export default router
