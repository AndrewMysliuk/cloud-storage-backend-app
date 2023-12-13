import { Router } from "express"
import { verifySession } from "supertokens-node/recipe/session/framework/express"
import authMiddleware from "../middleware/auth.middleware"
import fileController from "../controllers/fileController"

const router = Router()

router.post("/create-directory", verifySession(), authMiddleware, fileController.createDir)
router.post("/upload", verifySession(), authMiddleware, fileController.uploadFile)
router.post("/rename", verifySession(), authMiddleware, fileController.renameFile)
router.get("/get-files", verifySession(), authMiddleware, fileController.fetchFiles)
router.get("/download", verifySession(), authMiddleware, fileController.downloadFile)
router.get("/search", verifySession(), authMiddleware, fileController.searchFile)
router.delete("/delete", verifySession(), authMiddleware, fileController.deleteFile)

export default router
