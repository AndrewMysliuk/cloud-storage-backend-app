import fs from "fs"
import { IFile } from "../models/File"
import { DataRequest } from "../models/Requests"

class FileService {
  createDir(req: DataRequest, file: IFile) {
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

  deleteFile(req: DataRequest, file: IFile) {
    const path = this.getPath(req, file)
    if (file.type === "dir") {
      fs.rmdirSync(path)
    } else {
      fs.unlinkSync(path)
    }
  }

  getPath(req: DataRequest, file: IFile) {
    return `${req.file_path}/${file.user}/${file.path}`
  }
}

export default new FileService()
