import fs from "fs"
import { IFile, FileTypeEnum } from "../models/IFile"
import { IDataRequest } from "../models/IRequests"

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
      fs.rmdirSync(path)
    } else {
      fs.unlinkSync(path)
    }
  }

  getPath(req: IDataRequest, file: IFile) {
    return `${req.file_path}/${file.owner}/${file.path}`
  }
}

export default new FileService()
