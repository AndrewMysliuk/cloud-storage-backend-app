import fileService from "../services/fileService"
import fs from "fs"
import User from "../models/IUser"
import File, { IFile, FileTypeEnum, FileStatusEnum } from "../models/IFile"
import { Response } from "express"
import { IDataRequest, IUserJwtPayload } from "../models/IRequests"
import fileUpload from "express-fileupload"
import { timestamp, uuid } from "../models/ICommon"

class FileController {
  async createDir(req: IDataRequest, res: Response) {
    try {
      const { name, parent }: { name: string; parent: uuid } = req.body
      const file = new File<IFile>({
        type: FileTypeEnum.DIRECTORY,
        name,
        parent,
        owner: (req.user as IUserJwtPayload).id as uuid,
        path: "",
        status: FileStatusEnum.CREATED,
        created_at: new Date().toISOString() as unknown as timestamp,
        updated_at: new Date().toISOString() as unknown as timestamp,
      } as IFile)

      const parentFile = await File.findOne({ _id: parent })

      if (!parentFile) {
        file.path = name
        await fileService.createDir(req, file)
      } else {
        file.path = `${parentFile.path}/${file.name}`
        await fileService.createDir(req, file)
        parentFile?.child?.push(file._id)
        await parentFile.save()
      }

      await file.save()
      return res.json(file)
    } catch (e) {
      return res.status(500).json(e)
    }
  }

  async fetchFiles(req: IDataRequest, res: Response) {
    try {
      const files = await File.find({
        owner: (req.user as IUserJwtPayload).id,
        parent: req.query.parent === "null" ? null : req.query.parent,
      }).sort({ date: 1 })

      return res.json(files)
    } catch (e) {
      return res.status(500).json(e)
    }
  }

  async uploadFile(req: IDataRequest, res: Response) {
    try {
      const file = req.files?.file as fileUpload.UploadedFile

      const parent = await File.findOne({
        owner: (req.user as IUserJwtPayload).id,
        _id: req.body.parent,
      })
      const user = await User.findOne({
        _id: (req.user as IUserJwtPayload).id,
      })

      if (!user) {
        return res.status(500).json({ message: "user not found" })
      }

      if (user.storage_used + file.size > user.storage_limit) {
        return res.status(500).json({ message: "You haven't any space on the drive" })
      }

      user.storage_used = user.storage_used + file.size

      let path = null
      if (parent) {
        path = `${req.file_path}/${user?._id}/${parent.path}/${file.name}`
      } else {
        path = `${req.file_path}/${user?._id}/${file.name}`
      }

      if (fs.existsSync(path)) {
        return res.status(500).json({ message: "File already exist" })
      }
      file.mv(path)

      const type = FileTypeEnum.FILE
      const extension = file.name.split(".").pop() as string
      let filePath = file.name
      if (parent) {
        filePath = `${parent.path}/${file.name}`
      }
      const dbFile = new File<IFile>({
        name: file.name,
        extension,
        type,
        size: file.size,
        path: filePath,
        parent: parent ? parent._id : null,
        owner: user?._id,
        status: FileStatusEnum.UPLOADED,
        created_at: new Date().toISOString() as unknown as timestamp,
        updated_at: new Date().toISOString() as unknown as timestamp,
      } as IFile)

      await dbFile.save()
      await user.save()

      if (parent) {
        parent.child = [...(parent?.child ?? []), dbFile._id]
      }

      await parent?.save()

      return res.json(dbFile)
    } catch (e) {
      console.log(e)
      return res.status(500).json(e)
    }
  }

  async downloadFile(req: IDataRequest, res: Response) {
    try {
      const file = (await File.findOne({
        _id: req.query.id,
        owner: (req.user as IUserJwtPayload).id,
      })) as IFile
      const path = fileService.getPath(req, file)

      if (fs.existsSync(path)) {
        return res.download(path, file.name)
      }

      return res.status(500).json({ message: "file not found" })
    } catch (e) {
      return res.status(500).json(e)
    }
  }

  async deleteFile(req: IDataRequest, res: Response) {
    try {
      const file = await File.findOne({
        _id: req.query.id,
        owner: (req.user as IUserJwtPayload).id,
      })

      if (!file) {
        return res.status(500).json({ message: "file not found" })
      }

      fileService.deleteFile(req, file)
      await file.deleteOne({
        _id: req.query.id,
        owner: (req.user as IUserJwtPayload).id,
      })

      return res.json({ message: "file has been deleted" })
    } catch (e) {
      return res.status(500).json(e)
    }
  }

  async renameFile(req: IDataRequest, res: Response) {
    try {
      const { id, name }: { id: uuid; name: string } = req.body

      const file = await File.findOne({
        _id: id,
        owner: (req.user as IUserJwtPayload).id,
      })

      if (!file) {
        return res.status(500).json({ message: "file not found" })
      }

      const oldPath = file.path
      const newPath = oldPath.replace(/[^/]*$/, name)

      let newFullPath = `${req.file_path}/${file.owner}/${newPath}`

      if (file.type === FileTypeEnum.FILE) newFullPath = `${newFullPath}.${file.extension}`

      fs.renameSync(`${req.file_path}/${file.owner}/${oldPath}`, newFullPath)

      file.path = `${newPath}.${file.extension}`
      file.name = `${name}.${file.extension}`
      await file?.save()

      await fileService.updateChildPaths(oldPath, newPath, file.owner)

      return res.json(file)
    } catch (e) {
      return res.status(500).json(e)
    }
  }

  async searchFile(req: IDataRequest, res: Response) {
    try {
      const searchName = req.query.search_name as string

      let files = await File.find({ owner: (req.user as IUserJwtPayload).id })
      files = files.filter((file: IFile) => file.name.toLowerCase().includes(searchName.toLowerCase()))

      return res.json(files)
    } catch (e) {
      return res.status(500).json(e)
    }
  }
}

export default new FileController()
