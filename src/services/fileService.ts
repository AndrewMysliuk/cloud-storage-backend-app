import fs from "fs"
import File, { IFile, FileTypeEnum } from "../models/IFile"
import { IDataRequest } from "../models/IRequests"
import { uuid } from "../models/ICommon"

class FileService {
  createDir(req: IDataRequest, file: IFile) {
    const filePath = this.getPath(req, file)

    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath)
          return resolve({ message: "File has been created" })
        } else {
          return reject({ message: "File already exist" })
        }
      } catch (e) {
        return reject({ message: "File error" })
      }
    })
  }

  deleteFile(req: IDataRequest, file: IFile) {
    const path = this.getPath(req, file)
    if (file.type === FileTypeEnum.DIRECTORY) {
      fs.rmSync(path, { recursive: true })
    } else {
      fs.unlinkSync(path)
    }
  }

  getPath(req: IDataRequest, file: IFile) {
    return `${req.file_path}/${file.owner}/${file.path}`
  }

  async updateChildPaths(oldPath: string, newPath: string, ownerId: uuid) {
    const children = await File.find({ path: new RegExp(`^${oldPath}`), owner: ownerId })

    for (const child of children) {
      const childNewPath = child.path.replace(oldPath, newPath)
      child.path = childNewPath
      await child.save()

      if (child.child && child.child.length) {
        await this.updateChildPaths(child.path, childNewPath, ownerId)
      }
    }
  }

  async deleteFilesAndFolder(req: IDataRequest, folderId: uuid) {
    const folder = await File.findOne({ _id: folderId, owner: req?.user_id })

    if (!folder) {
      throw new Error("folder not found")
    }

    if (folder.type === FileTypeEnum.DIRECTORY) {
      const childFiles = await File.find({ parent: folder._id, owner: req?.user_id })

      for (const child of childFiles) {
        await this.deleteFilesAndFolder(req, child._id)
      }
    }

    this.deleteFile(req, folder)

    await File.deleteOne({ _id: folder._id, owner: req?.user_id })
  }
}

export default new FileService()
