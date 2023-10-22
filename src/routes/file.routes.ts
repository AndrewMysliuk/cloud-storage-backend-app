import { Router } from "express"
import authMiddleware from "../middleware/auth.middleware"
import fileController from "../controllers/fileController"

const router = Router()

router.post("/create-directory", authMiddleware, fileController.createDir)
router.post("/upload", authMiddleware, fileController.uploadFile)
router.get("/get-files", authMiddleware, fileController.fetchFiles)
router.get("/download", authMiddleware, fileController.downloadFile)
router.get("/search", authMiddleware, fileController.searchFile)
router.delete("/delete", authMiddleware, fileController.deleteFile)

export default router
