import fileService from "../services/fileService"
import config from "config"
import fs from "fs"
import User from "../models/User"
import File, { IFile } from "../models/File"
import { Response } from "express"
import { UserJwtPayload, DataRequest } from "../models/Requests"
import fileUpload, { UploadedFile } from "express-fileupload"
import uuid from "uuid"

class FileController {
  async createDir(req: DataRequest, res: Response) {
    try {
      const { name, type, parent } = req.body
      const file = new File({
        type,
        name,
        parent,
        user: (req.user as UserJwtPayload).id,
      })
      const parentFile = await File.findOne({ _id: parent })
      if (!parentFile) {
        file.path = name
        await fileService.createDir(req, file)
      } else {
        file.path = `${parentFile.path}/${file.name}`
        await fileService.createDir(req, file)
        parentFile?.childs?.push(file._id)
        await parentFile.save()
      }

      await file.save()
      return res.json(file)
    } catch (e) {
      console.log(e)
      return res.status(500).json(e)
    }
  }

  async fetchFiles(req: DataRequest, res: Response) {
    try {
      const { sort } = req.query
      let files = null
      switch (sort) {
        case "name":
          files = await File.find({
            user: (req.user as UserJwtPayload).id,
            parent: req.query.parent,
          }).sort({ name: 1 })
          break
        case "date":
          files = await File.find({
            user: (req.user as UserJwtPayload).id,
            parent: req.query.parent,
          }).sort({ date: 1 })
          break
        case "type":
          files = await File.find({
            user: (req.user as UserJwtPayload).id,
            parent: req.query.parent,
          }).sort({ type: 1 })
          break
        default:
          files = await File.find({
            user: (req.user as UserJwtPayload).id,
            parent: req.query.parent,
          })
          break
      }

      return res.json(files)
    } catch (e) {
      console.log(e)
      return res.status(500).json(e)
    }
  }

  async uploadFile(req: DataRequest, res: Response) {
    try {
      const file = req.files?.file as fileUpload.UploadedFile

      const parent = await File.findOne({
        user: (req.user as UserJwtPayload).id,
        _id: req.body.parent,
      })
      const user = await User.findOne({
        _id: (req.user as UserJwtPayload).id,
      })

      if (!user) {
        return res.status(500).json({ message: "user not found" })
      }

      if (user.used_space + file.size > user.drive_space) {
        return res
          .status(500)
          .json({ message: "You haven't any space on the drive" })
      }

      user.used_space = user.used_space + file.size

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

      const type = file.name.split(".").pop()
      let filePath = file.name
      if (parent) {
        filePath = `${parent.path}/${file.name}`
      }
      const dbFile = new File({
        name: file.name,
        type,
        size: file.size,
        path: filePath,
        parent: parent ? parent._id : null,
        user: user?._id,
      })

      await dbFile.save()
      await user.save()

      return res.json(dbFile)
    } catch (e) {
      console.log(e)
      return res.status(500).json(e)
    }
  }

  async downloadFile(req: DataRequest, res: Response) {
    try {
      const file = (await File.findOne({
        _id: req.query.id,
        user: (req.user as UserJwtPayload).id,
      })) as IFile
      const path = fileService.getPath(req, file)

      if (fs.existsSync(path)) {
        return res.download(path, file!.name)
      }

      return res.status(500).json({ message: "file not found" })
    } catch (e) {
      console.log(e)
      return res.status(500).json(e)
    }
  }

  async deleteFile(req: DataRequest, res: Response) {
    try {
      const file = await File.findOne({
        _id: req.query.id,
        user: (req.user as UserJwtPayload).id,
      })
      if (!file) {
        return res.status(500).json({ message: "file not found" })
      }

      fileService.deleteFile(req, file)
      await file.deleteOne({
        _id: req.query.id,
        user: (req.user as UserJwtPayload).id,
      })

      return res.json({ message: "file has been deleted" })
    } catch (e) {
      console.log(e)
      return res.status(500).json(e)
    }
  }

  async searchFile(req: DataRequest, res: Response) {
    try {
      const searchName = req.query.search_name as string

      let files = await File.find({ user: (req.user as UserJwtPayload).id })
      files = files.filter((file: IFile) =>
        file.name.toLowerCase().includes(searchName.toLowerCase())
      )

      return res.json(files)
    } catch (e) {
      console.log(e)
      return res.status(500).json(e)
    }
  }

  async uploadAvatar(req: DataRequest, res: Response) {
    try {
      const file = req.files?.file as UploadedFile
      const user = await User.findById((req.user as UserJwtPayload).id)

      if (!user) {
        return res.status(500).json({ message: "user not found" })
      }

      const avatarName = uuid.v4() + ".jpg"
      file.mv(`${req?.static_path}/${avatarName}`)
      user.avatar = avatarName
      await user.save()

      return res.json(user)
    } catch (e) {
      console.log(e)
      return res.status(500).json(e)
    }
  }

  async deleteAvatar(req: DataRequest, res: Response) {
    try {
      const user = await User.findById((req.user as UserJwtPayload).id)

      if (!user) {
        return res.status(500).json({ message: "user not found" })
      }

      fs.unlinkSync(`${req?.static_path}/${user?.avatar}`)
      user.avatar = null
      await user.save()

      return res.json(user)
    } catch (e) {
      console.log(e)
      return res.status(500).json(e)
    }
  }
}

export default new FileController()
